import Job from "@/model/JobSchema";
import { NextResponse } from "next/server";

// Function to fetch job suggestions based on searchQuery
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const searchQuery = searchParams.get("searchQuery")?.trim().toLowerCase() || "";

  // Early exit if the searchQuery is empty
  if (!searchQuery) {
    return NextResponse.json({ jobTitles: [], companies: [] });
  }

  // Set up the case-insensitive regex filter for jobTitle and company
  const regexSearch = { $regex: searchQuery, $options: "i" };

  // MongoDB query to search jobTitle or company
  const filter = {
    $or: [
      { jobTitle: regexSearch },
      { company: regexSearch }
    ]
  };

  try {
    // Limit the number of database queries and fields returned
    const suggestions = await Job.find(filter)
      .select("jobTitle company") // Only fetch jobTitle and company fields
      .limit(6) // Return only 6 suggestions
      .lean(); // Use .lean() to return plain JavaScript objects for better performance

    // Separate jobTitles and companies
    const jobTitles = suggestions.map((job) => job.jobTitle);
    const companies = suggestions.map((job) => job.company);

    // Return different responses based on available data
    if (jobTitles.length > 0 && companies.length === 0) {
      return NextResponse.json({ jobTitles });
    }
    if (companies.length > 0 && jobTitles.length === 0) {
      return NextResponse.json({ companies });
    }

    return NextResponse.json({ jobTitles, companies });
  } catch (error) {
    // Log error for debugging and monitoring in production
    console.error("Error fetching job suggestions:", error);

    // Return a generic error message with status 500
    return NextResponse.json(
      { message: "Error fetching job suggestions" },
      { status: 500 }
    );
  }
}
