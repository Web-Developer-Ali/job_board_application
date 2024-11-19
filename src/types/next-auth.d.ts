import "next-auth";


declare module "next-auth" {
  interface User {
    _id?: string;
    isVerified?: boolean;
    email?: string;
    username?: string;
    role?:string;
    otpVerified?:boolean;
    onboardComplete?:boolean;
    resumeUrl?:string;
    avatar?:string;
    full_Name?:string
  }
  interface Session {
    user: {
      _id?:string;
      isVerified?: boolean;
      email?: string;
      username?: string;
      otpVerified?:booleans;
      resumeUrl?:string;
      role?:string
    } & DefaultSession['user'];
  }
}
