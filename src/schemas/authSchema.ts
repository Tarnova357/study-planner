import { z } from 'zod';

export const authSchema = z.object({
    username: z
        .string()
        .trim()
        .min(1, 'Введіть ім’я користувача'),
    password: z
        .string()
        .min(6, 'Пароль має містити щонайменше 6 символів'),
});

export type LoginFormData = z.infer<typeof authSchema>;