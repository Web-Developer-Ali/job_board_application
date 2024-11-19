import { NextResponse } from 'next/server';
import dbConnection from '@/lib/dbConnect';
import Applicant from '@/model/ApplicantSchema';

export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
   
    // Check if the applicant ID is provided
    if (!id) {
      return NextResponse.json({ error: 'Applicant ID is required' }, { status: 400 });
    }

    // Parse the JSON body to get the status
    const { status }: { status: string } = await request.json();

    // Connect to the database
    await dbConnection();

    // Update the applicant's status in the database
    const updatedApplicant = await Applicant.findByIdAndUpdate(
      id,
      { status: status },
      { new: true } // Option to return the updated document
    );

    // Check if the applicant was found and updated
    if (!updatedApplicant) {
      return NextResponse.json({ error: 'Applicant not found' }, { status: 404 });
    }

    // Return a success response with the updated applicant data
    return NextResponse.json({
      message: 'Application status updated successfully!',
      applicant: updatedApplicant,
    });
  } catch (error) {
    console.error('Error updating applicant status:', error);
    return NextResponse.json({ error: 'Failed to update applicant status' }, { status: 500 });
  }
}
