import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

interface EmailResponse {
  success: boolean;
  message: string;
}

type EmailType = "verification" | "jobStatus";

interface EmailOptions {
  type: EmailType;
  userEmail: string;
  username: string;
  otp?: string;
  jobStatus?: string;
  jobTitle?: string;
}

const sendEmail = async (options: EmailOptions): Promise<NextResponse<EmailResponse>> => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD,
      },
    });

    let emailContent: string;
    let emailSubject: string;

    switch (options.type) {
      case "verification":
        emailContent = `
          <div style="font-family: Arial, sans-serif; line-height: 1.5;">
            <h2>Hello ${options.username},</h2>
            <p>Thank you for registering. Please use the following OTP to verify your email address and complete your registration:</p>
            <h3 style="color: #4CAF50;">${options.otp}</h3>
            <p>If you did not request this, please ignore this email.</p>
          </div>
        `;
        emailSubject = "Email Verification OTP";
        break;
      case "jobStatus":
        emailContent = `
          <div style="font-family: Arial, sans-serif; line-height: 1.5;">
            <h2>Hello ${options.username},</h2>
            <p>We are pleased to inform you that your application for the position of ${options.jobTitle} has been ${options.jobStatus}.</p>
            <p>If you have any questions, please don't hesitate to contact us.</p>
            <p>Thank you for your interest in our company.</p>
          </div>
        `;
        emailSubject = `Job Application ${options.jobStatus} - ${options.jobTitle}`;
        break;
      default:
        throw new Error("Invalid email type");
    }

    const mailOptions = {
      from: `"Job Portal" <${process.env.GMAIL_USER}>`,
      to: options.userEmail,
      subject: emailSubject,
      html: emailContent,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { success: true, message: "Email sent successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send email: " + error },
      { status: 500 }
    );
  }
};

export { sendEmail };