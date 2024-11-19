import dbConnection from "@/lib/dbConnect";
import Job from "@/model/JobSchema";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    await dbConnection();

    const popularJobs = await Job.find({ live: true })
      .sort({ applicants: -1 }) // Sort by number of applicants (descending)
      .limit(10)
      .limit(9);
    return NextResponse.json({ jobs: popularJobs });
  } catch (error) {
    console.error("Error fetching popular jobs:", error);
    return NextResponse.json(
      { error: "Error fetching popular jobs" },
      { status: 500 }
    );
  }
};
