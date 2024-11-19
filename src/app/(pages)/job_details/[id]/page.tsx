// JobDetails.tsx
import { notFound } from 'next/navigation';
import Image from 'next/image';
import dbConnection from '@/lib/dbConnect';
import Job from '@/model/JobSchema';
import { JobDocument } from '@/model/JobSchema';
import ApplyButton from '@/components/ApplyButton';

interface JobDetailsProps {
  params: {
    id: string;
  };
}

// Keep this as a server component
const JobDetails = async ({ params }: JobDetailsProps) => {
  // Connect to the database
  await dbConnection();
  const id = params.id;

  // Fetch the job by ID
  const job = (await Job.findById(id).lean()) as JobDocument | null;
  // If the job is not found, show a 404 page
  if (!job) {
    notFound();
  }

  const companyWebsite = job.companyWebsite.startsWith('http')
    ? job.companyWebsite
    : `https://${job.companyWebsite}`;

  return (
    <div className="container mx-auto py-8 px-4 dark:bg-gray-700">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 transition duration-300 ease-in-out">
        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">{job.jobTitle}</h1>

        {job.companyLogo && job.companyLogo.secure_url && (
          <div className="flex justify-center mb-6">
            <Image
              src={job.companyLogo.secure_url}
              alt={`${job.company} logo`}
              width={150}
              height={150}
              className="object-cover rounded-md"
            />
          </div>
        )}

        <p className="text-gray-700 dark:text-gray-300 mb-2">
          <span className="font-semibold text-gray-900 dark:text-white">Company:</span> {job.company}
        </p>

        <p className="text-gray-700 dark:text-gray-300 mb-2">
          <span className="font-semibold text-gray-900 dark:text-white">Location:</span> {job.location} {job.remote && '(Remote)'}
        </p>

        <p className="text-gray-700 dark:text-gray-300 mb-2">
          <span className="font-semibold text-gray-900 dark:text-white">Job Type:</span> {job.jobType}
        </p>

        <p className="text-gray-700 dark:text-gray-300 mb-2">
          <span className="font-semibold text-gray-900 dark:text-white">Experience Required:</span> {job.experience} years
        </p>

        <p className="text-gray-700 dark:text-gray-300 mb-2">
          <span className="font-semibold text-gray-900 dark:text-white">Salary:</span> ${job.salary.toLocaleString()}
        </p>

        <p className="text-gray-700 dark:text-gray-300 mb-2">
          <span className="font-semibold text-gray-900 dark:text-white">Description:</span> {job.description}
        </p>

        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Skills Required</h3>
          <ul className="list-disc list-inside ml-4 text-gray-700 dark:text-gray-300">
            {job.skills.map((skill: string, index: number) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>
        </div>

        <p className="text-gray-700 dark:text-gray-300 mb-2">
          <span className="font-semibold text-gray-900 dark:text-white">Positions Available:</span> {job.positions}
        </p>

        <div className="mt-8">
          <p className="text-gray-600 dark:text-gray-400">
            <span className="font-semibold text-gray-900 dark:text-white">Company Website:</span>{' '}
            <a
              href={companyWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline dark:text-blue-400"
            >
              {companyWebsite}
            </a>
          </p>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            <span className="font-semibold text-gray-900 dark:text-white">Posted on:</span> {new Date(job.createdAt).toLocaleDateString()}
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            <span className="font-semibold text-gray-900 dark:text-white">Updated on:</span> {new Date(job.updatedAt).toLocaleDateString()}
          </p>
        </div>

        <div className="mt-4 w-30 inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
          <ApplyButton jobId={id}/>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
