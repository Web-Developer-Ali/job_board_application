"use client";

import React, { Suspense } from "react";
import ApplicantsPage from "./job_applicents_component";


export default function BrowseJobs() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ApplicantsPage/>
    </Suspense>
  );
}
