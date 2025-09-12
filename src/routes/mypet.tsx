import { createFileRoute } from "@tanstack/react-router";
import MyPetPage from "../pages/MyPetPage";

export const Route = createFileRoute("/mypet")({
  component: MyPetPage,
});