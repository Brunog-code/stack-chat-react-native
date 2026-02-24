import { z } from "zod";

export const loginAuthSchema = z.object({
  body: z.object({
    email: z.email("Precisa ser um email válido"),
    password: z.string().min(6, "Minimo de caracteres"),
  }),
});
