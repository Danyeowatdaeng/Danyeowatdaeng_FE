import { createFileRoute, redirect } from "@tanstack/react-router";
import HomeLandingPage from "../pages/HomeLandingPage";

export const Route = createFileRoute("/")({
  beforeLoad: ({ location }) => {
    if (location.pathname === "/") {
      // access_token이 쿠키에 없으면 /login으로 리다이렉트
      if (typeof document !== "undefined") {
        const hasToken = document.cookie
          .split(";")
          .some((cookie) => cookie.trim().startsWith("access_token="));
        if (!hasToken) {
          throw redirect({ to: "/login" });
        }
      }
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <HomeLandingPage />;
}
