import { createFileRoute } from "@tanstack/react-router";
import CafeListPage from "../../../pages/CafeListPage";

export const Route = createFileRoute("/landing/category/$category")({
  component: CafeListPage,
});
