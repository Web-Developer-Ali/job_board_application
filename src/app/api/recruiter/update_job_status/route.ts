import { NextResponse } from "next/server";
import dbConnection from "@/lib/dbConnect";
import Applicant from "@/model/ApplicantSchema";
import { sendEmail } from "@/helper/sendVerificationEmail"
export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    // Check if the applicant ID is provided
    if (!id) {
      return NextResponse.json(
        { error: "Applicant ID is required" },
        { status: 400 }
      );
    }

    // Parse the JSON body to get the status
    const body = await request.json();
    const status = body.status;
    if (typeof status !== 'string' || status.trim() === '') {
      return NextResponse.json(
        { error: "Invalid status provided" },
        { status: 400 }
      );
    }

    // Connect to the database
    await dbConnection();

    // Fetch the applicant to check the `is_statusChange` flag
    const applicant = await Applicant.findById(id);

    if (!applicant) {
      return NextResponse.json(
        { error: "Applicant not found" },
        { status: 404 }
      );
    }

    // Check if the status change is allowed
    if (applicant.is_statusChange) {
      return NextResponse.json(
        {
          error: "Status change is not allowed for this applicant. You already changed it.",
        },
        { status: 403 }
      );
    }

    // Update the applicant's status in the database
    const updatedApplicant = await Applicant.findByIdAndUpdate(
      id,
      { status, is_statusChange: true },
      { new: true } // Option to return the updated document
    );

    if (status.toLowerCase() === "accepted") {
      try {
        await sendEmail({
          type: "jobStatus",
          userEmail: updatedApplicant.email,
          username: updatedApplicant.name,
          jobStatus: status,
          jobTitle: updatedApplicant.jobTitle || "the applied position", // Fallback title
        });
      } catch (emailError) {
        console.error("Failed to send email notification:", emailError);
        // Optionally, you can log the error or notify the admin
      }
    }

    // Return a success response with the updated applicant data
    return NextResponse.json({
      message: "Application status updated successfully!",
      applicant: updatedApplicant,
    });
  } catch (error) {
    console.error("Error updating applicant status:", error);
    return NextResponse.json(
      { error: "Failed to update applicant status", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}