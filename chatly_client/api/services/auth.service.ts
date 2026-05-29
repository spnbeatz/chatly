import { LoginFormData } from "@/utils/validation";
import Service from "../service";

class AuthService extends Service {
    async login({ email, password }: LoginFormData) {
        return this.post(
            "/auth/login",
            {
                email,
                password
            }
        );
    }

    async logout() {
        return this.post(
            "/auth/logout"
        );
    }
}

export const authService = new AuthService();
