import * as z from 'zod'

export const ArticleSchema = z.object({
    title: z.string()
        .min(1, "O título é obrigatório")
        .max(255, "O título não pode ter mais de 255 caracteres"),
    subtitle: z.string().optional(),
    slug: z.string()
        .min(1, "O slug é obrigatório")
        .max(100, "O slug não pode ter mais de 100 caracteres")
        .transform((val) => val.replace(/\s+/g, '-')),
    author: z.string()
        .min(1, "O nome do autor é obrigatório")
        .max(100, "O nome do autor não pode ter mais de 100 caracteres"),
    content: z.string().optional(),
    published: z.boolean(),
    imageUrl: z.string().optional()
});