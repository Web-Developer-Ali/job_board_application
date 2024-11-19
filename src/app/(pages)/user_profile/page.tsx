"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSession } from "next-auth/react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { Mail, Pen, MapPin } from "lucide-react";
import nprogress from "nprogress";
import "nprogress/nprogress.css";

import { Modal } from "@/components/profile/ProfileModal";
import { AppliedJobTable } from "@/components/profile/AppliedJobTable";
import Avatar from "@/components/profile/Avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ApiResponce } from "@/types/ApiResponce";

const defaultProfileImage = "/blank-profile-picture-973460_640.webp";

interface UserData {
  full_Name: string;
  user_Role: string;
  email: string;
  preferred_location: string | string[];
  skills: string[];
  previous_companies: string[];
  resumeUrl?: string;
  companyName?: string;
  companyRole?: string;
  companyLocation?: string;
  linkedinProfile: string;
  role: string;
  avatar?: { secure_url: string; public_id: string };
}

export default function Profile() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState<[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const {  update } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const fetchUserProfile = useCallback(async () => {
    try {
      const response = await axios.get<UserData>(
        "/api/user_profile/fetch_data"
      );
      setUserData(response.data);
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      toast({
        title: "Error",
        description: "Failed to load user profile. Please try again.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const fetchJobs = useCallback(async (isRecruiter: boolean) => {
    const endpoint = isRecruiter
      ? "/api/recruiter/get_created_jobs"
      : "/api/applicent/getuser_applied_jobs";
    try {
      const response = await axios.get(endpoint);
      setAppliedJobs(response.data);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
      toast({
        title: "Error",
        description: "Failed to load jobs. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingJobs(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  useEffect(() => {
    if (userData) {
      fetchJobs(userData.role === "recruiter");
    }
  }, [userData, fetchJobs]);

  const uploadImage = async (file: File) => {
    nprogress.start();
    const formData = new FormData();
    formData.append("profileImage", file);
    formData.append("oldImageId", userData?.avatar?.public_id || "");

    try {
      const response = await axios.post(
        "/api/user_profile/edit_profile_image",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setUserData((prevData) =>
        prevData
          ? {
              ...prevData,
              avatar: response.data.avatar,
            }
          : null
      );
      if (response.status === 200) {
        await update({ picture: response.data.avatar.secure_url });
      }

      toast({
        title: "Success",
        description: "Profile image updated successfully.",
      });
    } catch (error) {
      console.error("Failed to upload image:", error);
      const axiosError = error as AxiosError<ApiResponce>;
      const errorMessage =
        axiosError.response?.data.message || "Something went wrong!";
      toast({
        title: "Failed to Updated Image",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      nprogress.done();
    }
  };

  const handleImageChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file && userData) {
        await uploadImage(file);
      }
    },
    [userData,uploadImage]
  );


  const handleSave = useCallback(async (updatedData: Partial<UserData>) => {
    try {
      await axios.put("/api/user_profile/fetch_data", updatedData);
      setUserData((prevData) =>
        prevData ? { ...prevData, ...updatedData } : null
      );
      toast({
        title: "Success",
        description: "Profile updated successfully.",
      });
    } catch (error) {
      console.error("Failed to update user profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const isRecruiter = useMemo(() => userData?.role === "recruiter", [userData]);
  const hasResume = useMemo(() => !!userData?.resumeUrl, [userData]);

  if (!userData) {
    return (
      <div
        className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900"
        aria-live="polite"
        aria-busy="true"
      >
        <div className="flex flex-col items-center">
          <div
            className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
            role="status"
          >
            <span className="sr-only">Loading...</span>
          </div>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="dark:bg-gray-900 min-h-screen">
      <main className="space-y-6 max-w-4xl mx-auto p-4 dark:bg-gray-900">
        <section className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-white rounded-2xl p-8 shadow-lg">
          <div className="flex justify-between items-center mb-5">
            <div className="flex items-center space-x-4">
              <Avatar
                src={userData.avatar?.secure_url || defaultProfileImage}
                alt={`Profile picture of ${userData.full_Name}`}
                onImageChange={handleImageChange}
              />
              <div>
                <h1 className="font-medium text-xl text-gray-900 dark:text-gray-100">
                  {userData.full_Name}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {isRecruiter ? "Recruiter" : userData.user_Role}
                </p>
              </div>
            </div>
            <Button
              onClick={() => setDialogOpen(true)}
              aria-label="Edit profile"
              variant="outline"
            >
              <Pen className="text-gray-900 dark:text-gray-100" />
              <span className="text-gray-900 dark:text-gray-100">Edit</span>
            </Button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <Mail aria-hidden="true" />
              <span className="text-gray-900 dark:text-gray-100">
                {userData.email}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin aria-hidden="true" />
              <span className="text-gray-900 dark:text-gray-100">
                Location:{" "}
                {Array.isArray(userData.preferred_location)
                  ? userData.preferred_location.join(", ")
                  : userData.preferred_location || "Not specified"}
              </span>
            </div>
          </div>

          {!isRecruiter && (
            <>
              <div className="my-5">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Skills
                </h2>
                <ul className="flex flex-wrap gap-2" aria-label="Skills">
                  {userData.skills.map((skill, index) => (
                    <li key={index}>
                      <Badge>{skill}</Badge>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="my-5">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Previous Companies
                </h2>
                <ul
                  className="flex flex-wrap gap-2"
                  aria-label="Previous companies"
                >
                  {userData.previous_companies.map((company, index) => (
                    <li key={index}>
                      <Badge>{company}</Badge>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="my-5">
                <Label>Resume</Label>
                {hasResume ? (
                  <div className="mt-1">
                    <a
                      href={userData.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline dark:text-blue-400"
                    >
                      View Resume
                    </a>
                  </div>
                ) : (
                  <span className="text-gray-600 dark:text-gray-400">NA</span>
                )}
              </div>
            </>
          )}

          {isRecruiter && (
            <>
              <div className="my-5">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Company Name
                </h2>
                <p className="text-gray-900 dark:text-gray-100">
                  {userData.companyName}
                </p>
              </div>

              <div className="my-5">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Company Role
                </h2>
                <p className="text-gray-900 dark:text-gray-100">
                  {userData.companyRole}
                </p>
              </div>

              <div className="my-5">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Company Location
                </h2>
                <p className="text-gray-900 dark:text-gray-100">
                  {userData.companyLocation}
                </p>
              </div>
            </>
          )}

          <div className="my-5">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              LinkedIn
            </h2>
            <a
              href={userData.linkedinProfile}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline dark:text-blue-400"
            >
              View LinkedIn Profile
            </a>
          </div>
        </section>

        <section className="my-5">
          <div className="my-5">
            <div className="flex items-center">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex-grow">
                {isRecruiter ? "Jobs Created" : "Applied Jobs"}
              </h2>
              {isRecruiter && (
                <div className="text-right">
                  <Button onClick={() => router.push("/recruiter/jobs")}>
                    Manage Jobs
                  </Button>
                </div>
              )}
            </div>
          </div>

          {loadingJobs ? (
            <div
              className="text-gray-900 dark:text-gray-100"
              aria-live="polite"
            >
              {isRecruiter ? "Loading jobs..." : "Loading applied jobs..."}
            </div>
          ) : (
            <AppliedJobTable jobs={appliedJobs} />
          )}
        </section>

        <Modal
          isOpen={isDialogOpen}
          onClose={() => setDialogOpen(false)}
          onSave={handleSave}
          userData={userData}
          isRecruiter={isRecruiter}
        />
      </main>
    </div>
  );
}
