// src/routes/__root.tsx
import {
  Outlet,
  createRootRoute,
  useLocation,
  redirect,
} from "@tanstack/react-router";
import TabBar from "../components/molecules/TabBar";
import { useWebControlStore } from "../store/webControlStore";
import { isAuthenticated, isPublicRoute } from "../utils/auth";

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
  beforeLoad: async ({ location }) => {
    // 공개 라우트가 아니고 인증되지 않은 경우 로그인 페이지로 리다이렉트
    if (!isPublicRoute(location.pathname) && !isAuthenticated()) {
      console.log(
        "인증되지 않은 사용자 - 로그인 페이지로 이동:",
        location.pathname
      );
      throw redirect({
        to: "/login",
        search: {
          // 로그인 후 원래 페이지로 돌아가기 위해 redirect 파라미터 추가 (선택사항)
          redirect: location.href,
        },
      });
    }
  },
});

function RootComponent() {
  const isWide = useWebControlStore((state) => state.isWide);
  const location = useLocation();
  const showTabBar = !HIDDEN_TAB_ROUTES.some((route) =>
    location.pathname.startsWith(route)
  );

  return (
    <>
      <Outlet />
      {showTabBar && !isWide && (
        <TabBar className="fixed bottom-0 left-0 z-40" />
      )}
    </>
  );
}
