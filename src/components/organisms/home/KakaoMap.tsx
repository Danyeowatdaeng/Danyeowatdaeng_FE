import { useState, useEffect } from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import BottomSheet from "../../atoms/BottomSheet";
import PlacePreview from "../../molecules/PlacePreview";

type KakaoMapProps = {
  expanded: boolean;
};

export default function KakaoMap({ expanded }: KakaoMapProps) {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_MAP_JS_KEY}&libraries=services,clusterer&autoload=false`;
    script.async = true;

    script.onload = () => {
      window.kakao.maps.load(() => {
        console.log("Kakao Maps loaded");
      });
    };

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  // 지도의 크기가 변경될 때 지도를 다시 렌더링하기 위한 상태
  const [shouldRerender, setShouldRerender] = useState(false);
  // 현재 위치 상태
  const [position, setPosition] = useState<{ lat: number; lng: number }>({
    lat: 33.450701,
    lng: 126.570667,
  });
  // 바텀시트 상태
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
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (error) => {
          console.error("현재 위치를 가져올 수 없습니다:", error);
        }
      );
    }
  }, []);

  return (
    <>
      <Map
        key={shouldRerender ? "rerender" : "initial"}
        center={position}
        className={`w-full h-full min-h-56`}
        level={3}
      >
        <MapMarker
          position={position}
          onClick={() => setIsBottomSheetOpen(true)}
        />
      </Map>

      <BottomSheet open={isBottomSheetOpen} onOpenChange={setIsBottomSheetOpen}>
        <PlacePreview
          position={position}
          onReviewClick={() => {
            // TODO: 리뷰 페이지로 이동하는 로직 추가
          }}
        />
      </BottomSheet>
    </>
  );
}
