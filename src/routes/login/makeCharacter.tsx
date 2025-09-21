import { createFileRoute } from "@tanstack/react-router";
import MakeCharacterPage from "../../pages/login/MakeCharacterPage";

export const Route = createFileRoute("/login/makeCharacter")({
  component: MakeCharacterPage,
});
