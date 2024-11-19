import mongoose, { Schema, Document } from "mongoose";

// Define the Logo interface for TypeScript
interface Logo {
  public_id: string;
  secure_url: string;
}

// Define the Job interface for TypeScript
export interface JobDocument extends Document {
  jobTitle: string;
  jobType: string;
  location: string;
  remote: boolean;
  description: string;
  company: string;
  companyWebsite: string;
  experience: number;
  skills: string[];
  salary: number;
  positions: number; 
  companyLogo?: Logo;
  createdBy: mongoose.Schema.Types.ObjectId;
  live: boolean;
  applicants: mongoose.Schema.Types.ObjectId[]; 
  createdAt: Date;
  updatedAt: Date;
}

// Define the Logo schema
const LogoSchema: Schema<Logo> = new Schema({
  public_id: {
    type: String,
  },
  secure_url: {
    type: String,
    required: true,
  },
});

// Define the Job schema
const JobSchema: Schema<JobDocument> = new Schema(
  {
    jobTitle: {
      type: String,
      required: true,
      trim: true,
    },
    jobType: {
      type: String,
      enum: ["Full-time", "Part-time", "Freelance", "Contract"],
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    remote: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    companyWebsite: {
      type: String,
      required: true,
      trim: true,
    },
    experience: {
      type: Number,
      required: true,
      min: 0,
      max: 99,
    },
    skills: {
      type: [String],
      required: true,
      validate: {
        validator: function (skills: string[]) {
          return skills.length > 0; // Validates that at least one skill is provided
        },
        message: "At least one skill is required",
      },
    },
    salary: {
      type: Number,
      required: true,
      min: 0,
    },
    positions: {
      type: Number, // New field for positions
      required: true,
      min: 1, // Ensure at least one position is required
      validate: {
        validator: function (positions: number) {
          return positions > 0; // Validate that the number of positions is greater than 0
        },
        message: "At least one position is required",
      },
    },
    companyLogo: {
      type: LogoSchema,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    live: {
      type: Boolean,
      default: false,
    },
    applicants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Applicant",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Create the Job model
const Job =
  mongoose.models.Job || mongoose.model<JobDocument>("Job", JobSchema);

export default Job;
