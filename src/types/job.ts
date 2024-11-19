// types/Job.ts
export interface CompanyLogo {
    public_id: string;
    secure_url: string;
  }
  
  export interface Job {
    _id: string;
    jobTitle: string;
    companyLogo: CompanyLogo;
    live: boolean;
    createdAt: string;
  }
  