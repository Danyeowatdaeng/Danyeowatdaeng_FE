// routes/mypet/diary/$id.tsx
import { createFileRoute } from "@tanstack/react-router";
import DiaryDetailPage from "../../../pages/DiaryDetailPage"; // 경로 맞게

export const Route = createFileRoute("/mypet/diary/$id")({
  // 선택: 목록에서 넘긴 orderedIds를 검색쿼리로 받음
  validateSearch: (s: Record<string, unknown>) => {
    const raw = (s as any).orderedIds;
    let orderedIds: number[] | undefined;
    if (Array.isArray(raw)) orderedIds = raw.map(Number).filter(Number.isFinite);
    else if (typeof raw === "string")
      orderedIds = raw.split(",").map(Number).filter(Number.isFinite);
    return { orderedIds };
  },
  component: DiaryDetailPage,
});