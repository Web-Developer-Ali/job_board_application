import { NextResponse, NextRequest } from "next/server";
import Job from "@/model/JobSchema";
import dbConnection from "@/lib/dbConnect";
import { uploadOnCloudinary, deleteFromCloudinary } from "@/lib/cloudinary";
import { promisify } from "util";
import fs from "fs";
import path from "path";
import os from "os";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

export const dynamic = 'force-dynamic';

interface UploadedFile {
  public_id: string;
  secure_url: string;
}

interface UpdateData {
  [key: string]: string | string[] | UploadedFile | boolean;
}

// Promisify unlink function for async use
const unlinkAsync = promisify(fs.unlink);

// Define temporary directory path for image uploads
const tempDir = path.join(os.tmpdir(), "job-portal");

if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

export async function PUT(req: NextRequest) {
  // Connect to the database
  await dbConnection();

  // Get the session from the request
  const session = await getServerSession(authOptions);
  // Check if the session exists, otherwise return an unauthorized error
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get formData from the request
    const formData = await req.formData();

    if (!formData) {
      return NextResponse.json({ message: "No data found" }, { status: 400 });
    }

    const jobId = formData.get("jobId"); // Replace "jobId" with the actual key if different

    if (!jobId) {
      return NextResponse.json({ message: "Job ID is missing from form data" }, { status: 400 });
    }
    // Extract fields from formData
    const updateData: UpdateData = {};
    let uploadedFile: { public_id: string; secure_url: string } | null = null;
    let oldImagePublicId: string | null = null;

    // Loop through formData entries
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        // Handle file upload
        const tempFilePath = path.join(tempDir, value.name);
        const buffer = Buffer.from(await value.arrayBuffer());

        // Write file to the temporary path
        fs.writeFileSync(tempFilePath, buffer);

        // Upload the new image to Cloudinary
        const cloudinaryResult = await uploadOnCloudinary(
          tempFilePath,
          "JobPortal"
        );

        // Store uploaded file details
        uploadedFile = {
          public_id: cloudinaryResult.public_id,
          secure_url: cloudinaryResult.secure_url,
        };

        // Clean up the temporary file
        await unlinkAsync(tempFilePath);
      } else {
        // Check if the key is 'skills' and handle it accordingly
        if (key === "skills") {
          // If skills already exists, append to the array; otherwise, initialize it
          if (updateData[key]) {
            // Ensure it's an array
            if (!Array.isArray(updateData[key])) {
              updateData[key] = [updateData[key] as string]; // Convert to array
            }
            // Push the new skill
            updateData[key].push(value.toString());
          } else {
            // If it doesn't exist, initialize with the current skill
            updateData[key] = [value.toString()];
          }
        } else {
          // For other fields, just assign the value
          updateData[key] = value.toString();
        }
      }
    }

    // Find the existing job to get the old image public ID (if any)
    const existingJob = await Job.findById(jobId);
    if (!existingJob) {
      return NextResponse.json({ message: "Job not found" }, { status: 404 });
    }

    // If there's a new image, delete the old one from Cloudinary (if it exists)
    if (uploadedFile) {
      oldImagePublicId = existingJob.companyLogo.public_id; // Assuming this field is stored in the database

      if (oldImagePublicId) {
        await deleteFromCloudinary(oldImagePublicId);
      }

      // Update the image URL and public ID in the job details
      updateData.companyLogo = {
        secure_url: uploadedFile.secure_url,
        public_id: uploadedFile.public_id,
      };
    }

    // Update the job in the database
    const updatedJob = await Job.findByIdAndUpdate(jobId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedJob) {
      return NextResponse.json({ message: "Job not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Job updated successfully", job: updatedJob },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating job:", error);
    return NextResponse.json(
      { message: "Error updating job", error: error },
      { status: 500 }
    );
  }
}

// GET request to fetch job details
export async function GET(req: NextRequest) {
  // Connect to the database
  await dbConnection();

  try {
    // Extract the 'id' from the URL query parameters
    const id = req.nextUrl.searchParams.get("id");

    // Check if 'id' is provided
    if (!id) {
      return NextResponse.json({ message: "ID is required" }, { status: 400 });
    }

    // Fetch the job by ID
    const job = await Job.findById(id);

    if (!job) {
      return NextResponse.json({ message: "Job not found" }, { status: 404 });
    }

    return NextResponse.json(job, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Server error", error },
      { status: 500 }
    );
  }
}