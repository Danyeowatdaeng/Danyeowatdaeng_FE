import { createFileRoute } from "@tanstack/react-router";
import DiaryWritePage from "../../pages/DiaryWritePage";

export const Route = createFileRoute("/mypet/diary")({
  component: DiaryWritePage,
});