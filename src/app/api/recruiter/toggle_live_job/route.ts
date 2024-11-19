// src/app/api/jobs/[id]/route.ts
import { NextResponse } from "next/server";
import Job from "@/model/JobSchema" 
import dbConnection from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";


export async function PATCH(req: Request) {
  await dbConnection(); 

  const url = new URL(req.url); 
  const id = url.searchParams.get("id"); 
  const { live } = await req.json(); 

  // Validate input
  if (typeof live !== "boolean") {
    return NextResponse.json(
      { message: "Invalid input: live must be a boolean" },
      { status: 400 }
    );
  }

  // Get the user session
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json(
      { message: "Unauthorized: You must be logged in to perform this action." },
      { status: 401 }
    );
  }

  try {
    // Find the job by ID
    const job = await Job.findById(id);
    
    // If job not found, return a 404 error
    if (!job) {
      return NextResponse.json({ message: "Job not found" }, { status: 404 });
    }

    // Check if the user is the creator of the job
    if (!job.createdBy.equals(session.user._id)) {
      return NextResponse.json(
        { message: "Unauthorized: You can only update your own job postings." },
        { status: 403 }
      );
    }

    // Update the live field
    job.live = live;
    await job.save(); // Save the updated job

    // Return the updated job
   if (live) {
    return NextResponse.json({ message: 'Your Job is Lived Now' }, { status: 200 });
   }
   return NextResponse.json({ message: 'Your Job is Offline Now' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error", error }, { status: 500 });
  }
}