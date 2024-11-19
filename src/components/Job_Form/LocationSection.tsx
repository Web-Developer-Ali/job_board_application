import React from 'react';
import { Control } from 'react-hook-form';
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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

interface LocationSectionProps {
  control: Control<JobFormValues>;
}

export default function LocationSection({ control }: LocationSectionProps) {
  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Location</FormLabel>
            <FormControl>
              <Input placeholder="Enter job location" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="remote"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>
                Work can be done remotely
              </FormLabel>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}