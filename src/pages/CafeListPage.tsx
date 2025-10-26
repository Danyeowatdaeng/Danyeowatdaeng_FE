import { useState } from "react";
import CafeListTemplate from "../components/templates/CafeListTemplate";
import { useRouter } from "@tanstack/react-router";
import { Route } from "../routes/landing/category/$category";
import { useMapSearch } from "../hooks/useMapSearch";
import { CATEGORY_TITLE_MAP, CATEGORY_MAPPING } from "../utils/categoryMapping";
import BottomSheet from "../components/atoms/BottomSheet";
import PlacePreview from "../components/molecules/PlacePreview";
import type { SearchResult } from "../store/searchResultStore";
import type { CafeCardData } from "../components/molecules/category/CafeCard";

export default function CafeListPage() {
  const router = useRouter();
  const [distance, setDistance] = useState<"500m" | "1km" | "2km" | "4km">(
    "500m"
  );
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<CafeCardData | null>(null);

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
  };

  // 카페 카드 클릭 시 상세 BottomSheet 열기
  const handleCafeClick = (id: string | number) => {
    const place = cafes.find((c) => c.id === id);
    if (place) {
      setSelectedPlace(place);
      setBottomSheetOpen(true);
    }
    console.log("카페 클릭:", place);
  };

  // CafeCardData를 SearchResult로 변환
  const convertToSearchResult = (place: CafeCardData): SearchResult => ({
    id: typeof place.id === "string" ? parseInt(place.id) : place.id,
    contentId: typeof place.id === "string" ? parseInt(place.id) : place.id,
    contentTypeId: CATEGORY_MAPPING[category],
    name: place.title as "string",
    category3: title as "string",
    roadAddress: place.address as "string",
    jibunAddress: place.address as "string",
    homepage: "" as "string",
    closedDays: "" as "string",
    openingHours: "" as "string",
    latitude: place.latitude,
    longitude: place.longitude,
    imageUrl: place.image as "string",
    phone: place.phone as "string",
    source: place.source as "string",
  });

  return (
    <>
      <CafeListTemplate
        title={title}
        onBack={() => router.history.back()}
        distanceLabel={distance}
        onDistanceClick={handleDistanceChange}
        cafes={cafes}
        loading={loading}
        error={error}
        onCafeClick={handleCafeClick}
        onRetry={refetch}
      />

      {/* 장소 상세 BottomSheet */}
      <BottomSheet
        open={bottomSheetOpen}
        onOpenChange={setBottomSheetOpen}
        title=""
      >
        {selectedPlace && (
          <PlacePreview
            position={{
              lat: selectedPlace.latitude,
              lng: selectedPlace.longitude,
            }}
            placeInfo={convertToSearchResult(selectedPlace)}
            onReviewClick={() => console.log("리뷰 작성")}
          />
        )}
      </BottomSheet>
    </>
  );
}
