"use client";

import { registerSchema, RegisterFormData } from "@/utils/validation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Button,
    Description,
    FieldError,
    Fieldset,
    Input,
    TextField,
} from "@heroui/react";
import { InputLabel } from "@/components/shared/InputLabel";
import { useRouter } from "next/navigation";
import { useRegisterUser } from "@/api/queries/users/users.mutation";

export default function RegisterPage() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const router = useRouter();
    const { mutateAsync: registerUser } = useRegisterUser();

    const onSubmit = async (data: RegisterFormData) => {
        try {
            await registerUser(data);
            router.push("/auth/login");
        } catch (error) {
            console.error("Registration failed:", error);
        }
    };

    return (
        <Fieldset className="space-y-4">
            <Fieldset.Legend className="text-2xl text-neutral-700">Register</Fieldset.Legend>

            <Description className="text-sm text-default-500">
                Please fill in the form to create an account.
            </Description>

            <Fieldset.Group className="space-y-4">
                <TextField
                    name="email"
                    isRequired
                    isInvalid={!!errors.email}
                    className="w-full"
                >
                    <InputLabel text="Email" />
                    <Input
                        variant="secondary"
                        type="email"
                        placeholder="you@example.com"
                        {...register("email")}
                    />
                    <FieldError>{errors.email?.message}</FieldError>
                </TextField>

                <TextField
                    name="password"
                    isRequired
                    isInvalid={!!errors.password}
                    className="w-full"
                >
                    <InputLabel text="Password" />
                    <Input
                        type="password"
                        variant="secondary"
                        {...register("password")}
                    />
                    <FieldError>{errors.password?.message}</FieldError>
                </TextField>

                <TextField
                    name="confirmPassword"
                    isRequired
                    isInvalid={!!errors.confirmPassword}
                    className="w-full"
                >
                    <InputLabel text="Confirm password" />
                    <Input
                        variant="secondary"
                        type="password"
                        {...register("confirmPassword")}
                    />
                    <FieldError>{errors.confirmPassword?.message}</FieldError>
                </TextField>
            </Fieldset.Group>

            <Fieldset.Actions className="flex justify-end gap-3">
                <Button
                    type="submit"
                    onClick={handleSubmit(onSubmit)}
                >
                    Create account
                </Button>
                <Button variant="secondary" onClick={() => router.push("/auth/login")}>
                    Login
                </Button>
            </Fieldset.Actions>

        </Fieldset>
    );
}

