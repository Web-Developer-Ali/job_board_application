# Job Board Application

A Job Board application built using Next.js, MongoDB, TailwindCSS, and various other modern web technologies. This application allows users to register, log in, and apply for jobs, with features like email verification and secure password management.

## Features

- **User Authentication**:

  - Users can register, log in, and manage their accounts.
  - Email verification system for user registration.
  - Password encryption using bcrypt.

- **Job Listings**:

  - Employers can post job opportunities.
  - Job seekers can apply for available job listings.

- **Responsive Design**:
  - TailwindCSS ensures a mobile-friendly design that adjusts to different screen sizes.

- **Real-time Notifications**:
  - Send notifications (e.g., job updates, application status) via email.

## 🛠️ Tech Stack

- **Next.js**: React framework for server-side rendering and static site generation.
- **MongoDB**: NoSQL database for storing user and job data.
- **Mongoose**: ODM for MongoDB in Node.js, simplifying data modeling.
- **TailwindCSS**: Utility-first CSS framework for custom design.
- **NextAuth.js**: Authentication library for Next.js, providing login and session management.
- **Bcrypt**: Library to hash and compare passwords securely.
- **Nodemailer**: For sending email notifications (e.g., email verification).
- **Radix UI**: For accessible UI components.
- **Cloudinary**: For image storage and media uploads.
- **Zod**: For schema validation.

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js (v18 or above)
- npm or yarn

## Installation

Follow these steps to get your development environment up and running:

### 1. Clone the Repository

```bash
git clone https://github.com/Web-Developer-Ali/job_board_application
 
```
### 2. Install dependencies

        npm install

### 3. Run the development server:

        npm run dev

## 🏗️ Project Structuree

├── src/
│ ├── app/ # Pages and API routes in Next.js
│ │ ├── (auth)/ # Authentication pages like Sign In and Sign Up
│ │ ├── (pages)/ # All Static or dynamic pages
│ │ │ ├── recruiter/ # Pages related to recruiters (e.g., posting jobs, managing applicants)
│ │ ├── api/ # API routes for server-side functionality
│ │ │ ├── applicant/ # API routes for managing applicants
│ │ │ │ └── ... # Files for applicant-related functionalities (e.g., getApplicantDetails)
│ │ │ ├── auth/ # API routes for authentication actions.
│ │ │ │ └── ... # Files for user login, token verification
│ │ │ ├── browse_jobs/ # API routes for browsing available jobs
│ │ │ │ └── ... # File for searching/filtering jobs
│ │ │ ├── getJobs_forhomepage/ # API routes for fetching jobs for the homepage
│ │ │ │ └── ... # File for fetching job listings for homepage display
│ │ │ ├── getJobTitles_forhomepage/ # API routes for fetching job titles for homepage
│ │ │ │ └── ... # File for retrieving job titles for homepage
│ │ │ ├── recruiter/ # API routes for recruiter-related actions (e.g., posting jobs, managing applicants)
│ │ │ │ └── ... # Files for recruiters to manage their jobs and applicants
│ │ │ ├── registration/ # API routes for user registration (sign up)
│ │ │ │ └── ... # File for user registration and verification
│ │ │ ├── user_profile/ # API routes for fetching and updating user profiles
│ │ │ │ └── ... # Files for fetching and updating user profiles
│ ├── components/ # Reusable UI components
│ ├── lib/ # Utility functions and helpers
│ ├── model/ # Mongoose models
│ ├── styles/ # TailwindCSS configuration and global styles
│ └── ... # Other code files
├── public/ # Public assets (images, icons, etc.)
├── .env.local # Environment variables
├── package.json # Project dependencies and scripts
└── README.md # Project documentation


## 📚 Usage

- **For Job Seekers**:

1. Register an account and verify your email.
2. Browse job listings and apply for positions.
3. Track your applications in your dashboard.

- **For Employers**:

1. Create a recruiter account.
2. Post new job listings.
3. Manage applications and communicate with candidates.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Contact

For any queries, please reach out to [alihamzashoaib65@gmail.com].
