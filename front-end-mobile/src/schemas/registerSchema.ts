import { z } from "zod";

export const registerSchema = z
  .object({
    name: z
      .string("Nome é obrigatório")
      .min(3, "O nome precisa ter pelo menos 3 caracteres"),
    email: z.email("Email inválido"),
    password: z
      .string("Senha é obrigatória")
      .min(6, "Senha deve ter pelo menos 6 caracteres"),
    confirmPassword: z
      .string("Senha é obrigatória")
      .min(6, "Confirme sua senha"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
