import { z } from "zod";

export const recruiterSchema = z.object({
    companyName: z.string().min(1, "Company name is required"),
    companyLocation: z.string().min(1, "Company location is required"),
    companyRole: z.string().min(1, "Company role is required"),
    linkedinProfile: z.string().url("Invalid LinkedIn URL"),
  });
  
 export const candidateSchema = z.object({
    previous_companies: z.array(z.object({ name: z.string() })),
    preferred_location: z.string().min(1, "Preferred location is required"),
    user_Role: z.string().min(1, "Desired role is required"),
    experience: z.string().min(1, "Experience is required"),
    skills: z.array(z.object({ name: z.string() })),
    linkedinProfile: z.string().url("Invalid LinkedIn URL"),
    graduation: z.string().min(1, "Graduation details are required"),
    resumeUrl: z.string().url("Invalid resume URL"),
  });
  