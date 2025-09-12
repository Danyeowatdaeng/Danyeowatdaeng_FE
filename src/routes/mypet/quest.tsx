import { createFileRoute } from "@tanstack/react-router";
import QuestPage from "../../pages/QuestPage";

export const Route = createFileRoute("/mypet/quest")({
  component: QuestPage,
});