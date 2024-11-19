// ApplyButton.tsx
"use client";

import { useToast } from "@/hooks/use-toast";
import { ApiResponce } from "@/types/ApiResponce";
import axios, { AxiosError } from "axios";
import nprogress from "nprogress";
import "nprogress/nprogress.css";

interface ApplyButtonProps {
  jobId: string;
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
      const axiosError = error as AxiosError<ApiResponce>;
      const errorMessage =
        axiosError.response?.data.message || "Something went wrong!";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      nprogress.done(); // Stop loading bar
    }
  };
  return <button onClick={handleApply}>Apply Now</button>;
};

export default ApplyButton;
