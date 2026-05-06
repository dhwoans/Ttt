import { create } from "zustand";
import { persist } from "zustand/middleware";

export type MyPlayer = {
  userId: string;
  nickname: string;
  avatarIndex: number;
};

interface UserState {
  myPlayer: MyPlayer | null;
  setMyPlayer: (player: MyPlayer) => void;
  clearMyPlayer: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      myPlayer: null,
      setMyPlayer: (myPlayer) => set({ myPlayer }),
      clearMyPlayer: () => set({ myPlayer: null }),
    }),
    { name: "user-storage" },
  ),
);
