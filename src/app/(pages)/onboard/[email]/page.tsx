"use client";

import React, { useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import nprogress from "nprogress";
import "nprogress/nprogress.css";
import * as z from "zod";
import {
  candidateSchema,
  recruiterSchema,
} from "@/helper/zodScheams/onboardingSchema";

type RecruiterData = z.infer<typeof recruiterSchema>;
type CandidateData = z.infer<typeof candidateSchema>;

export default function Onboarding() {
  const [userType, setUserType] = useState<"candidate" | "recruiter">(
    "candidate"
  );
  const router = useRouter();
  const { update } = useSession();
  const { toast } = useToast();
  const params = useParams<{ email: string }>();
  const encodedParams = params?.email || "";
  const decodedParams = decodeURIComponent(encodedParams);

  // Parse the parameters to get email and email_user
  const paramsArray = decodedParams.split("&");
  const getUrlData = paramsArray.reduce((acc, param) => {
    const [key, value] = param.split("=");
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);

  const email = getUrlData["email"];
  const email_user = getUrlData["email_user"];
  const recruiterForm = useForm<RecruiterData>({
    resolver: zodResolver(recruiterSchema),
    defaultValues: {
      companyName: "",
      companyLocation: "",
      companyRole: "",
      linkedinProfile: "",
    },
  });

  const candidateForm = useForm<CandidateData>({
    resolver: zodResolver(candidateSchema),
    defaultValues: {
      previous_companies: [],
      preferred_location: "",
      user_Role: "",
      experience: "",
      skills: [],
      linkedinProfile: "",
      graduation: "",
      resumeUrl: "",
    },
  });

  const {
    fields: companyFields,
    append: appendCompany,
    remove: removeCompany,
  } = useFieldArray({
    control: candidateForm.control,
    name: "previous_companies",
  });

  const {
    fields: skillFields,
    append: appendSkill,
    remove: removeSkill,
  } = useFieldArray({
    control: candidateForm.control,
    name: "skills",
  });

  const onSubmit: SubmitHandler<RecruiterData | CandidateData> = useCallback(
    async (data) => {
      nprogress.start();
      try {
        const response = await axios.put("/api/registeration/onboarding", {
          userType,
          data: {
            ...data,
            email,
            previous_companies:
              userType === "candidate"
                ? (data as CandidateData).previous_companies.map((c) => c.name)
                : undefined,
            skills:
              userType === "candidate"
                ? (data as CandidateData).skills.map((s) => s.name)
                : undefined,
          },
        });

        toast({
          title: "Success",
          description: response.data.message,
        });

        if (email_user === undefined) {
          await update({
            onboardComplete: true,
            resumeUrl:
              userType === "candidate"
                ? (data as CandidateData).resumeUrl
                : undefined,
            role: userType,
          });
        }

        router.replace(email_user ? "/sign-in" : "/");
      } catch (error) {
        toast({
          title: "Onboarding failed",
          description: axios.isAxiosError(error)
            ? error.response?.data.message || "Something went wrong!"
            : "An unexpected error occurred",
          variant: "destructive",
        });
      } finally {
        nprogress.done();
      }
    },
    [userType, email, email_user, update, router, toast]
  );

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center">
          Onboarding
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs
          value={userType}
          onValueChange={(value) =>
            setUserType(value as "candidate" | "recruiter")
          }
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="candidate">Candidate</TabsTrigger>
            <TabsTrigger value="recruiter">Recruiter</TabsTrigger>
          </TabsList>
          <TabsContent value="candidate">
            <form
              onSubmit={candidateForm.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <div>
                <Label htmlFor="previous_companies">Previous Companies</Label>
                <div className="flex space-x-2">
                  <Input
                    id="new_company"
                    placeholder="Enter company name"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        appendCompany({ name: e.currentTarget.value });
                        e.currentTarget.value = "";
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      const input = document.getElementById(
                        "new_company"
                      ) as HTMLInputElement;
                      if (input.value) {
                        appendCompany({ name: input.value });
                        input.value = "";
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
                <ul className="mt-2 space-y-1">
                  {companyFields.map((field, index) => (
                    <li
                      key={field.id}
                      className="flex justify-between items-center"
                    >
                      <span>{field.name}</span>
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => removeCompany(index)}
                      >
                        Remove
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <Label htmlFor="preferred_location">Preferred Location</Label>
                <Input
                  id="preferred_location"
                  {...candidateForm.register("preferred_location")}
                />
              </div>
              <div>
                <Label htmlFor="user_Role">Desired Role</Label>
                <Input
                  id="user_Role"
                  {...candidateForm.register("user_Role")}
                />
              </div>
              <div>
                <Label htmlFor="experience">Years of Experience</Label>
                <Input
                  id="experience"
                  type="number"
                  {...candidateForm.register("experience")}
                />
              </div>
              <div>
                <Label htmlFor="skills">Skills</Label>
                <div className="flex space-x-2">
                  <Input
                    id="new_skill"
                    placeholder="Enter skill"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        appendSkill({ name: e.currentTarget.value });
                        e.currentTarget.value = "";
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      const input = document.getElementById(
                        "new_skill"
                      ) as HTMLInputElement;
                      if (input.value) {
                        appendSkill({ name: input.value });
                        input.value = "";
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
                <ul className="mt-2 space-y-1">
                  {skillFields.map((field, index) => (
                    <li
                      key={field.id}
                      className="flex justify-between items-center"
                    >
                      <span>{field.name}</span>
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => removeSkill(index)}
                      >
                        Remove
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <Label htmlFor="linkedinProfile">LinkedIn Profile</Label>
                <Input
                  id="linkedinProfile"
                  type="url"
                  {...candidateForm.register("linkedinProfile")}
                />
              </div>
              <div>
                <Label htmlFor="graduation">Graduation</Label>
                <Input
                  id="graduation"
                  {...candidateForm.register("graduation")}
                />
              </div>
              <div>
                <Label htmlFor="resumeUrl">Resume URL</Label>
                <Input
                  id="resumeUrl"
                  type="url"
                  {...candidateForm.register("resumeUrl")}
                />
              </div>
              <Button type="submit" className="w-full">
                Submit
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="recruiter">
            <form
              onSubmit={recruiterForm.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <div>
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  {...recruiterForm.register("companyName")}
                />
              </div>
              <div>
                <Label htmlFor="companyLocation">Company Location</Label>
                <Input
                  id="companyLocation"
                  {...recruiterForm.register("companyLocation")}
                />
              </div>
              <div>
                <Label htmlFor="companyRole">Company Role</Label>
                <Input
                  id="companyRole"
                  {...recruiterForm.register("companyRole")}
                />
              </div>
              <div>
                <Label htmlFor="linkedinProfile">LinkedIn Profile</Label>
                <Input
                  id="linkedinProfile"
                  type="url"
                  {...recruiterForm.register("linkedinProfile")}
                />
              </div>
              <Button type="submit" className="w-full">
                Submit
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
