import { create } from "zustand";
import { User } from "@/types/user";

type UserState = {
    user: User | null | undefined;
    setUser: (user: User | null) => void;
};

export const useUserStore = create<UserState>((set) => ({
    user: undefined,
    setUser: (user) => set({ user }),
}));