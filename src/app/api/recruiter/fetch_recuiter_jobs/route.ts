import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/options';
import dbConnection from '@/lib/dbConnect';
import Job from '@/model/JobSchema';

export const dynamic = 'force-dynamic';

// GET request to fetch all jobs posted by the recruiter
export async function GET() {
  try {
    // Get the session from the request
    const session = await getServerSession(authOptions);
    // Check if the session exists, otherwise return an unauthorized error
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const recruiterId = session.user._id;

    // Connect to the MongoDB database
    await dbConnection();

    // Find jobs in the collection where the createdBy matches the session user's ID
    const jobs = await Job.find({ createdBy: recruiterId }).exec();
    // Return the jobs in the response
    return NextResponse.json(jobs, { status: 200 });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
