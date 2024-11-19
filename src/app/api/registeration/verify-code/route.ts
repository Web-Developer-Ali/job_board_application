import dbConnection from "@/lib/dbConnect";
import UserModel from "@/model/UserSchema";

export async function POST(request: Request) {
  await dbConnection();
  try {
    const { email, code } = await request.json();
    const user = await UserModel.findOne({ email });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 500 }
      );
    }

    const isValidCode = user.verifyCode === code;
    const isCodeExpire = user.expireVerifyCode && new Date(user.expireVerifyCode) > new Date();

    if (isValidCode && isCodeExpire) {
      user.isVerified = true;
      await user.save();
      return Response.json(
        {
          success: true,
          message: "User Successfully Verified",
        },
        { status: 200 }
      );
    } else if (!isCodeExpire) {
      return Response.json(
        {
          success: false,
          message: "Verification code expired.",
        },
        { status: 400 }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "Incorrect verification code.",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error in verification:", error);
    return Response.json(
      {
        success: false,
        message: "Error in verification.",
      },
      { status: 500 }
    );
  }
}
