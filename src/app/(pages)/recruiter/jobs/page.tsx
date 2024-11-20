"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import nprogress from "nprogress";
import "nprogress/nprogress.css";
import { useToast } from "@/hooks/use-toast";
import JobCard from "@/components/Recruiter_jobs/JobCard";
import JobTable from "@/components/Recruiter_jobs/JobTable";
import { ApiResponce } from "@/types/ApiResponce";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface CompanyLogo {
  public_id: string;
  secure_url: string;
}

interface Job {
  _id: string;
  jobTitle: string;
  companyLogo: CompanyLogo;
  live: boolean;
  createdAt: string;
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const [jobToConfirm, setJobToConfirm] = useState<string | null>(null);
  const [isDeleteAction, setIsDeleteAction] = useState<boolean>(false);
  const router = useRouter();
  const { toast } = useToast();

  const fetchJobs = useCallback(async () => {
    try {
      const response = await axios.get<Job[]>("/api/recruiter/fetch_recuiter_jobs");
      setJobs(response.data);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
      toast({
        title: "Error",
        description: "Failed to fetch jobs. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".menu-button") && !target.closest(".menu")) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleEdit = useCallback((id: string) => {
    router.push(`/recruiter/job_creating?id=${id}`);
  }, [router]);

  const handleView = useCallback((id: string) => {
    router.push(`/recruiter/job_applicents?id=${id}`);
  }, [router]);

  const handleDelete = useCallback(async () => {
    if (!jobToConfirm) return;

    nprogress.start();
    try {
      const response = await axios.delete<ApiResponce>(`/api/recruiter/delete_job?id=${jobToConfirm}`);
      setJobs(prevJobs => prevJobs.filter(job => job._id !== jobToConfirm));
      setShowConfirmDialog(false);
      setJobToConfirm(null);
      toast({ description: response.data.message });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponce>;
      const errorMessage = axiosError.response?.data.message || "Something went wrong!";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      nprogress.done();
    }
  }, [jobToConfirm, toast]);

  const handleToggleLive = useCallback(async (id: string, currentStatus?: boolean) => {
    nprogress.start();
    try {
      const response = await axios.patch<ApiResponce>(`/api/recruiter/toggle_live_job?id=${id}`, {
        live: currentStatus !== undefined ? !currentStatus : false,
      });
      toast({ description: response.data.message });
      setShowConfirmDialog(false);
      setJobs(prevJobs =>
        prevJobs.map(job =>
          job._id === id ? { ...job, live: currentStatus !== undefined ? !currentStatus : false } : job
        )
      );
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponce>;
      const errorMessage = axiosError.response?.data.message || "Something went wrong!";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      nprogress.done();
    }
  }, [toast]);

  const handleCreateJob = useCallback(() => {
    router.push("/recruiter/job_creating");
  }, [router]);

  const handleConfirmAction = useCallback((id: string, action: "delete" | "toggle") => {
    setJobToConfirm(id);
    setIsDeleteAction(action === "delete");
    setShowConfirmDialog(true);
  }, []);

  const toggleMenu = useCallback((id: string) => {
    setOpenMenuId(prevId => prevId === id ? null : id);
  }, []);

  return (
    <div className="container mx-auto px-4 bg-white dark:bg-gray-900 min-h-screen min-w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-10">
          All Posted Jobs
        </h1>
        <Button
          onClick={handleCreateJob}
          className="px-4 py-2 text-sm font-medium mt-4 md:mt-10"
        >
          Create New Job
        </Button>
      </div>
      {loading ? (
        <div
          className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900"
          aria-live="polite"
          aria-busy="true"
        >
          <div className="flex flex-col items-center">
            <div
              className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
              role="status"
            >
              <span className="sr-only">Loading...</span>
            </div>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Loading...
            </p>
          </div>
        </div>
      ) : jobs.length === 0 ? (
        <p className="text-center text-gray-900 dark:text-gray-300">No jobs found.</p>
      ) : (
        <div>
          <div className="hidden md:block">
            <JobTable
              jobs={jobs}
              openMenuId={openMenuId}
              toggleMenu={toggleMenu}
              handleView={handleView}
              handleEdit={handleEdit}
              handleConfirmAction={handleConfirmAction}
            />
          </div>
          <div className="block md:hidden">
            <JobCard
              job={jobs}
              openMenuId={openMenuId}
              toggleMenu={toggleMenu}
              handleView={handleView}
              handleEdit={handleEdit}
              handleConfirmAction={handleConfirmAction}
            />
          </div>
        </div>
      )}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isDeleteAction ? "Delete Job" : "Toggle Job Status"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isDeleteAction
                ? "Are you sure you want to delete this job? This action cannot be undone."
                : "Are you sure you want to change the job status?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={isDeleteAction ? handleDelete : () => jobToConfirm && handleToggleLive(jobToConfirm, jobs.find(job => job._id === jobToConfirm)?.live)}
            >
              {isDeleteAction ? "Delete" : "Toggle"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}