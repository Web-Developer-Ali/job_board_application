import { NextResponse } from "next/server";
import Job from "@/model/JobSchema";
import dbConnection from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";


// Route handler to fetch the three most recent jobs for a recruiter
export async function GET() {
  await dbConnection();
  const session = await getServerSession(authOptions);

  // Check if the user is authenticated and if they are a recruiter
  if (!session || !session.user || session.user.role !== "recruiter") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const recruiterId = session.user._id;

    // Fetch the three most recent jobs created by the recruiter
    const jobs = await Job.find({ createdBy: recruiterId })
      .sort({ createdAt: -1 }) // Sort by createdAt in descending order
      .limit(3) // Limit to the first three results
      .select("jobTitle company createdAt") // Select required fields
      .exec();

  

    return NextResponse.json(jobs , { status: 200 });
  } catch (error) {
    console.error("Error fetching recent jobs for recruiter:", error);
    return NextResponse.json({ message: "Error fetching jobs" }, { status: 500 });
  }
}
