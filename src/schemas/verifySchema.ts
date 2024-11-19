import { z } from "zod";

export const verifySchema =z.object({
    code:z.string().length(6,{message:"code must contain 6 digits"})
})
