import { notFound } from 'next/navigation';
import Image from 'next/image';
import dbConnection from '@/lib/dbConnect';
import Job from '@/model/JobSchema';
import { JobDocument } from '@/model/JobSchema';
import ApplyButton from '@/components/ApplyButton';
import { Calendar, Briefcase, MapPin, DollarSign, Clock, Globe } from 'lucide-react';

interface JobDetailsProps {
  params: {
    id: string;
  };
}

export default async function JobDetails({ params }: JobDetailsProps) {
  await dbConnection();
  const job = (await Job.findById(params.id).lean()) as JobDocument | null;

  if (!job) {
    notFound();
  }

  const companyWebsite = job.companyWebsite.startsWith('http')
    ? job.companyWebsite
    : `https://${job.companyWebsite}`;

  return (
    <div className="container mx-auto py-8 px-4 lg:px-0">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:flex-shrink-0">
            {job.companyLogo && job.companyLogo.secure_url && (
              <div className="h-48 w-full md:w-48 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <Image
                  src={job.companyLogo.secure_url}
                  alt={`${job.company} logo`}
                  width={150}
                  height={150}
                  className="object-contain"
                />
              </div>
            )}
          </div>
          <div className="p-8">
            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">{job.company}</div>
            <h1 className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">{job.jobTitle}</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">{job.location} {job.remote && '(Remote)'}</p>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700">
          <dl>
            <div className="bg-gray-50 dark:bg-gray-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                <Briefcase className="h-5 w-5 mr-2" />
                Job Type
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">{job.jobType}</dd>
            </div>
            <div className="bg-white dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Experience Required
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">{job.experience} years</dd>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                Salary
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">${job.salary.toLocaleString()}</dd>
            </div>
            <div className="bg-white dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Positions Available
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">{job.positions}</dd>
            </div>
          </dl>
        </div>

        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Job Description</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">{job.description}</p>
        </div>

        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Required Skills</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {job.skills.map((skill: string, index: number) => (
              <span key={index} className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-800 dark:text-indigo-100">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-900 px-4 py-5 sm:px-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Additional Information</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                <Globe className="h-5 w-5 inline mr-2" />
                <a href={companyWebsite} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                  Company Website
                </a>
              </p>
              <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                <Calendar className="h-5 w-5 inline mr-2" />
                Posted on: {new Date(job.createdAt).toLocaleDateString()}
              </p>
              <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                <Calendar className="h-5 w-5 inline mr-2" />
                Updated on: {new Date(job.updatedAt).toLocaleDateString()}
              </p>
            </div>
            <div className="mt-16 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105">
              <ApplyButton jobId={params.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}