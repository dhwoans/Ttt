import { create } from "zustand";

type ModalType = "exit" | "setting" | "gameOver" | null;
interface ModalState {
  openModal: ModalType;
  setOpenModal: (modal: ModalType) => void;
}

export const useModalStore = create<ModalState>()((set) => ({
  openModal: null,
  setOpenModal: (openModal) => set({ openModal }),
}));
