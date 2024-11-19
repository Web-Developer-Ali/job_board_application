"use client";
import React from "react";
import { FaBriefcase, FaMoneyBillWave, FaClock } from "react-icons/fa";
import { useRouter } from "next/navigation";
import ApplyButton from "./ApplyButton";
import Image from "next/image";

interface JobCardProps {
  companyPhoto: string;
  jobTitle: string;
  companyName: string;
  location: string;
  description: string;
  requiredSkills: string[];
  salaryRange: string;
  jobId: string;
  jobType: string;
  applyLink: string;
  experience: string;
  createdAt:string
}

const JobCard: React.FC<JobCardProps> = ({
  companyPhoto,
  jobTitle,
  companyName,
  location,
  description,
  jobId,
  requiredSkills,
  salaryRange,
  jobType,
  applyLink,
  experience,
  createdAt
}) => {
  // Convert the createdAt string to a Date object
  const createdDate = new Date(createdAt);

  // Get the current date
  const currentDate = new Date();

  // Calculate the difference in milliseconds
  const differenceInMilliseconds = currentDate.getTime() - createdDate.getTime();

  // Convert the difference from milliseconds to days
  const days = Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24));
  const router = useRouter();
 
  const Job_Details = (id: string) => {
    router.replace(`/job_details/${id}`);
  };

  // Limit the skills to 5, no option to show more
  const visibleSkills = requiredSkills.slice(0, 5);

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 hover:shadow-xl transition relative flex flex-col">
      <p className="text-black dark:text-gray-200">{days} days ago</p>
      <div className="mt-6 flex items-start">
        {/* Company Photo */}
        <Image
          src={companyPhoto}
          alt={`${companyName} logo`}
          width={64}
          height={64}
          className="w-16 h-16 rounded-full mb-4 object-cover"
        />

        <div className="ml-4">
          {/* Job Title */}
          <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            {jobTitle}
          </h3>
          {/* Company Name, Location, and Job Details */}
          <div className="text-gray-600 dark:text-gray-300 font-medium flex flex-wrap items-center space-x-4">
            <span className="text-sm text-purple-500">{companyName}</span>
            <span className="text-sm">{location}</span>
          </div>
        </div>
      </div>

      {/* Icons for Job Type, Experience, and Salary */}
      <div className="flex flex-wrap sm:flex-nowrap mt-4 text-black dark:text-white space-y-2 sm:space-y-0">
        <span className="flex items-center text-sm sm:mr-3 w-full sm:w-auto">
          <FaBriefcase className="mr-1 text-gray-500 dark:text-gray-400" />
          {jobType}
        </span>
        <span className="flex items-center text-sm sm:mr-3 w-full sm:w-auto">
          <FaMoneyBillWave className="mr-1 text-gray-500 dark:text-gray-400" />
          {salaryRange}
        </span>
        <span className="flex items-center text-sm w-full sm:w-auto">
          <FaClock className="mr-1 text-gray-500 dark:text-gray-400" />
          {experience}
        </span>
      </div>
      {/* Job Description with line-clamp */}
      <p className="text-gray-500 dark:text-gray-400 my-2 line-clamp-3">
        {description}
      </p>

      {/* Required Skills (limited to 5 skills) */}
      <div className="flex flex-wrap gap-2 text-gray-500 dark:text-gray-400">
        {visibleSkills.map((skill, index) => (
          <span
            key={index}
            className="bg-gray-200 dark:bg-gray-700 rounded-full px-2 py-1 text-sm"
          >
            {skill}
          </span>
        ))}
      </div>

      {/* Spacer to push buttons to the bottom */}
      <div className="flex-grow"></div>

      {/* Details and Saved Buttons */}
      <div className="flex justify-between space-x-4 mt-2">
        <button
          onClick={() => Job_Details(jobId)}
          className="flex-1 text-center bg-white border border-purple-600 text-purple-600 font-semibold px-4 py-2 rounded-full hover:bg-purple-100 dark:bg-gray-900 dark:text-purple-400 dark:border-purple-400 dark:hover:bg-purple-800 transition"
        >
          Details
        </button>

        <a
          href={applyLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-center bg-purple-600 text-white font-semibold px-4 py-2 rounded-full hover:bg-purple-700 transition"
        >
         <ApplyButton jobId={jobId}/>
        </a>
      </div>
    </div>
  );
};

export default JobCard;
