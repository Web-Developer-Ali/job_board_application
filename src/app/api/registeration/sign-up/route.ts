import dbConnection from "@/lib/dbConnect";
import UserModel from "@/model/UserSchema";
import bcrypt from "bcrypt";
import { sendEmail } from "@/helper/sendVerificationEmail"; 

export async function POST(request: Request): Promise<Response> {
  await dbConnection();
  try {
    const { full_Name, email, password } = await request.json();
    const existingUserByEmail = await UserModel.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return new Response(
          JSON.stringify({
            success: false,
            message: "User with this email already exists.",
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      } else {
        // Update the verification code and expiry for existing unverified user
        existingUserByEmail.verifyCode = verifyCode;
        const expireTime = new Date();
        expireTime.setMinutes(expireTime.getMinutes() + 10);
        existingUserByEmail.expireVerifyCode = expireTime;

        await existingUserByEmail.save();

        // Send OTP email
        const emailResponse = await sendEmail({
          type: "verification",
          userEmail: email,
          username: full_Name,
          otp: verifyCode,
        });
        if (!emailResponse.ok) {
          return emailResponse; // Forward the error response from sendEmail
        }

        return new Response(
          JSON.stringify({
            success: true,
            message: "Verification email sent. Please check your email.",
          }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expireTime = new Date();
      expireTime.setMinutes(expireTime.getMinutes() + 10);

      const newUser = new UserModel({
        full_Name,
        email,
        password: hashedPassword,
        verifyCode,
        expireVerifyCode: expireTime,
        isVerified: false,
      });
      await newUser.save();

      // Send OTP email
      const emailResponse = await sendEmail({
        type: "verification",
        userEmail: email,
        username: full_Name,
        otp: verifyCode,
      });
      if (!emailResponse.ok) {
        return emailResponse; // Forward the error response from sendEmail
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: "User registered successfully. Please verify your email.",
        }),
        { status: 201, headers: { "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    console.log("Error registering User:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Error registering user.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
