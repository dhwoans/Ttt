import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useGameStore } from "@/stores/useGameStore";
import { ROUTES } from "@/shared/constants/routes";

/**
 * 방 배정 시 자동으로 게임 페이지로 이동하는 훅
 */
export function useRoomNavigation() {
  const navigate = useNavigate();
  const roomId = useGameStore((state) => state.tree.game.roomId);

  useEffect(() => {
    if (roomId) {
      console.log("[Navigation] Room assigned, navigating to:", roomId);
      toast.success("🎟️ 게임 방으로 입장합니다!");
      
      const timer = setTimeout(() => {
        navigate(ROUTES.game.room(roomId));
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [roomId, navigate]);
}
