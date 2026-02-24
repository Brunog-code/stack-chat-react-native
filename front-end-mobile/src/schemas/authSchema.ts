import { z } from "zod";

export const authSchema = z.object({
  email: z.email("Email inválido"),
  password: z
    .string("Senha é obrigatória")
    .min(6, "Senha deve ter pelo menos 6 caracteres"),
});

export type AuthFormData = z.infer<typeof authSchema>;
