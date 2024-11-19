import dbConnection from "@/lib/dbConnect";
import Applicant from "@/model/ApplicantSchema";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";
import Job from "@/model/JobSchema";

export async function GET() {
    const session = await getServerSession(authOptions);

    // Check if the user is authenticated and not a recruiter
    if (!session || !session.user || session.user.role === "recruiter") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        await dbConnection();
        // Fetch applicants associated with the logged-in user and populate job details
        const applicants = await Applicant.find({ applicant_id: session.user._id })
            .populate({
                path: 'job',
                model: Job ,
                select: 'jobTitle company live',
            });

        // Map the applicants to extract desired details including job information
        const result = applicants.map(applicant => ({
            name: applicant.name,
            email: applicant.email,
            appliedAt: applicant.appliedAt,
            status: applicant.status,
            jobTitle: applicant.job?.jobTitle,
            company: applicant.job?.company
        }));
        return NextResponse.json(result);
    } catch (error) {
        console.error('Error retrieving applied jobs:', error);
        return NextResponse.json({ message: 'Failed to retrieve applied jobs' }, { status: 500 });
    }
}
