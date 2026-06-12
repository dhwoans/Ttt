import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import LobbyPage from "./pages/LobbyPage";
import SingleGameRoomPage from "./pages/SingleGameRoomPage";
import MultiGameRoomPage from "./pages/MultiGameRoomPage";
import LocalHostPage from "./pages/LocalHostPage";
import LocalGuestPage from "./pages/LocalGuestPage";
import AuthGuard from "./pages/AuthGuard";
import GuestGuard from "./pages/GuestGuard";
import NotFoundPage from "./pages/NotFoundPage";
import { ROUTES, isAuthenticated } from "./shared/constants/routes";

function RootRedirect() {
  const to = isAuthenticated() ? ROUTES.lobby : ROUTES.login;
  return <Navigate to={to} replace />;
}

function App() {
  return (
    <Routes>
      <Route path={ROUTES.root} element={<RootRedirect />} />
      <Route element={<GuestGuard />}>
        <Route path={ROUTES.login} element={<LoginPage />} />
      </Route>
      <Route element={<AuthGuard />}>
        <Route path={ROUTES.lobby} element={<LobbyPage />} />
        <Route path={ROUTES.game.single} element={<SingleGameRoomPage />} />
        <Route path={ROUTES.game.roomPattern} element={<MultiGameRoomPage />} />
        <Route
          path={ROUTES.game.localHostPattern}
          element={<LocalHostPage />}
        />
        <Route
          path={ROUTES.game.localGuestPattern}
          element={<LocalGuestPage />}
        />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
