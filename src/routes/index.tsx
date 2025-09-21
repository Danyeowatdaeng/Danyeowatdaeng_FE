import { createFileRoute } from "@tanstack/react-router";
import HomeLandingPage from "../pages/HomeLandingPage";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <HomeLandingPage />;
}
