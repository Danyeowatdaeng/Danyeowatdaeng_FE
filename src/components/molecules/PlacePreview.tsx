import { useEffect, useState } from "react";
import type { SearchResult } from "../../store/searchResultStore";
import { MapPinCheckInside } from "lucide-react";
import CartButton from "./CartButton";
import FlagIcon from "../atoms/Icon/FlagIcon";
import StarIcon from "../atoms/Icon/StarIcon";
import { Loader } from "@googlemaps/js-api-loader";

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
  const [urls, setUrls] = useState<string[]>([]);
  const [description, setDescription] = useState<string>("");
  const maxWidth = 400;

  useEffect(() => {
    const run = async () => {
      const loader = new Loader({
        apiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY as string,
        libraries: ["places"],
      });
      const google = await loader.load();

      const service = new google.maps.places.PlacesService(
        document.createElement("div")
      );
      const nearbyReq = {
        keyword: placeInfo?.name,
        location: new google.maps.LatLng(
          placeInfo?.latitude as number,
          placeInfo?.longitude as number
        ),
        radius: 10,
      };
      service.nearbySearch(nearbyReq, (results, status) => {
        if (
          status !== google.maps.places.PlacesServiceStatus.OK ||
          !results?.length
        ) {
          setUrls([]);
          return;
        }
        const placeId = results[0].place_id;
        if (!placeId) {
          setUrls([]);
          return;
        }
        const detailReq = { placeId, fields: ["photos", "reviews"] };
        service.getDetails(detailReq, (place, dStatus) => {
          if (
            dStatus === google.maps.places.PlacesServiceStatus.OK &&
            place?.photos?.length
          ) {
            const photoUrls = place.photos.map((photo) =>
              photo.getUrl({
                maxWidth,
                maxHeight: Math.round(maxWidth * 0.75),
              })
            );
            setUrls(photoUrls);
            // 리뷰 설명 저장
            if (place.reviews && place.reviews.length > 0) {
              setDescription(place.reviews[0].text);
            } else {
              setDescription("");
            }
          } else {
            setUrls([]);
            setDescription("");
          }
        });
      });
    };
    run();
  }, [placeInfo?.latitude, placeInfo?.longitude, placeInfo?.name]);

  useEffect(() => {
    const searchPlace = async () => {
      if (!window.kakao || !position) return;

      setIsLoading(true);

      try {
        if (!placeInfo?.name) {
          setKakaoPlaceInfo(null);
          return;
        }

        const places = new window.kakao.maps.services.Places();
        const result = await new Promise<KakaoPlace[]>((resolve) => {
          places.keywordSearch(
            placeInfo.name,
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
              radius: 10,
              sort: window.kakao.maps.services.SortBy.DISTANCE,
            }
          );
        });

        if (result.length > 0) {
          setKakaoPlaceInfo(result[0]);
          console.log("카카오 장소 정보:", result[0]);
        } else {
          console.log("카카오 장소 정보 없음");
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
  }, [position, placeInfo?.name]);

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
            <div className="w-full overflow-x-auto flex gap-2">
              {urls.map((imgUrl) => (
                <img
                  key={imgUrl}
                  src={imgUrl}
                  alt={placeInfo.name}
                  onClick={() => {
                    window.open(placeInfo?.homepage, "_blank");
                  }}
                  className="h-[160px] object-cover rounded-lg"
                  style={{ minWidth: "100%", maxWidth: "100%" }}
                />
              ))}
            </div>
            <div className="flex mt-4 mb-2 items-center">
              <div className="w-fit text-xl font-bold text-[16px]">
                {placeInfo.name}
              </div>
              <span className=" text-[#797979] text-[12px] ml-2">
                {placeInfo.category3}
              </span>
            </div>
            <div className="text-[#797979] text-[12px] mb-1">
              {placeInfo.openingHours}
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
                  {description && (
                    <p className="text-sm text-gray-600">{description}</p>
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
