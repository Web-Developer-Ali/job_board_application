import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

interface EmailResponse {
  success: boolean;
  message: string;
}

const sendVerificationEmail = async (
  userEmail: string,
  otp: string,
  username: string
): Promise<NextResponse<EmailResponse>> => {
  try {
    // Gmail SMTP settings
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,  // Your Gmail address
        pass: process.env.GMAIL_PASSWORD,  // Your Gmail password (or app-specific password)
      },
    });

    // Create email content
    const emailHtml = `
       <div style="font-family: Arial, sans-serif; line-height: 1.5;">
        <h2>Hello ${username},</h2>
        <p>Thank you for registering. Please use the following OTP to verify your email address and complete your registration:</p>
        <h3 style="color: #4CAF50;">${otp}</h3>
        <p>If you did not request this, please ignore this email.</p>
      </div>
    `;

    // Configure mail options
    const mailOptions = {
      from: `"E-commerce App" <${process.env.GMAIL_USER}>`,
      to: userEmail,
      subject: "Email Verification OTP",
      html: emailHtml,
    };

    await transporter.sendMail(mailOptions);

    // Return success response
    return NextResponse.json(
      { success: true, message: "Verification email sent successfully." },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Something went wrong: " + error },
      { status: 500 }
    );
  }
};

export { sendVerificationEmail };
