import { RegisterFormData } from "@/utils/validation";
import Service from "../service";
import { User, UserSearchItem } from "@/types/user";

class UserService extends Service {
    async registerUser(data: RegisterFormData) {

        const formData = new FormData();

        formData.append("Email", data.email);
        formData.append("Password", data.password);
        formData.append("ConfirmPassword", data.confirmPassword);
        formData.append("Role", "User");

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

    async deleteUser(userId: string) {
        return await this.delete(
            `/user/${userId}`
        );
    }
}

export const userService = new UserService();