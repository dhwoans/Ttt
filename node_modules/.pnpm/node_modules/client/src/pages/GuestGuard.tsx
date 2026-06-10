import { Navigate, Outlet } from "react-router-dom";
import { ROUTES, isAuthenticated } from "@/shared/constants/routes";


// 이미 로그인된 사용자가 login으로 진입하는걸 막음.
export default function GuestGuard() {
  if (isAuthenticated()) {
    return <Navigate to={ROUTES.lobby} replace />;
  }
  
  return <Outlet />;
}
