import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import fs from "fs";
import path from "path";
import os from "os";
import { promisify } from "util";
import { uploadOnCloudinary } from "@/lib/cloudinary";
import Job from "@/model/JobSchema"; // Adjust the path to the Job schema
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnection from "@/lib/dbConnect";

interface UploadedFile {
  fieldName: string;
  public_id: string;
  secure_url: string;
}
interface JobData {
  jobTitle?: string;
  applyLink?: string;
  jobType?: string;
  location?: string;
  remote?: boolean;
  description?: string;
  company?: string;
  companyWebsite?: string;
  experience?: number;
  positions?: number;
  skills?: string[];
  salary?: number;
  companyLogo?: { public_id: string; secure_url: string };
  createdBy?: string;
}

// Promisify unlink function for async use
const unlinkAsync = promisify(fs.unlink);

// Define temporary directory path for image uploads
const tempDir = path.join(os.tmpdir(), "job-portal");

if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

export async function POST(request: Request) {
  try {
    await dbConnection();

    // Extract the session token using getToken (instead of getSession)
    const session = await getServerSession(authOptions);

    if (!session || session.user.role === "candidate") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Parse form data from the request
    const formData = await request.formData();
    if (formData === null) {
      return NextResponse.json(
        { message: "Please enter all fields" },
        { status: 400 }
      );
    }

    // Initialize an object to hold the extracted data
    const data: Partial<JobData> = {};
    data.skills = []; // Initialize skills as an array

    // Store file metadata
    const uploadedFiles:UploadedFile[] = [];

    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        const tempFilePath = path.join(tempDir, value.name);
        const buffer = Buffer.from(await value.arrayBuffer());

        fs.writeFileSync(tempFilePath, buffer);

        const cloudinaryResult = await uploadOnCloudinary(
          tempFilePath,
          "JobPortal"
        );

        uploadedFiles.push({
          fieldName: key,
          public_id: cloudinaryResult.public_id,
          secure_url: cloudinaryResult.secure_url,
        });

        await unlinkAsync(tempFilePath);
      } else if (key === "skills") {
        // If the key is skills, push the value into the skills array
        (data.skills as string[]).push(value.toString());
      } else {
        data[key as keyof JobData] = value.toString() as never; 
      }
    }

    const companyLogo = uploadedFiles[0]
      ? {
          public_id: uploadedFiles[0].public_id,
          secure_url: uploadedFiles[0].secure_url,
        }
      : undefined;

      const jobData: JobData = {
        jobTitle: data.jobTitle || "", 
        applyLink: data.applyLink || "",
        jobType: data.jobType || "",
        location: data.location || "",
        remote: data.remote || false,
        description: data.description || "",
        company: data.company || "",
        companyWebsite: data.companyWebsite || "",
        experience: data.experience || 0, 
        positions: data.positions || 0,
        skills: data.skills || [],
        salary: data.salary || 0,
        companyLogo: companyLogo,
        createdBy: session?.user?._id || "",
      };
      
      

    const newJob = await Job.create(jobData);

    return NextResponse.json(
      { message: "Job created successfully", job: newJob },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error during job creation:", err);
    return NextResponse.json({ message: "Error", error: err }, { status: 500 });
  }
}
