"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios, { AxiosError } from "axios";
import JobCard from "@/components/JobCard";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Filter } from 'lucide-react';
import FilterForm from "@/components/Borwse_jobs/FilterForm";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import SearchForm from "@/components/Borwse_jobs/SerchForm";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams, useRouter } from "next/navigation";

interface Job {
  _id: string;
  jobTitle: string;
  salary: number;
  jobType: string;
  location: string;
  companyLogo: { secure_url: string };
  company: string;
  description: string;
  skills: string[];
  salaryRange: string;
  jobTime: string;
  experience: string;
  applyLink: string;
  createdAt: string;
}

interface FilterOptions {
  locations: string[];
  salaryRanges: string[];
  jobTypes: string[];
}

const ITEMS_PER_PAGE = 9;

const MemoizedJobCard = React.memo(JobCard);

export default function BrowseJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filters, setFilters] = useState<FilterOptions | null>(null);
  const [salary, setSalary] = useState("");
  const [type, setType] = useState("");
  const [location, setLocation] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [jobsCache, setJobsCache] = useState<{ [key: string]: Job[] }>({});
  const [isPageChanging, setIsPageChanging] = useState(false);
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();
  const searchQuery = searchParams.get("searchQuery") ?? "";

  const fetchFilters = useCallback(async () => {
    try {
      const response = await axios.get("/api/browse_jobs/job_filters");
      const data = response.data;
      const salaryRanges = data.salaryRanges.map((range: number | string) =>
        typeof range === "number" ? range.toString() : range
      );
      setFilters({ ...data, salaryRanges });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message: string }>;
        toast({
          title: "Job Filters Error",
          description: axiosError.response?.data?.message || "Failed to Fetch jobs Filters. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Job Fetching Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      }
    }
  }, [toast]);

  const fetchJobs = useCallback(
    async (page: number) => {
      const cacheKey = `${salary}|${type}|${location}|${page}|${searchQuery}}`;
      if (jobsCache[cacheKey]) {
        setJobs(jobsCache[cacheKey]);
        setHasNextPage(jobsCache[cacheKey].length === ITEMS_PER_PAGE);
        return;
      }

      setIsLoading(true);
      try {
        let url = '/api/browse_jobs/getfilter_jobs';
        let params: { [key: string]: string } = {
          salary,
          type,
          location,
          page: page.toString(),
          limit: ITEMS_PER_PAGE.toString(),
        };

        if (searchQuery ) {
          url = '/api/browse_jobs/serch_query_onjobs';
          params = {
            ...params,
            searchQuery
          };
        }

        const query = new URLSearchParams(params).toString();

        const response = await axios.get(`${url}?${query}`);
        const fetchedJobs = response.data.jobs;
        setJobs(fetchedJobs);
        setJobsCache((prevCache) => ({
          ...prevCache,
          [cacheKey]: fetchedJobs,
        }));
        setHasNextPage(fetchedJobs.length === ITEMS_PER_PAGE);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError<{ message: string }>;
          toast({
            title: "Job Fetching Error",
            description: axiosError.response?.data?.message || "Failed to fetch jobs. Please try again.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Job Fetching Error",
            description: "An unexpected error occurred. Please try again.",
            variant: "destructive",
          });
        }
      } finally {
        setIsLoading(false);
      }
    },
    [salary, type, location, searchQuery, jobsCache, toast]
  );

  useEffect(() => {
    fetchFilters();
  }, [fetchFilters]);

  useEffect(() => {
    if (filters) {
      fetchJobs(currentPage);
    }
  }, [filters, fetchJobs, currentPage, salary, type, location, searchQuery]);

  const handleSearch = useCallback(async (query: string, jobTitle?: string) => {
    setIsLoading(true);
    try {
      const searchParams = new URLSearchParams({
        ...(query && { searchQuery: query }),
        ...(jobTitle && { searchJobsByTitle: jobTitle }),
        page: "1",
        limit: ITEMS_PER_PAGE.toString(),
      }).toString();
      
      router.push(`/browse_jobs?${searchParams}`);
      
      const response = await axios.get(
        `/api/browse_jobs/serch_query_onjobs?${searchParams}`
      );
      setJobs(response.data.jobs);
      setCurrentPage(1);
      setHasNextPage(response.data.jobs.length === ITEMS_PER_PAGE);
      setJobsCache({}); // Clear cache on new search
      setIsLoading(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message: string }>;
        toast({
          title: "Job Search Error",
          description: axiosError.response?.data?.message || "Failed to Search jobs. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Job Fetching Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [router, toast]);

  const handlePageChange = useCallback(
    (newPage: number) => {
      if (newPage >= 1 && (newPage === currentPage + 1 ? hasNextPage : true)) {
        setIsPageChanging(true);
        setCurrentPage(newPage);
        fetchJobs(newPage).then(() => {
          setIsPageChanging(false);
        });
      }
    },
    [currentPage, hasNextPage, fetchJobs]
  );

  const handleFilterChange = useCallback(
    (newSalary: string, newType: string, newLocation: string) => {
      setSalary(newSalary);
      setType(newType);
      setLocation(newLocation);
      setCurrentPage(1);
      setJobsCache({});
    },
    []
  );

  const memoizedFilterForm = useMemo(
    () =>
      filters && (
        <FilterForm
          filters={filters}
          location={location}
          setLocation={(newLocation) =>
            handleFilterChange(salary, type, newLocation)
          }
          salary={salary}
          setSalary={(newSalary) =>
            handleFilterChange(newSalary, type, location)
          }
          type={type}
          setType={(newType) => handleFilterChange(salary, newType, location)}
        />
      ),
    [filters, location, salary, type, handleFilterChange]
  );

  const memoizedSearchForm = useMemo(
    () => <SearchForm onSearch={handleSearch} />,
    [handleSearch]
  );

  const memoizedJobCards = useMemo(
    () =>
      jobs.map((job) => (
        <MemoizedJobCard
          key={job._id}
          jobId={job._id}
          companyPhoto={job.companyLogo.secure_url}
          jobTitle={job.jobTitle}
          companyName={job.company}
          location={job.location}
          description={job.description}
          requiredSkills={job.skills}
          salaryRange={`$ ${job.salary}`}
          jobType={job.jobType}
          applyLink={job.applyLink}
          experience={`${job.experience} +year`}
          createdAt={job.createdAt}
        />
      )),
    [jobs]
  );

  const memoizedPagination = useMemo(
    () =>
      jobs.length > 0 && (
        <div className="flex justify-between items-center mt-8">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={`${
                    currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
                  } transition-all duration-300 ease-in-out`}
                >
                  Previous
                </PaginationPrevious>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink>{currentPage}</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                {hasNextPage && (
                  <PaginationNext
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="transition-all duration-300 ease-in-out"
                  >
                    Next
                  </PaginationNext>
                )}
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      ),
    [jobs.length, currentPage, hasNextPage, handlePageChange]
  );

  return (
    <div className="min-w-full min-h-screen container mx-auto px-4 py-8 dark:bg-gray-900 dark:text-gray-200">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-bold mb-4 md:mb-0 dark:text-gray-100">
          Browse{" "}
          <span className="text-purple-500 dark:text-purple-400">Jobs</span>
        </h1>
        <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              className="md:hidden bg-purple-600 text-white"
            >
              <Filter className="mr-2 h-4 w-4" /> Filters
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-[300px] sm:w-[400px] dark:bg-gray-800"
          >
            <SheetHeader>
              <SheetTitle className="dark:text-gray-100">Filters</SheetTitle>
            </SheetHeader>
            {memoizedFilterForm}
          </SheetContent>
        </Sheet>
      </div>

      {memoizedSearchForm}

      <div className="flex flex-col md:flex-row gap-6">
        <aside className="w-full md:w-1/4 lg:w-1/5 hidden md:block">
          <div className="sticky top-4 space-y-6 bg-white p-4 rounded-lg border dark:bg-gray-800 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-4 dark:text-gray-100">
              Filters
            </h2>
            {memoizedFilterForm}
          </div>
        </aside>

        <main className="flex-1">
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 transition-opacity duration-300 ${
              isPageChanging || isLoading ? "opacity-50" : "opacity-100"
            }`}
          >
            {isLoading ? (
              <div className="col-span-full flex items-center justify-center animate-fade-in">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin-smooth"></div>
                  <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                    Loading jobs...
                  </p>
                </div>
              </div>
            ) : jobs.length > 0 ? (
              memoizedJobCards
            ) : (
              <p className="col-span-full text-center text-lg text-gray-600 dark:text-gray-300">
                No jobs found.
              </p>
            )}
          </div>

          {memoizedPagination}
        </main>
      </div>
    </div>
  );
}