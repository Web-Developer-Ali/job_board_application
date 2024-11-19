import React from 'react';
import { Control } from 'react-hook-form';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

interface JobFormValues {
  description: string;
  experience: number;
  salary: number;
  positions: number;
  skills: string[];
  company: string;
  jobTitle: string;
  jobType: string;
  location: string;
  remote: boolean;
  companyWebsite: string;
  companyLogo?: File;
}

interface JobDetailsSectionProps {
  control: Control<JobFormValues>;
}

const jobTypes = ["Full-time", "Part-time", "Freelance", "Contract"];

export default function JobDetailsSection({ control }: JobDetailsSectionProps) {
  return (
    <div className="space-y-6 border-b-2 dark:border-gray-700 pb-6">
      <FormField
        control={control}
        name="jobTitle"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Job Title</FormLabel>
            <FormControl>
              <Input placeholder="Enter job title" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="jobType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Job Type</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {jobTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}