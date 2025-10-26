// src/routes/__root.tsx
import { Outlet, createRootRoute, useLocation } from "@tanstack/react-router";
import { useEffect } from "react";
import TabBar from "../components/molecules/TabBar";
import { useWebControlStore } from "../store/webControlStore";
import useUserInfoStore from "../store/userInfoStore";
import { isAuthenticated } from "../utils/auth";

// 탭바를 숨길 경로 목록
const HIDDEN_TAB_ROUTES = [
  "/login",
  "/login/checkPermission",
  "/mypet/diary",
  "/mypet/quest",
  "/profile/coupon",
  "/profile/stamp",
  "/profile/point",
];

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const isWide = useWebControlStore((state) => state.isWide);
  const location = useLocation();
  const { isLogin, setIsLogin } = useUserInfoStore();
  const showTabBar = !HIDDEN_TAB_ROUTES.some((route) =>
    location.pathname.startsWith(route)
  );

  // 앱 시작 시 로그인 상태 확인
  useEffect(() => {
    const checkAuthStatus = async () => {
      const authenticated = isAuthenticated();
      if (authenticated && !isLogin) {
        // 쿠키에 토큰이 있지만 로그인 상태가 아닌 경우
        setIsLogin(true); // 이때 자동으로 fetchUserInfo가 호출됨
      }
    };

    checkAuthStatus();
  }, [isLogin, setIsLogin]);

  return (
    <>
      <Outlet />
      {showTabBar && !isWide && (
        <TabBar className="fixed bottom-0 left-0 z-40" />
      )}
    </>
  );
}
