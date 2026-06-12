import { useModalStore } from "@/stores/useModalStore";
import { useEffect } from "react";

// 감지된 뒤로가기에 반응하여 종료 모달을 띄우는 공용 훅
export function useBackExitModal() {
  const openModal = useModalStore((state) => state.openModal);
  const setOpenModal = useModalStore((state) => state.setOpenModal);

  useEffect(() => {
    const currentUrl = window.location.href;
    window.history.pushState({ lobbyBackTrap: true }, "", currentUrl);

    const handlePopState = () => {
      setOpenModal("exit");
      window.history.pushState({ lobbyBackTrap: true }, "", currentUrl);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);
  return openModal;
}
