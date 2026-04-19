import { z } from "zod";

export const registerSchema = z
    .object({
        email: z.string().email("Niepoprawny email"),

        password: z
            .string()
            .min(8, "Hasło musi mieć minimum 8 znaków")
            .regex(/[A-Z]/, "Musi zawierać jedną dużą literę")
            .regex(/[0-9]/, "Musi zawierać jedną cyfrę")
            .regex(/[^A-Za-z0-9]/, "Musi zawierać znak specjalny"),

        confirmPassword: z.string(),

        avatar: z
            .instanceof(File)
            .optional()
            .refine((file) => !file || file.size <= 2 * 1024 * 1024, {
                message: "Maksymalnie 2MB",
            })
            .refine((file) => !file || ["image/jpeg", "image/png"].includes(file.type), {
                message: "Tylko JPG/PNG",
            }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Hasła się nie zgadzają",
        path: ["confirmPassword"],
    });

export type RegisterFormData = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
    email: z.string().email("Niepoprawny email"),
    password: z.string().min(8, "Hasło musi mieć minimum 8 znaków"),
});

export type LoginFormData = z.infer<typeof loginSchema>;