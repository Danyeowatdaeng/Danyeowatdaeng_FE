import { useState } from "react";
import CafeListTemplate from "../components/templates/CafeListTemplate";
import { useRouter } from "@tanstack/react-router";
import { Route } from "../routes/landing/category/$category";
import { useMapSearch } from "../hooks/useMapSearch";
import { CATEGORY_TITLE_MAP } from "../utils/categoryMapping";

export default function CafeListPage() {
  const router = useRouter();
  const [distance, setDistance] = useState<"500m" | "1km" | "2km" | "4km">(
    "500m"
  );

  const { category } = Route.useParams();
  console.log("선택된 카테고리:", category);

  // API 호출을 위한 훅 사용
  const {
    data: cafes,
    loading,
    error,
    refetch,
  } = useMapSearch({
    category,
    distance,
    enabled: true,
  });

  const title = CATEGORY_TITLE_MAP[category] || "관광지";

  // 거리 변경 시 데이터 다시 가져오기
  const handleDistanceChange = (
    newDistance: "500m" | "1km" | "2km" | "4km"
  ) => {
    setDistance(newDistance);
    // useMapSearch 훅이 distance 변경을 감지하여 자동으로 refetch
  };

  return (
    <CafeListTemplate
      title={title}
      onBack={() => router.history.back()}
      distanceLabel={distance}
      onDistanceClick={handleDistanceChange}
      cafes={cafes}
      loading={loading}
      error={error}
      onCafeClick={(id) => console.log("카페 클릭:", id)}
      onRetry={refetch}
    />
  );
}
