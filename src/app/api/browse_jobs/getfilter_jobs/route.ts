import dbConnection from '@/lib/dbConnect';
import Job from '@/model/JobSchema';
import { PipelineStage } from 'mongoose';
import { isRateLimited } from '@/lib/rateLimiter';

interface QueryType {
  live?: boolean;
  salary?: { $lte: number };
  jobType?: string;
  location?: { $regex: RegExp };
}

export async function GET(request: Request) {
  try {
    // Retrieve the user's IP address from the x-forwarded-for header
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor
      ? forwardedFor.split(',')[0]
      : request.headers.get('x-real-ip') || '';

    if (!ip) {
      return new Response(
        JSON.stringify({ error: 'Unable to determine IP address.' }),
        { status: 400 }
      );
    }

    // Check if the IP is rate-limited
    if (isRateLimited(ip)) {
      return new Response(
        JSON.stringify({ message: 'Too many requests. Please try again later.' }),
        { status: 429 }
      );
    }

    await dbConnection();

    // Parse query parameters
    const url = new URL(request.url);
    const salary = url.searchParams.get('salary');
    const type = url.searchParams.get('type');
    const location = url.searchParams.get('location');
    const page = Number(url.searchParams.get('page') || 1);
    const limit = Number(url.searchParams.get('limit') || 10);

    const query: QueryType = { live: true };

    if (salary) {
      const salaryNum = Number(salary);
      if (!isNaN(salaryNum)) {
        query.salary = { $lte: salaryNum };
      }
    }
    if (type) query.jobType = type;
    if (location) query.location = { $regex: new RegExp(location, 'i') };

    const aggregationPipeline: PipelineStage[] = [
      { $match: query },
      {
        $facet: {
          jobs: [{ $skip: (page - 1) * limit }, { $limit: limit }],
          salaryRange: [
            {
              $group: {
                _id: null,
                minSalary: { $min: '$salary' },
                maxSalary: { $max: '$salary' },
              },
            },
          ],
        },
      },
      {
        $project: {
          jobs: 1,
          salaryRange: { $arrayElemAt: ['$salaryRange', 0] },
        },
      },
    ];

    const result = await Job.aggregate(aggregationPipeline);

    if (result.length === 0) {
      return new Response(
        JSON.stringify({ jobs: [], page }),
        { status: 200 }
      );
    }

    const { jobs } = result[0]; // Only returning jobs data
    return new Response(
      JSON.stringify({ jobs, page }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch jobs' }),
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
