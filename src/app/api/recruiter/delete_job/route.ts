// src/app/api/jobs/[id]/route.ts
import { NextResponse } from 'next/server';
import Job from '@/model/JobSchema';
import dbConnection from '@/lib/dbConnect'; 
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/options';
import { deleteFromCloudinary } from '@/lib/cloudinary';

// The DELETE function now receives params for extracting the ID
export async function DELETE(req: Request) {
    const url = new URL(req.url); 
    const id = url.searchParams.get("id"); // Extract the ID from the search parameters
  

  // Connect to the database
  await dbConnection();

  if (!id) {
    return NextResponse.json({ message: 'Job ID is required' }, { status: 400 });
  }

  try {
    // Get the session to retrieve the user ID
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user._id; // Assuming the user ID is stored in session.user.id

    // Find the existing job
    const job = await Job.findById(id);

    if (!job) {
      return NextResponse.json({ message: 'Job not found' }, { status: 404 });
    }

    // Check if the job was created by the logged-in user
    if (job.createdBy.toString() !== userId) {
      return NextResponse.json({ message: 'You do not have permission to delete this job' }, { status: 403 });
    }
// delete comapny logo from cloudinary
    if (job.companyLogo) {
       const Cloudinary_PublicId = job.companyLogo.public_id;
       await deleteFromCloudinary(Cloudinary_PublicId);
    }

    // Delete the job
    await Job.deleteOne({ _id: id });

    return NextResponse.json({ message: 'Job deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting job:', error);
    return NextResponse.json({ message: 'Error deleting job', error: error }, { status: 500 });
  }
}
