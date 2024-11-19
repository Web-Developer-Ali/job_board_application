import React from 'react';
import { Control } from 'react-hook-form';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormControl, FormField, FormItem, FormLabel, FormDescription, FormMessage } from "@/components/ui/form";
import SkillsSection from "./SkillsSection";

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

interface JobDescriptionSectionProps {
  control: Control<JobFormValues>;
}

export default function JobDescriptionSection({ control }: JobDescriptionSectionProps) {
  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Job Description</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Enter job description" 
                className="min-h-[100px]" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="experience"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Experience (in years)</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                placeholder="Enter required experience" 
                {...field} 
                onChange={(e) => field.onChange(e.target.valueAsNumber)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="salary"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Salary</FormLabel>
            <FormControl>
              <Input 
                type="number"
                placeholder="Enter salary amount" 
                {...field}
                onChange={(e) => field.onChange(e.target.valueAsNumber)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="positions"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Job Positions</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                placeholder="Enter number of positions" 
                {...field} 
                onChange={(e) => field.onChange(e.target.valueAsNumber)}
                min={1}
                max={100}
              />
            </FormControl>
            <FormDescription>Enter the number of positions available (1-100).</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="skills"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Skills</FormLabel>
            <FormControl>
              <SkillsSection 
                skills={field.value} 
                setSkills={(newSkills) => field.onChange(newSkills)} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}