import { z } from "zod";

export const singInSchema =z.object({
    identifier:z.string(),
    password:z.string(),
})
