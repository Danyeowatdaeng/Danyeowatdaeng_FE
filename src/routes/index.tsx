import { createFileRoute } from "@tanstack/react-router";
import { redirect } from "@tanstack/react-router";
import HomeLandingPage from "../pages/HomeLandingPage";
import useUserInfoStore from "../store/userInfoStore";

const { isLogin } = useUserInfoStore.getState();
export const Route = createFileRoute("/")({
  beforeLoad: ({ location }) => {
    if (location.pathname === "/" && !isLogin) {
      throw redirect({ to: "/login" });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <HomeLandingPage />;
}
