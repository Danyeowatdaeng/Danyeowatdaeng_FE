
import { createFileRoute } from "@tanstack/react-router";
import StampPage from "../../pages/StampPage";

export const Route = createFileRoute("/profile/stamp")({
  component: StampPage,
});
