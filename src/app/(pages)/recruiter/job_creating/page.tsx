"use client";

import React, { Suspense } from "react";
import JobForm from "./job_creating_components";



export default function BrowseJobs() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <JobForm/>
    </Suspense>
  );
}
