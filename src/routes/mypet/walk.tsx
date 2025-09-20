import { createFileRoute } from "@tanstack/react-router";
import WalkPage from "../../pages/WalkPage";

export const Route = createFileRoute("/mypet/walk")({
  component: WalkPage,
});