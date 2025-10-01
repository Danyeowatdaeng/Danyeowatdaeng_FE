import { createFileRoute } from "@tanstack/react-router";
import ReviewWritePage from "../../../pages/ReviewWritePage";

export const Route = createFileRoute("/place/$placeId/review")({
  // 쿼리스트링으로 name을 받는다 (제목용)
  validateSearch: (s: Record<string, unknown>) => ({
    name: typeof s.name === "string" ? s.name : undefined,
  }),
  component: ReviewWritePage,
});