import { z } from "zod";

export const searchSchema = z.object({
  city: z
    .string()
    .min(1, "O nome da cidade é obrigatório")
    .min(2, "O nome da cidade deve ter pelo menos 2 caracteres")
    .max(100, "O nome da cidade deve ter no máximo 100 caracteres")
    .trim(),
});

export type SearchFormData = z.infer<typeof searchSchema>;
