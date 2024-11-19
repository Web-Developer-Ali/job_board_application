import { NextResponse } from "next/server";
import Job from "@/model/JobSchema";
import dbConnection from "@/lib/dbConnect";
import { PipelineStage } from "mongoose";

export async function GET() {
  try {
    // Connect to the database
    await dbConnection();

    // Fetch the searchParams if needed (e.g., to limit the number of popular jobs.
    const limit = 8;

    // Define the aggregation pipeline
    const aggregationPipeline: PipelineStage[] = [
      { $match: { live: true } }, // Only consider live jobs
      {
        $addFields: {
          // Calculate popularity based on positions and number of applicants
          popularity: { $add: ["$positions", { $size: "$applicants" }] },
        },
      },
      { $sort: { popularity: -1 } }, // Sort by popularity (most popular first)
      { $limit: limit }, // Limit the results based on the provided parameter
      {
        $project: {
          jobTitle: 1,
           _id: 0
        },
      },
    ];

    // Execute the aggregation pipeline
    const popularJobs = await Job.aggregate(aggregationPipeline);

    // Return the results
    return NextResponse.json({
      popularJobs,
    });
  } catch (error) {
    console.error("Error fetching popular jobs:", error);
    return NextResponse.json(
      { error: "Failed to fetch popular jobs" },
      { status: 500 }
    );
  }
}
