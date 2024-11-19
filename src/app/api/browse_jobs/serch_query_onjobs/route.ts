import Job from '@/model/JobSchema';
import { NextResponse } from 'next/server';

interface JobFilter {
  live: boolean;
  $or?: Array<{
    jobTitle?: { $regex: string; $options: string };
    company?: { $regex: string; $options: string };
  }>;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const searchQuery = searchParams.get('searchQuery') || '';
  const page = parseInt(searchParams.get('page') || '1', 10); // Default to page 1
  const limit = parseInt(searchParams.get('limit') || '10', 10); // Default limit to 10 results per page
  // Build filter condition to search by job title or company
  const filter: JobFilter = { live: true };

  if (searchQuery) {
    filter.$or = [
      { jobTitle: { $regex: searchQuery, $options: 'i' } }, // Case-insensitive search on job title
      { company: { $regex: searchQuery, $options: 'i' } }   // Case-insensitive search on company name
    ];
  }

  try {
    // Fetch filtered jobs from the database with pagination and projection for optimization
    const jobs = await Job.find(filter)
      .skip((page - 1) * limit) // Implement pagination
      .limit(limit); // Limit the number of results

    // Get the total count of matching documents for pagination metadata
    const totalJobs = await Job.countDocuments(filter);

    // Return the paginated result with metadata
    return NextResponse.json({
      jobs,
      currentPage: page,
      totalPages: Math.ceil(totalJobs / limit),
      totalJobs
    });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error fetching jobs', error: error },
      { status: 500 }
    );
  }
}
