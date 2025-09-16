// src/routes/__root.tsx
import { Outlet, createRootRoute, useLocation } from "@tanstack/react-router";
import TabBar from "../components/molecules/TabBar";

// 탭바를 숨길 경로 목록
const HIDDEN_TAB_ROUTES = [
  "/login", 
  "/login/checkPermission",
  "/landing/cafe",
  "/mypet/diary",
  "/mypet/quest",
  "/profile/coupon",
  "/profile/stamp",
  ];

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const location = useLocation();
  const showTabBar = !HIDDEN_TAB_ROUTES.some((route) =>
    location.pathname.startsWith(route)
  );

  return (
    <>
      <Outlet />
      {showTabBar && <TabBar className="fixed bottom-0 left-0 z-40" />}
    </>
  );
}
