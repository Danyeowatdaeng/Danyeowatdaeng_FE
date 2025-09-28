import { createFileRoute } from "@tanstack/react-router";
import PlacePage from "../../pages/PlacePage";

export const Route = createFileRoute("/place/")({
  component: PlacePage,
});