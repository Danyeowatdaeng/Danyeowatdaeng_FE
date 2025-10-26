import { createFileRoute } from "@tanstack/react-router";
import GroupDetailPage from "../../pages/GroupDetailPage";

export const Route = createFileRoute("/cart/group/$groupId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { groupId } = Route.useParams();
  return <GroupDetailPage groupId={Number(groupId)} />;
}

