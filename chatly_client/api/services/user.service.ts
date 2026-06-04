import { RegisterFormData } from "@/utils/validation";
import Service from "../service";
import { User, UserSearchItem } from "@/types/user";

class UserService extends Service {
    async registerUser(data: RegisterFormData) {

        const formData = new FormData();

        formData.append("Email", data.email);
        formData.append("Password", data.password);
        formData.append("ConfirmPassword", data.confirmPassword);
        formData.append("Role", "Admin");

        if (data.avatar) {
            formData.append("Avatar", data.avatar);
        }

        return this.post("/user/create",formData);
    }

    async getCurrentUser(): Promise<User> {
        return await this.get(
            "/user"
        );
    }

    async searchUsers(query: string): Promise<UserSearchItem[]> {
        return await this.get(
            `/user/search?query=${encodeURIComponent(query)}`
        );
    }

    async updateUser(
        userId: string,
        data: unknown
    ) {
        return await this.put(
            `/user/${userId}`,
            data
        );
    }

    async changeStatus(userId: string, status: "Active" | "Blocked" | "Inactive") {
        return await this.put(
            `/user/${userId}/status`,
            status
        );
    }

    async list(query?: string): Promise<User[]> {
        return await this.get(
            `/user/list${query ? `?query=${encodeURIComponent(query)}` : ""}`
        );
    }

    async changeEmail(userId: string, email: string) {
        return await this.put(
            `/user/${userId}/email`,
            { email }
        );
    }
}

export const userService = new UserService();