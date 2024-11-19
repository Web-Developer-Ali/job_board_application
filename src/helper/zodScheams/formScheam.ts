import { z } from "zod";

export const formSchema = z.object({
  jobTitle: z.string().min(1, "Job title is required"),
  jobType: z.string().min(1, "Job type is required"),
  location: z.string().min(1, "Location is required"),
  description: z.string().min(1, "Description is required"),
  remote: z.boolean(),
  experience: z.number().min(0, "Experience must be a positive number"),
  company: z.string().min(1, "Company name is required"),
  companyWebsite: z.string().url("Invalid URL"),
  salary: z.number().min(0, "Salary must be a positive number"),
  positions: z.number().min(1, "At least one position is required"),
  skills: z.array(z.string()).min(1, "At least one skill is required"),
  companyLogo: z.instanceof(File).optional(),
});