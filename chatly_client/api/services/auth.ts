/* await fetch("/api/auth/login", {
  method: "POST",
  credentials: "include", // 🔥 KLUCZOWE
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ email, password })
}); */

import { LoginFormData } from "@/utils/validation";
import { apiConfig } from "../config";

export const authService = {

  async login({email, password} : LoginFormData) {
    const response = await fetch(`${apiConfig.baseUrl}/auth/login`, {
      method: "POST",
      credentials: "include", // 🔥 KLUCZOWE
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    console.log(data, "login data");
    return data;
  },

  async logout() {
    const response = await fetch(`${apiConfig.baseUrl}/auth/logout`, {
      method: "POST",
      credentials: "include", // 🔥 KLUCZOWE
    });
    const data = await response.json();
    console.log(data, "logout data");
    return data;
  }

}