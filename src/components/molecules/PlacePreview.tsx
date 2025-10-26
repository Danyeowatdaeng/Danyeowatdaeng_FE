// src/components/molecules/PlacePreview.tsx
import { useEffect, useState } from "react";
import type { SearchResult } from "../../store/searchResultStore";
import { MapPinCheckInside, MessageSquare, Bell } from "lucide-react";
import CartButton from "./CartButton";
import FlagIcon from "../atoms/Icon/FlagIcon";
import StarIcon from "../atoms/Icon/StarIcon";
import { Loader } from "@googlemaps/js-api-loader";
import { fetchReviewsByContentId, type Review } from "../../api/review";
import { getWishlist } from "../../api/index";

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
  position: { lat: number; lng: number };
  placeInfo: SearchResult | null;
  onReviewClick: () => void;
};

type ReviewLite = {
  id: number;
  rating: number;
  content: string;
  createdAt: string;
  imagesJson?: string;
};

export default function PlacePreview({
  position,
  placeInfo,
  onReviewClick,
}: PlacePreviewProps) {
  const [kakaoPlaceInfo, setKakaoPlaceInfo] = useState<KakaoPlace | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Google Places 사진/설명
  const [urls, setUrls] = useState<string[]>([
    (placeInfo?.imageUrl as string) || "",
  ]);
  const [description, setDescription] = useState<string>("");

  // 리뷰 미리보기
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviews, setReviews] = useState<ReviewLite[]>([]);
  const [reviewError, setReviewError] = useState<string | null>(null);

  // 찜하기 상태
  const [isWishlisted, setIsWishlisted] = useState(false);

  const maxWidth = 400;

  /** Google Places: 사진 & 대표 리뷰 설명 */
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

      const nearbyReq: google.maps.places.PlaceSearchRequest = {
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
          setDescription("");
          return;
        }

        const placeId = results[0].place_id;
        if (!placeId) {
          setUrls([]);
          setDescription("");
          return;
        }

        const detailReq: google.maps.places.PlaceDetailsRequest = {
          placeId,
          // readonly 배열 타입 캐스팅
          fields: ["photos", "reviews"] as unknown as Array<
            keyof google.maps.places.PlaceResult
          >,
        };

        service.getDetails(detailReq, (place, dStatus) => {
          if (
            dStatus === google.maps.places.PlacesServiceStatus.OK &&
            place?.photos?.length
          ) {
            const photoUrls = place.photos.map((photo) =>
              photo.getUrl({ maxWidth, maxHeight: Math.round(maxWidth * 0.75) })
            );
            setUrls(photoUrls);
            setDescription(place.reviews?.[0]?.text ?? "");
          } else {
            setUrls([]);
            setDescription("");
          }
        });
      });
    };
    run();
  }, [placeInfo?.latitude, placeInfo?.longitude, placeInfo?.name]);

  /** Kakao: 주소/거리 */
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
              if (status === window.kakao.maps.services.Status.OK)
                resolve(data);
              else resolve([]);
            },
            {
              location: new window.kakao.maps.LatLng(
                placeInfo.latitude || position.lat,
                placeInfo.longitude || position.lng
              ),
              radius: 100,
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
        console.error("장소 검색 오류:", error);
        setKakaoPlaceInfo(null);
      } finally {
        setIsLoading(false);
      }
    };
    searchPlace();
  }, [position, placeInfo?.name]);

  /** 리뷰 미리보기: contentId 기준 최신 목록 */
  useEffect(() => {
    const cid = placeInfo?.contentId;
    if (!cid) {
      setReviews([]);
      setReviewError(null);
      return;
    }

    const load = async () => {
      try {
        setReviewLoading(true);
        setReviewError(null);

        const page = 0;
        const size = 3;
        const res = await fetchReviewsByContentId({
          contentId: cid,
          page,
          size,
        });

        const items: ReviewLite[] = (res?.content ?? []).map((r: Review) => ({
          id: r.id,
          rating: r.rating,
          content: r.content,
          createdAt: r.createdAt,
          imagesJson: r.imagesJson,
        }));

        setReviews(items);
      } catch (e) {
        console.error("리뷰 목록 조회 실패:", e);
        setReviewError("리뷰를 불러오지 못했어요.");
        setReviews([]);
      } finally {
        setReviewLoading(false);
      }
    };

    load();
  }, [placeInfo]);

  /** 찜하기 상태 확인 */
  useEffect(() => {
    const checkWishlist = async () => {
      if (!placeInfo?.contentId && !placeInfo?.id) return;

      try {
        const response = await getWishlist({ page: 0, size: 100 });

        if (response.isSuccess && response.data) {
          // 현재 장소가 찜 목록에 있는지 확인
          const placeId = placeInfo.contentId || placeInfo.id;
          const isInWishlist = response.data.content.some(
            (item) => item.placeId === placeId
          );
          setIsWishlisted(isInWishlist);
        }
      } catch (error) {
        console.error("찜하기 목록 조회 실패:", error);
      }
    };

    checkWishlist();
  }, [placeInfo?.contentId, placeInfo?.id]);

  // ✅ 예약 버튼 클릭 핸들러
  const reserveUrl = kakaoPlaceInfo?.place_url || placeInfo?.homepage || "";
  const onReserve = () => {
    if (reserveUrl) {
      window.open(reserveUrl, "_blank");
    } else {
      alert("예약 페이지가 아직 준비되지 않았어요.");
    }
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded-2xl w-3/4" />
          <div className="h-4 bg-gray-200 rounded-2xl w-1/2" />
          <div className="h-4 bg-gray-200 rounded-2xl w-2/3" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 space-y-4">
      {placeInfo ? (
        <>
          {/* 사진 영역 */}
          <div>
            <div className="w-full overflow-x-auto flex gap-2">
              {placeInfo.imageUrl ? (
                <img
                  src={placeInfo.imageUrl}
                  alt={placeInfo.name}
                  onClick={() => window.open(placeInfo?.homepage, "_blank")}
                  className="h-[160px] object-cover rounded-lg"
                  style={{ minWidth: "100%", maxWidth: "100%" }}
                />
              ) : urls.length > 0 ? (
                urls.map((imgUrl) => (
                  <img
                    key={imgUrl}
                    src={imgUrl}
                    alt={placeInfo.name}
                    onClick={() => window.open(placeInfo?.homepage, "_blank")}
                    className="h-[160px] object-cover rounded-lg"
                    style={{ minWidth: "100%", maxWidth: "100%" }}
                  />
                ))
              ) : null}
            </div>

            {/* 타이틀/카테고리 */}
            <div className="flex mt-4 mb-2 items-center">
              <div className="w-fit text-xl font-bold text-[16px]">
                {placeInfo.name}
              </div>
              <span className="text-[#797979] text-[12px] ml-2">
                {placeInfo.category3}
              </span>
            </div>

            {/* 영업시간 */}
            <div className="text-[#797979] text-[12px] mb-1">
              {placeInfo.openingHours}
            </div>

            {/* 별점 (placeholder) */}
            <div className="flex mb-2 items-center">
              <div className="text-[13px] mr-1 text-[#FF8A2B]">0.0</div>
              <StarIcon width={13} height={13} />
              <StarIcon width={13} height={13} />
              <StarIcon width={13} height={13} />
              <StarIcon width={13} height={13} />
              <StarIcon width={13} height={13} />
              <div className="text-[#797979] ml-1 text-[13px]">(0)</div>
            </div>

            {/* 주소/거리 */}
            {kakaoPlaceInfo && (
              <div className="flex justify-between items-center">
                <p className="text-[13px] text-black flex items-center gap-1 text-sm">
                  <MapPinCheckInside size={16} color="#797979" />
                  {kakaoPlaceInfo.road_address_name ||
                    kakaoPlaceInfo.address_name}
                </p>
                <span className="text-[#797979] text-[12px]">
                  {parseInt(kakaoPlaceInfo.distance) >= 1000
                    ? `${(parseInt(kakaoPlaceInfo.distance) / 1000).toFixed(1)}km`
                    : `${kakaoPlaceInfo.distance}m`}
                </span>
              </div>
            )}

            {/* ✅ 구분선 + 예약/찜 버튼 */}
            <div className="transition-colors pt-3 pb-5 duration-300 border-b border-[#D9D9D9] w-full flex items-center justify-between">
              {/* 예약하기 */}
              <button
                type="button"
                onClick={onReserve}
                className={[
                  "h-10 px-4 rounded-full border border-[#D9D9D9] bg-white",
                  "text-[#111] text-[14px] font-medium shadow-sm",
                  "flex items-center gap-2 active:scale-[.99]",
                ].join(" ")}
              >
                <span className="grid place-items-center w-6 h-6 rounded-full bg-[#F3F4F6]">
                  <Bell className="w-3.5 h-3.5 text-[#6B7280]" />
                </span>
                예약하기
              </button>

              {/* 찜하기 */}
              <CartButton
                placeId={placeInfo.contentId || placeInfo.id}
                contentTypeId={placeInfo.contentTypeId}
                title={placeInfo.name}
                address={placeInfo.roadAddress || placeInfo.jibunAddress}
                imageUrl={placeInfo.imageUrl}
                latitude={placeInfo.latitude}
                longitude={placeInfo.longitude}
                initialAdded={isWishlisted}
              />
            </div>
          </div>

          {/* 장소 정보 */}
          <div className="flex space-x-2">
            {kakaoPlaceInfo && (
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-[#444444]">
                  <FlagIcon />
                  <span className="font-medium">장소 정보</span>
                </div>
                {description && (
                  <p className="mt-1 text-sm text-gray-600 break-words">
                    {description}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* 리뷰 섹션 */}
          <section className="pt-3 border-t border-[#EAEAEA]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#444444]">
                <MessageSquare className="w-4 h-4 text-[#444444]" />
                <span className="font-medium">리뷰</span>
              </div>

              <button
                onClick={onReviewClick}
                className="text-[13px] text-[#6B7280] hover:text-[#111] transition"
              >
                리뷰 남기기 &gt;
              </button>
            </div>

            <div className="mt-3">
              {reviewLoading && (
                <div className="text-sm text-gray-500">리뷰 불러오는 중…</div>
              )}
              {!reviewLoading && reviewError && (
                <div className="text-sm text-red-500">{reviewError}</div>
              )}
              {!reviewLoading && !reviewError && reviews.length === 0 && (
                <div className="text-sm text-gray-500">
                  아직 등록된 리뷰가 없어요.
                </div>
              )}

              <ul className="space-y-2">
                {reviews.map((r) => (
                  <li
                    key={r.id}
                    className="rounded-xl border border-[#EEE] p-3 text-sm text-gray-800"
                  >
                    <div className="mb-1 text-[12px] text-[#FF8A2B]">
                      {"★".repeat(
                        Math.max(0, Math.min(5, Math.round(r.rating)))
                      )}
                      {"☆".repeat(
                        5 - Math.max(0, Math.min(5, Math.round(r.rating)))
                      )}
                    </div>
                    <div className="line-clamp-2 break-words">{r.content}</div>
                    <div className="mt-1 text-[11px] text-gray-400">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>
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
