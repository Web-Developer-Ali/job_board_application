import dbConnection from '@/lib/dbConnect';
import Job from '@/model/JobSchema';
import { NextResponse } from 'next/server';


export async function GET() {
  try {
    // Establish DB connection
    await dbConnection();

    // Fetch the most popular locations (limit to top 5)
    const locations = await Job.aggregate([
      { $group: { _id: "$location", count: { $sum: 1 } } },
      { $sort: { count: -1 } }, // Sort by count, descending
      { $limit: 5 }, // Limit to top 5 locations
    ]);

    // Fetch the most common salary ranges (limit to top 5)
    const salaryRanges = await Job.aggregate([
      {
        $bucket: {
          groupBy: "$salary", // Group by salary
          boundaries: [50000, 100000, 150000, 200000, 1000000], // Salary ranges
          default: "Other", // Default bucket
          output: { count: { $sum: 1 } }, // Count of jobs in each bucket
        },
      },
      { $sort: { "_id": 1 } }, // Sort by the salary range (ascending)
      { $limit: 5 }, // Limit to top 5 salary ranges
    ]);

    // Send the filter data as a response
    return NextResponse.json({
      locations: locations.map((location) => location._id),
      salaryRanges: salaryRanges.map((range) => range._id),
    },{ status: 200 });
  } catch (error) {
    console.error('Error fetching filters:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

