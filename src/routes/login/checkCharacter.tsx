import { createFileRoute } from "@tanstack/react-router";
import CheckCharacterPage from "../../pages/login/CheckCharacterPage";

export const Route = createFileRoute("/login/checkCharacter")({
  component: CheckCharacterPage,
});
