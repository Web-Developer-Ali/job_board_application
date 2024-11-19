'use client';

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import JobCard from './JobCard';
import { Loader2 } from 'lucide-react';

interface Job {
  _id: string;
  companyLogo: { secure_url: string };
  jobTitle: string;
  company: string;
  location: string;
  salary: string;
  jobTime: string;
  jobType: string;
  experience: string;
  description: string;
  skills: string[];
  applyLink: string;
  createdAt: string;
}

export default function FeaturedJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchJobs = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get<{ jobs: Job[] }>("/api/getJobs_forhomepage");
      setJobs(response.data.jobs);
    } catch (error) {
      console.error("Error while fetching jobs for Home page:", error);
      toast({
        title: "Error",
        description: "Failed to fetch featured jobs. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-200">Featured Jobs</h2>
      {isLoading ? (
        <div className="flex justify-center items-center mt-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="sr-only">Loading jobs...</span>
        </div>
      ) : jobs.length > 0 ? (
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-8">
          {jobs.map((job) => (
            <JobCard
              key={job._id}
              jobId={job._id}
              companyPhoto={job.companyLogo.secure_url}
              jobTitle={job.jobTitle}
              companyName={job.company}
              location={job.location}
              description={job.description}
              requiredSkills={job.skills}
              salaryRange={job.salary}
              jobType={job.jobType}
              experience={job.experience}
              applyLink={job.applyLink}
              createdAt={job.createdAt}
            />
          ))}
        </div>
      ) : (
        <p className="text-center mt-10 text-gray-600 dark:text-gray-400">No featured jobs available at the moment.</p>
      )}
    </section>
  );
}