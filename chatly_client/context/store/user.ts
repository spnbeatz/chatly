import { create } from "zustand";

type UserState = {
    id: number
    username: string | null;
    setUser: (id?: number, username?: string | null) => void;
};

export const useUserStore = create<UserState>((set) => ({
    id: 0,
    username: null,
    setUser: (id, username) => set((state) => ({
        id: id ?? state.id,
        username: username ?? state.username,
    })),
}));