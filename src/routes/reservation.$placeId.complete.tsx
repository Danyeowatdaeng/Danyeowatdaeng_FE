import { createFileRoute } from "@tanstack/react-router";
import ReservationCompletePage from "../pages/ReservationCompletePage";

export const Route = createFileRoute("/reservation/$placeId/complete")({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>) => {
    // 동적으로 모든 search 파라미터를 반환
    const result: Record<string, string | undefined> = {};
    
    // couponId는 항상 포함
    result.couponId = (search.couponId as string) || undefined;
    
    // 나머지 모든 필드를 추가
    Object.keys(search).forEach(key => {
      if (key !== 'couponId') {
        result[key] = (search[key] as string) || undefined;
      }
    });
    
    return result;
  },
});

function RouteComponent() {
  return <ReservationCompletePage />;
}