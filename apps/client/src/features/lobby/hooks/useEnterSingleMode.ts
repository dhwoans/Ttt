import { ROUTES } from "@/shared/constants/routes";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export function useEnterSingleMode() {
  const navigate = useNavigate();
  const handleSingleMode = () => {
    toast("🤔 알고리즘 구상 중...");
    setTimeout(() => {
      navigate(ROUTES.game.single);
    }, 1500);
  };

  // 2. 버튼이 이 함수를 가져다 쓸 수 있게 return으로 내보냅니다.
  return { handleSingleMode };
}
