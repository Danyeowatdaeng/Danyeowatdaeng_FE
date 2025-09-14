import { useEffect, useState } from "react";
import type { SearchResult } from "../../store/searchResultStore";
import { MapPinCheckInside } from "lucide-react";
import CartButton from "./CartButton";
import FlagIcon from "../atoms/Icon/FlagIcon";
import StarIcon from "../atoms/Icon/StarIcon";

interface KakaoPlace {
  place_name: string;
  address_name: string;
  road_address_name: string;
  category_name: string;
  phone: string;
  place_url: string;
  distance: string;
}

type PlacePreviewProps = {
  position: {
    lat: number;
    lng: number;
  };
  placeInfo: SearchResult | null;
  onReviewClick: () => void;
};

export default function PlacePreview({
  position,
  placeInfo,
  onReviewClick,
}: PlacePreviewProps) {
  const [kakaoPlaceInfo, setKakaoPlaceInfo] = useState<KakaoPlace | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const searchPlace = async () => {
      if (!window.kakao || !position) return;

      setIsLoading(true);

      try {
        if (!placeInfo?.title) {
          setKakaoPlaceInfo(null);
          return;
        }

        const places = new window.kakao.maps.services.Places();
        const result = await new Promise<KakaoPlace[]>((resolve) => {
          places.keywordSearch(
            placeInfo.title,
            (data, status) => {
              if (status === window.kakao.maps.services.Status.OK) {
                resolve(data);
              } else {
                resolve([]);
              }
            },
            {
              location: new window.kakao.maps.LatLng(
                position.lat,
                position.lng
              ),
              radius: 1000, // 1km 반경 내에서 검색
              sort: window.kakao.maps.services.SortBy.DISTANCE,
            }
          );
        });

        if (result.length > 0) {
          console.log("검색된 장소:", result[0]);
          setKakaoPlaceInfo(result[0]);
        } else {
          setKakaoPlaceInfo(null);
        }
      } catch (error) {
        console.error("장소 검색 중 오류 발생:", error);
        setKakaoPlaceInfo(null);
      } finally {
        setIsLoading(false);
      }
    };

    searchPlace();
  }, [position, placeInfo?.title]);

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded-2xl w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded-2xl w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded-2xl w-2/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 space-y-4">
      {placeInfo ? (
        <>
          <div>
            <div className="w-full overflow-x-scroll flex">
              <img
                src={placeInfo.imageUrl1}
                alt={placeInfo.title}
                onClick={() => {
                  window.open(kakaoPlaceInfo?.place_url, "_blank");
                }}
                className="w-full h-[160px] object-cover mr-2 rounded-lg"
              />
            </div>
            <div className="flex mt-4 mb-2 items-center">
              <div className="w-fit text-xl font-bold text-[16px]">
                {placeInfo.title}
              </div>
              {kakaoPlaceInfo && (
                <span className=" text-[#797979] text-[12px] ml-2">
                  {kakaoPlaceInfo.category_name}
                </span>
              )}
            </div>
            {/* 별점 area */}
            <div className="flex mb-2 items-center">
              <div className="text-[13px] mr-1 text-[#FF8A2B]">0.0</div>
              <StarIcon width={13} height={13} />
              <StarIcon width={13} height={13} />
              <StarIcon width={13} height={13} />
              <StarIcon width={13} height={13} />
              <StarIcon width={13} height={13} />
              <div className="text-[#797979] ml-1">(0)</div>
            </div>
            {kakaoPlaceInfo && (
              <div className="flex justify-between items-center">
                <p className="text-[13px] text-black flex items-center gap-1 text-sm">
                  <MapPinCheckInside size={16} color="#797979" />
                  {kakaoPlaceInfo.road_address_name ||
                    kakaoPlaceInfo.address_name}
                </p>
                <span className="text-[#797979] text-[12px]">
                  {kakaoPlaceInfo.distance}Km
                </span>
              </div>
            )}
            <div className="transition-colors pt-3 pb-5 duration-300 border-b-1 border-[#D9D9D9] w-full flex justify-end">
              <CartButton />
            </div>
          </div>

          <div className="flex space-x-2">
            {kakaoPlaceInfo && (
              <div>
                <div className="flex items-center gap-2 text-[#444444]">
                  <FlagIcon />
                  장소 정보
                </div>
                <div>
                  {placeInfo.description && (
                    <p className="text-sm text-gray-600">
                      {placeInfo.description}
                    </p>
                  )}
                </div>
              </div>
            )}
            <button
              onClick={onReviewClick}
              className="flex-1 bg-primary text-white py-2 px-4 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              리뷰 작성하기
            </button>
          </div>
        </>
      ) : (
        <div className="text-center text-gray-600">
          <p>이 위치의 정보를 찾을 수 없습니다</p>
          <button
            onClick={onReviewClick}
            className="mt-4 w-full bg-primary text-white py-3 rounded-lg"
          >
            새로운 장소 등록하기
          </button>
        </div>
      )}
    </div>
  );
}
