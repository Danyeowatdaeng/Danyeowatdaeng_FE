import { useState } from "react";
import CafeListTemplate from "../components/templates/CafeListTemplate";
import { useRouter } from "@tanstack/react-router";
import { Route } from "../routes/landing/category/$category";

export default function CafeListPage() {
  const router = useRouter();
  const [distance, setDistance] = useState<"500m" | "1km" | "2km" | "4km">(
    "500m"
  );

  const { category } = Route.useParams();
  console.log("선택된 카테고리:", category);

  // 카테고리에 따른 제목 매핑
  const categoryTitleMap: Record<string, string> = {
    tourist: "관광지",
    accommodation: "숙박",
    experience: "체험/레저",
    restaurant: "음식점",
    cafe: "카페",
    shopping: "쇼핑",
    culture: "문화시설",
    festival: "공연/축제",
  };

  const title = categoryTitleMap[category] || "관광지";

  return (
    <CafeListTemplate
      title={title}
      onBack={() => router.history.back()}
      distanceLabel={distance}
      onDistanceClick={setDistance}
      cafes={[]}
      onCafeClick={(id) => console.log("카페 클릭:", id)}
    />
  );
}
