import { z } from "zod";

export const registerUserSchema = z.object({
  body: z.object({
    name: z.string().min(3, "O nome precisa ter no minimo 3 letras"),
    email: z.email("Precisa ser um email válido"),
    password: z.string().min(6, "Minimo de caracteres"),
  }),
});

export const updateNameSchema = z.object({
  params: z.object({
    id: z.string().min(6, "ID obrigatório"),
  }),
  body: z.object({
    name: z.string().min(3, "O nome precisa ter no minimo 3 letras"),
  }),
});

export const updateImageSchema = z.object({
  params: z.object({
    id: z.string().min(6, "ID obrigatório"),
  }),
  body: z.object({
    urlImage: z.string(),
  }),
});
