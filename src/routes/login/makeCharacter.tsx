import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/login/makeCharacter")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/login/makeCharacter"!</div>;
}
