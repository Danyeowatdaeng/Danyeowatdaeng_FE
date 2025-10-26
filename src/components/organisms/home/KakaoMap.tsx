import { useState, useEffect, useMemo, useCallback } from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import BottomSheet from "../../atoms/BottomSheet";
import PlacePreview from "../../molecules/PlacePreview";
import { useSearchResultStore } from "../../../store/searchResultStore";
import type { SearchResult } from "../../../store/searchResultStore";
import { useRouter } from "@tanstack/react-router";
import { isPartnerPlace } from "../../../utils/partnerPlaces";

type KakaoMapProps = {
  expanded: boolean;
  center?: { lat: number; lng: number; originalLat?: number } | null;
};

export default function KakaoMap({ expanded, center }: KakaoMapProps) {
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
  const [selectedPlace, setSelectedPlace] = useState<{ lat: number; lng: number } | null>(null);
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
  // 현재 위치를 가져오는 함수
  const getCurrentPosition = useCallback((): Promise<{
    lat: number;
    lng: number;
  }> => {
    return new Promise((resolve) => {
      console.log("KakaoMap getCurrentPosition 함수 시작");

      if (!navigator.geolocation) {
        console.log("Geolocation이 지원되지 않음, 기본 위치 사용");
        resolve({
          lat: 37.5665, // 서울시청
          lng: 126.978,
        });
        return;
      }

      // 8초 타임아웃 설정
      const timeout = setTimeout(() => {
        console.log("위치 요청 타임아웃, 기본 위치 사용");
        resolve({
          lat: 37.5665, // 서울시청
          lng: 126.978,
        });
      }, 8000);

      console.log("Geolocation 요청 시작");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          clearTimeout(timeout);
          console.log("위치 정보 성공적으로 가져옴:", position.coords);
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          clearTimeout(timeout);
          console.warn(
            "위치 정보를 가져올 수 없습니다. 기본 위치를 사용합니다.",
            error
          );
          resolve({
            lat: 37.5665, // 서울시청
            lng: 126.978,
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  }, []);

  useEffect(() => {
    console.log("KakaoMap 컴포넌트 마운트됨");

    const fetchCurrentPosition = async () => {
      try {
        const position = await getCurrentPosition();
        setCurrent(position);
        console.log("현재 위치 설정됨:", position);
      } catch (error) {
        console.error("위치 가져오기 실패:", error);
      }
    };

    fetchCurrentPosition();
  }, [getCurrentPosition]);

  useEffect(() => {
    if (locations.length > 0) {
      setCurrent(locations[0]);
    }
  }, [locations]);

  // center prop이 변경되면 지도 중심 이동
  useEffect(() => {
    if (center) {
      setCurrent(center);
    }
  }, [center]);

  return (
    <div className="relative w-full h-full">
      <Map
        key={shouldRerender ? "rerender" : "initial"}
        center={current}
        className={`w-full h-full min-h-56`}
        level={3}
      >
        {locations.length > 0 &&
          locations.map((loc, index) => {
            const placeInfo = searchResults[index];
            const isPartner = placeInfo ? isPartnerPlace(placeInfo.name) : false;
            
            return (
              <MapMarker
                key={`location-${index}`}
                position={loc}
                image={{
                  src: isPartner ? '/Assets/icons/PawPrint.svg' : '/Assets/icons/Location.svg',
                  size: { width: 40, height: 40 },
                  options: {
                    offset: { x: 20, y: 20 }
                  }
                }}
                onClick={() => {
                  setIsBottomSheetOpen(true);
                  setSelectedPlace(loc);
                  setPlaceInfo(placeInfo);
                }}
              />
            );
          })}
        {/* center에 originalLat가 있으면 원본 위치에 추가 마커 표시 */}
        {center?.originalLat && (
          <MapMarker
            key="original-marker"
            position={{ lat: center.originalLat, lng: center.lng }}
            image={{
              src: '/Assets/icons/Location.svg',
              size: { width: 40, height: 40 },
              options: {
                offset: { x: 20, y: 20 }
              }
            }}
          />
        )}
      </Map>
      <BottomSheet open={isBottomSheetOpen} onOpenChange={setIsBottomSheetOpen}>
        {selectedPlace && (
          <PlacePreview
            position={selectedPlace}
            placeInfo={placeInfo}
            map={true}
            onReviewClick={() => {
              if (!placeInfo) return;

              router.navigate({
                to: "/place/$placeId/review",
                params: { placeId: String(placeInfo.id) },
                search: { name: placeInfo.name },
              });
            }}
          />
        )}
      </BottomSheet>
    </div>
  );
}
