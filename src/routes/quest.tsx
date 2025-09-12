import { createFileRoute } from "@tanstack/react-router";
import QuestPage from "../pages/QuestPage";

export const Route = createFileRoute("/quest")({
  component: QuestPage,
});