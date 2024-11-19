import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnection from "@/lib/dbConnect";
import Applicant from "@/model/ApplicantSchema";
import { authOptions } from "../../auth/[...nextauth]/options";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    // Connect to the database
    await dbConnection();

    // Get the user's session
    const session = await getServerSession(authOptions);

    // Check if the user is authenticated
    if (!session || !session.user || session.user.role === "recruiter") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!session.user.resumeUrl) {
      return NextResponse.json(
        { message: "Please complete your Profile (Add Resume)" },
        { status: 400 }
      );
    }

    const url = new URL(request.url);
    const jobId = url.searchParams.get("id");

    if (!jobId) {
      return NextResponse.json({ message: "Job Id is required" }, { status: 400 });
    }

    // Check if the user has already applied for this job
    const existingApplication = await Applicant.findOne({
      email: session.user.email,
      job: jobId,
    });

    if (existingApplication) {
      return NextResponse.json(
        { message: "You have already applied for this job." },
        { status: 400 }
      );
    }

    // Count the number of applicants for this job
    const applicantCount = await Applicant.countDocuments({ job: jobId });

    // Create a new applicant using data from the session
    const newApplicant = new Applicant({
      name: session.user.name,
      email: session.user.email,
      resumeUrl: session.user.resumeUrl,
      job: jobId,
      applicant_id: session.user._id, 
      acceptingApplications: true, 
      status: "Pending", 
      numberof_applicant: applicantCount + 1
    });

    // Save the applicant to the database
    await newApplicant.save();

    // Return a success response along with the total number of applicants
    return NextResponse.json(
      { message: "Application submitted successfully!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error applying for job:", error);
    return NextResponse.json(
      { error: "Failed to apply for job" },
      { status: 500 }
    );
  }
}
