import { create } from "zustand";

interface ModalState {
  openModal: "exit" | "gameOver" | null;
  setOpenModal: (modal: "exit" | "gameOver" | null) => void;
}

export const useModalStore = create<ModalState>()((set) => ({
  openModal: null,
  setOpenModal: (openModal) => set({ openModal }),
}));
