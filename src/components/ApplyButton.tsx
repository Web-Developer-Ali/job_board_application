// ApplyButton.tsx
"use client";

import { useToast } from "@/hooks/use-toast";
import axios, { AxiosError } from "axios";
import nprogress from "nprogress";
import "nprogress/nprogress.css";

interface ApplyButtonProps {
  jobId: string;
}

interface ApiError {
  error: string;
}

const ApplyButton: React.FC<ApplyButtonProps> = ({ jobId }) => {
  const { toast } = useToast();
  const handleApply = async () => {
    nprogress.start();
    try {
      const response = await axios.get(`/api/applicent/apply_jobs?id=${jobId}`);
      toast({ title: "Success", description: response.data.message });
      // Handle response (e.g., show a success message or redirect)
    } catch (error) {
      console.error("Error fetching applicants:", error);
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ApiError>;
        toast({
          title: "Error",
          description: axiosError.response?.data?.error || "Failed to apply job. Please try again.",
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
      nprogress.done(); // Stop loading bar
    }
  };
  return <button onClick={handleApply}>Apply Now</button>;
};

export default ApplyButton;
