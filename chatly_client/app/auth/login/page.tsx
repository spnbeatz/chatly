"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
    Button,
    Description,
    FieldError,
    Fieldset,
    Input,
    TextField,
} from "@heroui/react";
import { useForm } from "react-hook-form";
import { LoginFormData, loginSchema } from "@/utils/validation";
import { useRouter } from "next/navigation";
import { InputLabel } from "@/components/shared/InputLabel";
import { useLogin } from "@/api/queries/auth/auth.mutation";

export default function LoginPage() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const router = useRouter();
    const { mutateAsync: login } = useLogin();


    const onSubmit = async (data: LoginFormData) => {
        try {
            await login(data);
            router.push("/");
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    return (
        <Fieldset className="space-y-4">
            <Fieldset.Legend className="text-2xl text-neutral-700">Login</Fieldset.Legend>

            <Description className="text-sm text-default-500">
                Please fill in the form to login to your account.
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
            </Fieldset.Group>

            <Fieldset.Actions className="flex justify-end gap-3">
                <Button
                    type="submit"
                    onClick={handleSubmit(onSubmit)}
                >
                    Login
                </Button>
                <Button variant="secondary" onClick={() => router.push("/auth/register")}>
                    Create account
                </Button>
            </Fieldset.Actions>
        </Fieldset>
    )
}