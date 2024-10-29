import * as z from 'zod'

const phoneRegex = new RegExp(
    /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);

export const LoginSchema = z.object({
    username: z.string().min(6, {
        message: "Usuário deve conter ao menos 6 caracteres"
    }).regex(/^\S*$/, {
        message: "Usuário não pode conter espaços"
    }),
    password: z.string().min(6, {
        message: "Senha deve conter ao menos 6 caracteres"
    }),
})

export const RegisterSchema = z.object({
    username: z.string().min(6, {
        message: "Nome de usuário é obrigatório"
    }).regex(/^\S*$/, {
        message: "Usuário não pode conter espaços"
    }),
    password: z.string().min(6, {
        message: "Mínimo de 6 caracteres"
    }),
    role: z.enum(['root', 'admin', 'journalist']),
    isBlocked: z.boolean(),
    name: z.string().optional(),
    phone: z.string().regex(phoneRegex, 'Número de telefone inválido!').optional(),
    email: z.string().email({ message: "Digite um e-mail válido" }).optional(),
    image: z.string().optional(),
});

export const SettingsEditSchema = z.object({
    name: z.string().min(6, {
        message: "Mínimo de 6 caracteres"
    }).optional(),
    image: z.string().optional(),
    email: z.string().email({
        message: "Digite um e-mail válido"
    }).optional(),
    phone: z.string().regex(phoneRegex, 'Número de telefone inválido!').optional()
});

export const PasswordUpdateSchema = z.object({
    password: z.string().min(6, {
        message: "Mínimo de 6 caracteres"
    }),
    newPassword: z.string().min(6, {
        message: "Mínimo de 6 caracteres"
    }),
    confirmPassword: z.string().min(6, {
        message: "Mínimo de 6 caracteres"
    }),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "As senhas não se correspondem",
    path: ['confirmPassword'],  // Para qual input a mensagem erro irá aparecer, caso retorne false
});

export const TokenVerificationSchema = z.object({
    username: z.string().min(6, {
        message: "Usuário deve conter ao menos 6 caracteres"
    }).regex(/^\S*$/, {
        message: "Usuário não pode conter espaços"
    }),
    token: z.string(),
});

export const PasswordResetSchema = z.object({
    newPassword: z.string().min(6, {
        message: "Mínimo de 6 caracteres"
    }),
    confirmNewPassword: z.string().min(6, {
        message: "Mínimo de 6 caracteres"
    }),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "As senhas não se correspondem",
    path: ['confirmNewPassword'],
});

export const UserEditSchema = z.object({
    name: z.string().optional(),
    role: z.enum(['root', 'admin', 'journalist']),
    isBlocked: z.boolean(),
    phone: z.string().regex(phoneRegex, 'Número de telefone inválido!').optional(),
    email: z.string().email({ message: "Digite um e-mail válido" }).optional(),
    image: z.string().optional(),
})