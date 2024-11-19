"use client";

import React, { Suspense } from "react";
import BrowseJobsContent from "./BrowseJobsContent";

export default function BrowseJobs() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BrowseJobsContent />
    </Suspense>
  );
}
