import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/place/$placeId/review")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/place/$placeId/review"!</div>;
}
