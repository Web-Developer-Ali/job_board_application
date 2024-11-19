"use client";

import React, { useEffect, useCallback } from "react";
import axios, { AxiosError } from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import JobDetailsSection from "@/components/Job_Form/JobDetailsSection";
import LocationSection from "@/components/Job_Form/LocationSection";
import CompanyDetailsSection from "@/components/Job_Form/CompanyDetailsSection";
import JobDescriptionSection from "@/components/Job_Form/JobDescriptionSection";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ApiResponce } from "@/types/ApiResponce";
import { formSchema } from "@/helper/zodScheams/formScheam";
import nprogress from "nprogress";
import "nprogress/nprogress.css";


export default function JobForm() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobTitle: "",
      jobType: "",
      location: "",
      description: "",
      remote: false,
      experience: 0,
      company: "",
      companyWebsite: "",
      salary: 0,
      positions: 1,
      skills: [],
    },
  });

  const jobId = searchParams.get("id");

  const fetchJobData = useCallback(async () => {
    if (!jobId) return;

    try {
      const response = await axios.get(`/api/recruiter/update_jobs?id=${jobId}`);
      form.reset(response.data);
    } catch (error) {
      console.error("Error fetching job data:", error);
      toast({
        title: "Error",
        description: "Could not fetch job data.",
        variant: "destructive",
      });
    }
  }, [jobId, form, toast]);

  useEffect(() => {
    fetchJobData();
  }, [fetchJobData]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    nprogress.start();
    const formData = new FormData();

    // Include jobId in formData if it exists
    if (jobId) {
      formData.append('jobId', jobId);
    }

    Object.entries(values).forEach(([key, value]) => {
      if (key === "skills" && Array.isArray(value)) {
        value.forEach((skill) => formData.append("skills", skill));
      } else if (key === 'remote') {
        formData.append(key, value ? 'true' : 'false');
      } else if (key === 'companyLogo' && value instanceof File) {
        formData.append('companyLogo', value);
      } else if (key !== 'companyLogo') {
        formData.append(key, value as string);
      }
    });

    try {
      const url = jobId
        ? "/api/recruiter/update_jobs"
        : "/api/recruiter/job_creation";
      const method = jobId ? axios.put : axios.post;

      const response = await method(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast({ title: "Success", description: response.data.message });
      nprogress.done();
      router.push("/recruiter/jobs");
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
  };

  return (
    <main className="bg-white dark:bg-gray-900 px-4 md:px-16 py-6">
      <div className="w-full max-w-2xl mx-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <h1 className="text-black dark:text-white text-3xl font-bold mb-6">
              {jobId ? "Edit Job" : "Post New Job"}
            </h1>
             <JobDetailsSection control={form.control} />
            <LocationSection control={form.control} />
             <CompanyDetailsSection control={form.control} /> 
            <JobDescriptionSection control={form.control} />
            <Button type="submit" className="w-full md:w-auto">
              {jobId ? "Update Job" : "Submit Job"}
            </Button>
          </form>
        </Form>
      </div>
    </main>
  );
}