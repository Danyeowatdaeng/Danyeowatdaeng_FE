import { useState } from "react";
import { Star, MapPin, Bell } from "lucide-react";
import { isPartnerPlace } from "../../utils/partnerPlaces";
import { addWishlistAtMap, deleteWishlist } from "../../api";

interface SearchResultCardProps {
  id: number;
  name: string;
  category: string;
  status: "영업 중" | "영업 전" | "영업 종료";
  rating: number;
  reviewCount: number;
  address: string;
  distance: string;
  imageUrl?: string;
  latitude?: number;
  longitude?: number;
  roadAddress?: string;
  jibunAddress?: string;
  homepage?: string;
  closedDays?: string;
  openingHours?: string;
  phone?: string;
  source?: string;
  contentTypeId?: number;
  onWishlist?: () => void;
  onReservation?: () => void;
  onLocationClick?: (lat: number, lng: number) => void;
}

export default function SearchResultCard({
  name,
  category,
  status,
  rating,
  reviewCount,
  address,
  distance,
  latitude,
  longitude,
  roadAddress,
  jibunAddress,
  homepage,
  closedDays,
  openingHours,
  phone,
  source,
  contentTypeId,
  onWishlist,
  onReservation,
  onLocationClick,
}: SearchResultCardProps) {
  const isPartner = isPartnerPlace(name);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [savedContentId, setSavedContentId] = useState<number | null>(null); // 저장된 contentId
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star
          key="half"
          className="w-4 h-4 fill-yellow-400/50 text-yellow-400"
        />
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
    }

    return stars;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "영업 중":
        return "text-gray-800";
      case "영업 전":
        return "text-gray-400";
      case "영업 종료":
        return "text-gray-400";
      default:
        return "text-gray-400";
    }
  };

  const handleCardClick = () => {
    if (latitude && longitude && onLocationClick) {
      onLocationClick(latitude, longitude);
    }
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleWishlistClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (loading) return;

    console.log("=== 찜하기 클릭 ===");
    console.log("현재 상태:", { isWishlisted, savedContentId, name });

    setLoading(true);

    try {
      if (isWishlisted) {
        // 찜하기 삭제 - 저장된 contentId 사용
        if (!savedContentId) {
          alert("삭제할 수 없습니다. contentId가 없습니다.");
          setLoading(false);
          return;
        }

        console.log("삭제 요청:", savedContentId);
        await deleteWishlist(savedContentId);
        setIsWishlisted(false);
        setSavedContentId(null);
        console.log("✅ 찜하기 삭제 완료");
      } else {
        // 찜하기 추가
        const requestData = {
          name,
          category3: category,
          roadAddress: roadAddress || address,
          jibunAddress: jibunAddress || address,
          homepage: homepage || "",
          closedDays: closedDays || "",
          openingHours: openingHours || "",
          latitude: latitude || 0,
          longitude: longitude || 0,
          phone: phone || "",
          source: source || "TOUR_API",
          contentTypeId: contentTypeId || 0,
        };

        console.log("추가 요청 데이터:", requestData);

        const response = await addWishlistAtMap(requestData);

        console.log("추가 응답:", response);

        if (response.isSuccess && response.data?.contentId) {
          setIsWishlisted(true);
          setSavedContentId(response.data.contentId);
          console.log(
            "✅ 찜하기 추가 완료, contentId:",
            response.data.contentId
          );
          onWishlist?.();
        } else {
          console.warn("⚠️ 응답은 왔지만 성공하지 못함:", response);
          alert("찜하기 추가에 실패했습니다.");
        }
      }
    } catch (error) {
      console.error("❌ 찜하기 오류:", error);

      // 상세 에러 정보
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { status?: number; data?: unknown };
        };
        console.error("HTTP 상태:", axiosError.response?.status);
        console.error("에러 응답:", axiosError.response?.data);
      }

      alert("찜하기 처리에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="p-4 bg-white border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={handleCardClick}
    >
      {/* 내용 */}
      <div className="w-full">
        {/* 제목과 카테고리 */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-800 truncate">{name}</h3>
            <span className="text-sm text-gray-500">{category}</span>
          </div>
          <span className={`text-sm ${getStatusColor(status)}`}>{status}</span>
        </div>

        {/* 평점 */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center gap-1">{renderStars(rating)}</div>
          <span className="text-sm text-gray-600">
            {rating} ({reviewCount})
          </span>
        </div>

        {/* 주소와 거리 */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600 truncate">{address}</span>
          </div>
          <span className="text-sm text-gray-500">{distance}</span>
        </div>

        {/* 버튼들 */}
        <div className="flex gap-2">
          {onReservation && (
            <button
              onClick={(e) => {
                handleButtonClick(e);
                onReservation?.();
              }}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                isPartner
                  ? "bg-orange-100 text-orange-700 hover:bg-orange-200"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Bell className="w-4 h-4" />
              {isPartner ? "제휴 예약하기" : "예약하기"}
            </button>
          )}
          <button
            onClick={handleWishlistClick}
            disabled={loading}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-colors ${
              loading
                ? "opacity-50 cursor-not-allowed"
                : isWishlisted
                  ? "bg-teal-500 text-white border border-teal-500 hover:bg-teal-600"
                  : "bg-white border border-teal-400 text-teal-500 hover:bg-teal-50"
            }`}
          >
            <Star
              className={`w-4 h-4 ${isWishlisted ? "fill-white" : "fill-current"}`}
            />
            {loading ? "처리중..." : isWishlisted ? "찜완료" : "찜하기"}
          </button>
        </div>
      </div>
    </div>
  );
}
