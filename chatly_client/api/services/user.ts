import { RegisterFormData } from "@/utils/validation";
import { apiConfig } from "../config";

export const userService = {

    async registerUser({ email, password, confirmPassword, avatar }: RegisterFormData   ) {
        const formData = new FormData();

        formData.append("Email", email);
        formData.append("Password", password);
        formData.append("ConfirmPassword", confirmPassword);

        if (avatar) {
            formData.append("Avatar", avatar);
        }

        const response = await fetch(`${apiConfig.baseUrl}/user/create`, {
            method: "POST",
            credentials: "include",
            body: formData
        });

        if (!response.ok) {
            const error = await response.json();
            throw error;
        }
        const data = await response.text();
        console.log(data, "register data");
        return data;
    },

    async getCurrentUser() {
        const response = await fetch(`${apiConfig.baseUrl}/user`, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            const error = await response.json();
            throw error;
        }
        const data = await response.json();
        console.log(data, "current user dataa");
        return data;
    },

    async searchUsers(query: string) {
        const response = await fetch(`${apiConfig.baseUrl}/user/search?query=${encodeURIComponent(query)}`, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            const error = await response.json();
            throw error;
        }
        const data = await response.json();
        console.log(data, "search users data");
        return data;
    }
}