import { createFileRoute } from "@tanstack/react-router";
import ReservationCompletePage from "../pages/ReservationCompletePage";

export const Route = createFileRoute("/reservation/$placeId/complete")({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      period: (search.period as string) || "",
      rooms: (search.rooms as string) || "",
      people: (search.people as string) || "",
      couponId: (search.couponId as string) || undefined,
    };
  },
});

function RouteComponent() {
  return <ReservationCompletePage />;
}