import { Navigate, Outlet, useLocation } from "react-router-dom";
import { ROUTES } from "@/shared/constants/routes";
import { useUserStore } from "@/stores/useUserStore";

// 로그인안한 계정이 컨텐츠 진입하는걸 막음.
export default function AuthGuard() {
  const location = useLocation();
  const myPlayer = useUserStore((state) => state.myPlayer);
  const userId = myPlayer?.userId;
  const nickname = myPlayer?.nickname;

  if (!userId || !nickname) {
    return <Navigate to={ROUTES.login} replace state={{ from: location }} />;
  }

  return <Outlet />;
}
