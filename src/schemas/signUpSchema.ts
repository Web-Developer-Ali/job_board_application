import { z } from "zod";

export const UserNameValidation = z
.string()
.min(3,"User Name must contain 3 Charcter")
.max(20,"User Name no more then 20 Charcter")
.regex(/[a-zA-Z][a-zA-Z0-9._]{2,19}$/,"User Name no contain special Charcter")

export const singUpSchema =z.object({
    username:UserNameValidation,
    email:z.string().email({message:"Invalid Email"}),
    password:z.string().min(8,{message:"Password must contain 8 character"}),
    confirmPassword: z.string().min(8, { message: "Confirm Password must contain at least 8 characters" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });