import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import fs from "fs";
import path from "path";
import os from "os";
import { promisify } from "util";
import { uploadOnCloudinary, deleteFromCloudinary } from "@/lib/cloudinary";
import UserModel from "@/model/UserSchema";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnection from "@/lib/dbConnect";

// Promisify unlink function for async use
const unlinkAsync = promisify(fs.unlink);

// Define temporary directory path for image uploads
const tempDir = path.join(os.tmpdir(), "profile-images");

if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

export async function POST(request: Request) {
  try {
    await dbConnection();

    // Extract the session token
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Retrieve the user from the database
    const user = await UserModel.findById(session.user._id);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Check if the profile image was updated in the last 30 days
    const now = new Date();
    const lastUpdated = user.profileImageUpdatedAt
      ? new Date(user.profileImageUpdatedAt)
      : null;

    const daysSinceLastUpdate = lastUpdated
      ? Math.floor((now.getTime() - lastUpdated.getTime()) / (1000 * 3600 * 24))
      : null;

    let remainingDays = 0;
    if (daysSinceLastUpdate === 0 && daysSinceLastUpdate < 30) {
      remainingDays = 30 - daysSinceLastUpdate; // Calculate the remaining days
      return NextResponse.json(
        {
          message: `You can only update your profile image once every 30 days. Please try again in ${remainingDays} day(s).`,
          remainingDays,
        },
        { status: 403 }
      );
    }

    // Parse form data from the request
    const formData = await request.formData();

    if (!formData) {
      return NextResponse.json(
        { message: "Please provide an image" },
        { status: 400 }
      );
    }

    // Directly extract profile image and oldImageId from formData
    const oldImageId = formData.get("oldImageId")?.toString();
    const profileImageFile = formData.get("profileImage") as File;

    if (!profileImageFile) {
      return NextResponse.json(
        { message: "No image uploaded" },
        { status: 400 }
      );
    }

    // If oldImageId exists, delete the old image from Cloudinary
    if (oldImageId && oldImageId !== "undefined") {
      const deleteResult = await deleteFromCloudinary(oldImageId);

      // Check if the deletion was successful
      if (deleteResult.result !== "ok") {
        return NextResponse.json(
          { message: "Failed to delete old image. Please try again" },
          { status: 500 }
        );
      }
    }

    // Save the uploaded image temporarily
    const tempFilePath = path.join(tempDir, profileImageFile.name);
    const buffer = Buffer.from(await profileImageFile.arrayBuffer());

    // Save file temporarily
    fs.writeFileSync(tempFilePath, buffer);

    // Upload the new profile image to Cloudinary
    const cloudinaryResult = await uploadOnCloudinary(
      tempFilePath,
      "JobPortal"
    );
    const profileImage = {
      public_id: cloudinaryResult.public_id,
      secure_url: cloudinaryResult.secure_url,
    };

    // Remove the temp file
    await unlinkAsync(tempFilePath);

    // Update the user profile with the new image
    const updatedUser = await UserModel.findByIdAndUpdate(
      session.user._id,
      {
        avatar: {
          secure_url: profileImage.secure_url, // Store secure_url
          public_id: profileImage.public_id, // Store public_id
        },
        profileImageUpdatedAt: new Date(), // Update the timestamp for the last update
      },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Return updated user information
    return NextResponse.json({
      message: "Profile image updated",
      avatar: updatedUser.avatar, // Return the updated avatar object
    });
  } catch (err) {
    console.error("Error updating profile image:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
