import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type UserProfile = {
  userId: string;
  nickname: string;
  avatarIndex: number;
};

interface UserState {
  currentUser: UserProfile | null;
  setCurrentUser: (user: UserProfile) => void;
  clearCurrentUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      currentUser: null,
      setCurrentUser: (currentUser) => set({ currentUser }),
      clearCurrentUser: () => set({ currentUser: null }),
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
