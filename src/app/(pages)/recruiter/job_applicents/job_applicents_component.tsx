"use client";

import React, { useEffect, useState, useCallback } from "react";
import { MdMoreHoriz } from "react-icons/md";
import axios, { AxiosError } from "axios";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
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

interface Applicant {
  _id: string;
  name: string;
  resumeUrl: string;
  status: string;
  appliedAt: string;
}

interface ApiError {
  error: string;
}

export default function ApplicantsPage() {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<{ id: string; status: string } | null>(null);
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const fetchApplicants = useCallback(async () => {
    const jobId = searchParams.get("id");
    if (!jobId) {
      toast({
        title: "Error",
        description: "No job ID provided",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get<Applicant[]>(`/api/recruiter/job_applicents?id=${jobId}`);
      setApplicants(response.data);
    } catch (error) {
      console.error("Error fetching applicants:", error);
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ApiError>;
        toast({
          title: "Error",
          description: axiosError.response?.data?.error || "Failed to fetch applicants. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "An unexpected error occurred while fetching applicants.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  }, [searchParams, toast]);

  useEffect(() => {
    fetchApplicants();
  }, [fetchApplicants]);

  const updateApplicantStatus = useCallback(async (applicantId: string, status: string) => {
    setSelectedApplicant({ id: applicantId, status });
    setShowConfirmDialog(true);
  }, []);

  const confirmStatusUpdate = useCallback(async () => {
    if (!selectedApplicant) return;

    try {
      await axios.patch(`/api/recruiter/update_job_status?id=${selectedApplicant.id}`, { status: selectedApplicant.status });
      setApplicants((prev) =>
        prev.map((applicant) =>
          applicant._id === selectedApplicant.id ? { ...applicant, status: selectedApplicant.status } : applicant
        )
      );
      toast({
        description: `Applicant status updated to ${selectedApplicant.status}`,
      });
    } catch (error) {
      console.error("Error updating job status:", error);
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ApiError>;
        toast({
          title: "Error",
          description: axiosError.response?.data?.error || "Failed to update applicant status. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "An unexpected error occurred while updating the status.",
          variant: "destructive",
        });
      }
    } finally {
      setShowConfirmDialog(false);
      setSelectedApplicant(null);
    }
  }, [selectedApplicant, toast, setApplicants]);

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'accepted':
        return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen min-w-full bg-white dark:bg-gray-900">
      <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
        Job Applicants
      </h1>
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
      ) : applicants.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-300">No applicants found.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Applicant Name</TableHead>
                <TableHead>Resume</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Applied At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applicants.map((applicant) => (
                <TableRow key={applicant._id}>
                  <TableCell className="font-medium">{applicant.name}</TableCell>
                  <TableCell>
                    <a
                      href={applicant.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline dark:text-blue-400"
                    >
                      View Resume
                    </a>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadgeColor(applicant.status)}>
                      {applicant.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(applicant.appliedAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MdMoreHoriz className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => updateApplicantStatus(applicant._id, "Accepted")}>
                          Mark as Accepted
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateApplicantStatus(applicant._id, "Rejected")}>
                          Mark as Rejected
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Status Change</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to change the status? This action can only be performed once and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmStatusUpdate}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}