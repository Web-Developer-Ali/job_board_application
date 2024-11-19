import React from 'react';
import { Control } from 'react-hook-form';
import { Input } from "@/components/ui/input";  // Assuming you have a custom Input component
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

interface CompanyDetailsSectionProps {
  control: Control<JobFormValues>;
}

export default function CompanyDetailsSection({ control }: CompanyDetailsSectionProps) {
  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="companyLogo"
        render={({ field: { onChange } }) => (
          <FormItem>
            <FormLabel>Company Logo</FormLabel>
            <FormControl>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  onChange(file); // Only handle the file change, no need to pass value here
                }}
                required
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company</FormLabel>
              <FormControl>
                <Input placeholder="Enter company name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="companyWebsite"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Website</FormLabel>
              <FormControl>
                <Input placeholder="Enter company website" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
