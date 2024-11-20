import mongoose, { Schema, Document } from "mongoose";

// Define the Applicant interface for TypeScript
interface ApplicantDocument extends Document {
  name: string;
  email: string;
  resumeUrl: string;
  appliedAt: Date;
  status: string;
  is_statusChange:boolean;
  job: mongoose.Schema.Types.ObjectId;
  applicant_id: mongoose.Schema.Types.ObjectId; // Added applicant_id
  numberof_applicant:number
}

// Define the Applicant schema
const ApplicantSchema: Schema<ApplicantDocument> = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  resumeUrl: {
    type: String,
    required: true,
  },
  appliedAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['Accepted', 'Rejected', 'Pending'],
    required: true,
  },
  is_statusChange:{
    type:Boolean,
    required:true,
    default:false
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true,
  },
  applicant_id: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true,
  },
  numberof_applicant:{
    type:Number
  }
});

// Create the Applicant model
const Applicant =
  mongoose.models.Applicant ||
  mongoose.model<ApplicantDocument>("Applicant", ApplicantSchema);

export default Applicant;
