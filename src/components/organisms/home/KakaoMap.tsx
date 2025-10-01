import { useState, useEffect, useMemo } from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import BottomSheet from "../../atoms/BottomSheet";
import PlacePreview from "../../molecules/PlacePreview";
import { useSearchResultStore } from "../../../store/searchResultStore";
import type { SearchResult } from "../../../store/searchResultStore";
import { useRouter } from "@tanstack/react-router";

type KakaoMapProps = {
  expanded: boolean;
};

export default function KakaoMap({ expanded }: KakaoMapProps) {
  // 지도의 크기가 변경될 때 지도를 다시 렌더링하기 위한 상태
  const { searchResults } = useSearchResultStore();

  const router = useRouter();

  // 검색 결과의 위치 정보만 추출
  type Location = { lat: number; lng: number };
  const locations = useMemo(
    () =>
      searchResults?.map(
        (result): Location => ({
          lat: result.latitude,
          lng: result.longitude,
        })
      ) || [],
    [searchResults]
  );

  const [shouldRerender, setShouldRerender] = useState(false);
  const [current, setCurrent] = useState<{ lat: number; lng: number }>({
    lat: 33.450701,
    lng: 126.570667,
  });
  const [selectedPlace, setSelectedPlace] = useState(current);
  const [placeInfo, setPlaceInfo] = useState<SearchResult | null>(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  // expanded 변경 시 지도 리렌더링
  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldRerender((prev) => !prev);
    }, 1200);
    return () => clearTimeout(timer);
  }, [expanded]);

  // 컴포넌트 마운트 시 현재 위치 가져오기
  useEffect(() => {
    console.log("KakaoMap 컴포넌트 마운트됨");
    console.log("navigator.geolocation 사용 가능:", !!navigator.geolocation);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCurrent({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });

          console.log("현재 위치:", pos.coords.latitude, pos.coords.longitude);
        },
        (error) => {
          console.error("현재 위치를 가져올 수 없습니다:", error);
        }
      );
    } else {
      console.error("navigator.geolocation을 사용할 수 없습니다.");
    }
  }, []);

  useEffect(() => {
    if (locations.length > 0) {
      setCurrent(locations[0]);
    }
  }, [locations]);

  return (
    <div className="relative w-full h-full">
      <Map
        key={shouldRerender ? "rerender" : "initial"}
        center={current}
        className={`w-full h-full min-h-56`}
        level={3}
      >
        {locations.length > 0 &&
          locations.map((loc, index) => (
            <MapMarker
              key={index}
              position={loc}
              onClick={() => {
                setIsBottomSheetOpen(true);
                setSelectedPlace(loc);
                setPlaceInfo(searchResults[index]);
              }}
            />
          ))}
      </Map>
      <BottomSheet open={isBottomSheetOpen} onOpenChange={setIsBottomSheetOpen}>
        <PlacePreview
          position={selectedPlace}
          placeInfo={placeInfo}
          onReviewClick={() => {
            if (!placeInfo) return;

            router.navigate({
              to: "/place/$placeId/review",
              params: { placeId: String(placeInfo.id) },
              search: { name: placeInfo.name },
            });
          }}
        />
      </BottomSheet>
    </div>
  );
}
