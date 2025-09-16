import { createFileRoute, redirect } from "@tanstack/react-router";
import HomeLandingPage from "../pages/HomeLandingPage";

export const Route = createFileRoute("/")({
  beforeLoad: ({ location }) => {
    // 첫 진입 시 무조건 /login으로 리다이렉트
    if (location.pathname === "/") {
      throw redirect({ to: "/login" });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <HomeLandingPage />;
}
