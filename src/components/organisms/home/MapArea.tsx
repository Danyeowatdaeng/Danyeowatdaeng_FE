// organisms/home/MapArea.tsx
import { memo, useState } from "react";
import SearchBar from "../../molecules/SearchBar";
import KakaoMap from "./KakaoMap";
import BottomSheet from "../../atoms/BottomSheet";
import SearchResultCard from "../../molecules/SearchResultCard";
import {
  useSearchResultStore,
  type SearchResult,
} from "../../../store/searchResultStore";
import { useRouter } from "@tanstack/react-router";
import {
  isPartnerPlace,
  getPlaceIdFromName,
} from "../../../utils/partnerPlaces";

type MapAreaProps = {
  expanded: boolean;
  onTap: () => void;
  onBackdropTap: () => void;
};

interface MapCenter {
  lat: number;
  lng: number;
}

function MapArea({ expanded, onTap, onBackdropTap }: MapAreaProps) {
  const router = useRouter();
  const [searchResultOpen, setSearchResultOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<MapCenter | null>(
    null
  );
  const { searchResults } = useSearchResultStore();
  console.log(searchResults);

  const handleSearchComplete = () => {
    setSearchResultOpen(true);
  };

  const handleLocationClick = (lat: number, lng: number) => {
    // 지도를 해당 위치로 이동 - 정중앙으로
    console.log("위치로 이동 (중앙):", lat, lng);
    setSelectedLocation({
      lat,
      lng,
    });
    // 지도가 확장되지 않았다면 확장
    if (!expanded) {
      onTap();
    }
  };

  const handleReservation = (result: SearchResult) => {
    if (isPartnerPlace(result.name)) {
      // 제휴 장소인 경우 내부 예약 페이지로 이동
      const placeId = getPlaceIdFromName(result.name);
      if (placeId) {
        router.navigate({
          to: "/reservation/$placeId",
          params: { placeId },
        });
      }
    } else {
      // 일반 장소인 경우 외부 링크로 이동 (기존 로직)
      console.log("예약하기:", result.id);
    }
  };

  return (
    <div
      className={`
        relative w-full 
        transition-[height,margin] duration-1200 ease-in-out
        ${expanded ? "h-screen mb-0" : "h-56 mb-14"}
      `}
      onClick={expanded ? undefined : onTap}
    >
      {/* 실제 지도 SDK 붙이는 자리 */}
      <KakaoMap expanded={expanded} center={selectedLocation} />

      {/* 검색바 */}
      <div
        className={`
          z-10 w-full px-5 transition-all duration-1200 ease-in-out
          ${expanded ? "absolute -translate-y-[95vh]" : "absolute -translate-y-1/2"}
        `}
      >
        <SearchBar onFocus={onTap} onSearchComplete={handleSearchComplete} />
      </div>
      {expanded && (
        <>
          <button
            aria-label="닫기"
            onClick={onBackdropTap}
            className="absolute top-4 left-4 rounded-full bg-white/80 px-3 py-1"
          >
            닫기
          </button>
        </>
      )}

      {/* 검색 결과 바텀시트 */}
      <BottomSheet
        open={searchResultOpen}
        onOpenChange={setSearchResultOpen}
        title="검색 결과"
      >
        {searchResults.length > 0 ? (
          <>
            {/* 총 검색 건수 */}
            <div className="px-4 pb-3 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  총{" "}
                  <span className="font-semibold text-gray-800">
                    {searchResults.length}
                  </span>
                  건
                </span>
              </div>
            </div>

            {/* 검색 결과 리스트 */}
            <div className="space-y-0">
              {searchResults.map((result) => (
                <SearchResultCard
                  key={result.id}
                  id={result.id}
                  name={result.name}
                  category={result.category3}
                  status={result.status || "영업 중"}
                  rating={result.rating || 0}
                  reviewCount={result.reviewCount || 0}
                  address={result.roadAddress || result.jibunAddress}
                  distance={result.distance || ""}
                  imageUrl={result.imageUrl}
                  latitude={result.latitude}
                  longitude={result.longitude}
                  onLocationClick={handleLocationClick}
                  onWishlist={() => console.log("찜하기:", result.id)}
                  onReservation={() => handleReservation(result)}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="px-4 py-8 text-center text-gray-500">
            검색 결과가 없습니다
          </div>
        )}
      </BottomSheet>
    </div>
  );
}

export default memo(MapArea);
