import dbConnection from "@/lib/dbConnect";
import UserModel from "@/model/UserSchema";
import { NextRequest, NextResponse } from "next/server";

// PUT request for onboarding
export async function PUT(req: NextRequest) {
    try {
      await dbConnection();
  
      const { userType, data } = await req.json();
      if (data === null) {
        return new Response(
          JSON.stringify({
            success: false,
            message: "Please fill all fields",
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
  
      // Validate the linkedinProfile URL format before updating
      const linkedinProfilePattern = /^(https?:\/\/)?(www\.)?(linkedin\.com\/.*)$/; // Basic LinkedIn URL regex
      if (data.linkedinProfile && !linkedinProfilePattern.test(data.linkedinProfile)) {
        return new Response(
          JSON.stringify({
            success: false,
            message: "Invalid LinkedIn profile URL",
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
  
      // Add userType as user_Role and onboardComplete in the update data
      const updateData = {
        ...data,
        role: userType,
        onboardComplete: true
      };
      const updatedUser = await UserModel.findOneAndUpdate(
        { email: data.email }, // Unique identifier
        { $set: updateData },
        { new: true, runValidators: true }
      );
  
      if (!updatedUser) {
        return new Response(
          JSON.stringify({
            success: false,
            message: "User not found",
          }),
          { status: 404, headers: { "Content-Type": "application/json" } }
        );
      }
  
      return NextResponse.json(updatedUser, { status: 200 });
    } catch (error: unknown) {
      if (error instanceof Error) {
        // Now TypeScript recognizes 'error' as an instance of Error
        if (error.name === "ValidationError") {
          return new Response(
            JSON.stringify({
              success: false,
              message: "Validation error: " + error.message,
            }),
            { status: 400, headers: { "Content-Type": "application/json" } }
          );
        }
      }
      
      console.error("Error updating user:", error);
      return NextResponse.json(
        { message: "Internal server error" },
        { status: 500 }
      );
    }
  }
  