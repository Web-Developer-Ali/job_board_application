import mongoose, { Schema, Document } from "mongoose";

// Define the user interface extending Document from Mongoose
export interface IUser extends Document {
  full_Name?: string;
  email: string;
  password?: string;
  verifyCode?: string;
  expireVerifyCode?: Date;
  isVerified: boolean;
  onboardComplete: boolean;
  otpVerified?: boolean;
  role: "candidate" | "recruiter";
  user_Role: string;
  preferred_location?: string[];
  previous_companies?: string[];
  experience?: string;
  skills?: string[];
  linkedinProfile?: string;
  companyName?: string;
  companyLocation?: string;
  companyRole?: string;
  avatar?: {
    secure_url: string;
    public_id: string;
  };
  profileImageUpdatedAt:Date;
  location?: string;
  name?: string;
  graduation?: string; // Added graduation field
  resumeUrl?: string; // Added resume URL field
}

// Define the Mongoose schema for users
const UserSchema: Schema<IUser> = new Schema({
  full_Name: {
    type: String,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    unique: true,
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Please use a valid email",
    ],
  },
  password: {
    type: String,
  },
  verifyCode: {
    type: String,
  },
  expireVerifyCode: {
    type: Date,
    required: [true, "Verify Code Expiry is required"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  onboardComplete: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    enum: ["candidate", "recruiter"],
  },
  user_Role: {
    type: String,
  },
  preferred_location: {
    type: [String],
    default: [],
    required: function () {
      return this.role === "candidate";
    }, // Required only for candidates
  },
  previous_companies: {
    type: [String],
    required: function () {
      return this.role === "candidate";
    }, // Required only for candidates
  },
  experience: {
    type: String,
    required: function () {
      return this.role === "candidate";
    }, // Required only for candidates
  },
  graduation: {
    type: String,
    required: function () {
      return this.role === "candidate";
    },
  },
  resumeUrl: {
    type: String, // Resume URL field
    required: function () {
      return this.role === "candidate"; // Required only for candidates
    },
    match: [
      /^(https?:\/\/.*\.(pdf|doc|docx))$/, // Regex for PDF or Word document URLs
      "Please use a valid resume URL",
    ],
  },
  skills: {
    type: [String],
    default: [],
    required: function () {
      return this.role === "candidate";
    }, // Required only for candidates
  },
  linkedinProfile: {
    type: String,
    match: [
      /^(https?:\/\/)?(www\.)?linkedin\.com\/(in|pub|company)\/[a-zA-Z0-9-]+\/?$/,
      "Please use a valid LinkedIn profile URL",
    ],
  },
  companyName: {
    type: String,
    required: function () {
      return this.role === "recruiter";
    }, // Required only for recruiters
  },
  companyLocation: {
    type: String,
    required: function () {
      return this.role === "recruiter";
    }, // Required only for recruiters
  },
  companyRole: {
    type: String,
    required: function () {
      return this.role === "recruiter";
    }, // Required only for recruiters
  },
  avatar: {
    secure_url: {
      type: String,
    },
    public_id: {
      type: String,
    },
  },
  profileImageUpdatedAt: {
    type: Date,
    default: null,
  },
  location: {
    type: String,
    required: function () {
      return this.role === "recruiter";
    }, // Required if recruiter
  },
});

// Create or use the existing Mongoose model for the User schema
const UserModel =
  (mongoose.models.User as mongoose.Model<IUser>) ||
  mongoose.model<IUser>("User", UserSchema);

export default UserModel;
