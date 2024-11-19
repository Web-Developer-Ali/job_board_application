"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface JobCategory {
  jobTitle: string;
}

const JobCategories: React.FC = () => {
  const [categories, setCategories] = useState<JobCategory[]>([]);
  const router = useRouter();

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/api/getJobTitles_forhomepage");
      setCategories(response.data.popularJobs);
    } catch (error) {
      console.error("Error fetching job categories:", error);
    }
  };

  const handleJobBrowse = (title: string) => {
    const query = title;
    router.push(`/browse_jobs?searchQuery=${query}`);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 dark:text-gray-200">
        Explore Job{" "}
        <span className="text-purple-500 dark:text-purple-400">Categories</span>
      </h2>
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-8">
        {categories.map((category, index) => (
          <div
            key={index}
            onClick={() => handleJobBrowse(category.jobTitle)}
            className="flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow transition-transform transform hover:scale-105 hover:bg-gray-100 dark:hover:bg-gray-700 hover:shadow-lg cursor-pointer"
          >
            <p className="text-center text-xl font-medium text-gray-700 dark:text-gray-300">
              {category.jobTitle}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default JobCategories;