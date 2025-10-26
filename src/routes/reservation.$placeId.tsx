import { createFileRoute } from "@tanstack/react-router";
import ReservationPage from "../pages/ReservationPage";

export const Route = createFileRoute("/reservation/$placeId")({
  component: RouteComponent,
});

function RouteComponent() {
  return <ReservationPage />;
}