import { NextResponse } from 'next/server';
import dbConnection from '@/lib/dbConnect';
import Applicant from '@/model/ApplicantSchema';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/options';

export async function GET(request: Request) {
  // Connect to the database
 await dbConnection();

   // Get the user's session
   const session = await getServerSession(authOptions);

   // Check if the user is authenticated
   if (!session || !session.user || session.user.role === "candidate") {
     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
   }

  // Get the job ID from the query parameters
  const { searchParams } = new URL(request.url);
  const jobId = searchParams.get('id');
  if (!jobId) {
    return NextResponse.json({ message: 'Job ID is required' }, { status: 400 });
  }

  try {
    // Fetch all applicants associated with the job ID
    const applicants = await Applicant.find({ job: jobId }).populate('job', 'jobTitle');
    return NextResponse.json(applicants);
  } catch (error) {
    console.error('Error fetching applicants:', error);
    return NextResponse.json({ message: 'Error fetching applicants' }, { status: 500 });
  }
}


