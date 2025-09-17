import { createFileRoute } from "@tanstack/react-router";
import PointsPage from "../../pages/PointPage";


export const Route = createFileRoute("/profile/point")({
  component: PointsPage,
});