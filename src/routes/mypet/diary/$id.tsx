// src/routes/mypet/diary.$id.tsx
import { createFileRoute } from "@tanstack/react-router";
import DiaryDetailPage from "../../../pages/DiaryDetailPage"; // 경로는 프로젝트에 맞게

export const Route = createFileRoute("/mypet/diary/$id")({
  component: DiaryDetailPage,
});