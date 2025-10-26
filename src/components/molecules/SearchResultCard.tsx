import { Star, MapPin, Bell } from "lucide-react";
import { isPartnerPlace } from "../../utils/partnerPlaces";

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
  onWishlist?: () => void;
  onReservation?: () => void;
  onLocationClick?: (lat: number, lng: number) => void;
}

export default function SearchResultCard({
  id: _id,
  name,
  category,
  status,
  rating,
  reviewCount,
  address,
  distance,
  imageUrl: _imageUrl,
  latitude,
  longitude,
  onWishlist,
  onReservation,
  onLocationClick,
}: SearchResultCardProps) {
  const isPartner = isPartnerPlace(name);
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
        <Star key="half" className="w-4 h-4 fill-yellow-400/50 text-yellow-400" />
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
      );
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
          <div className="flex items-center gap-1">
            {renderStars(rating)}
          </div>
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
                  ? 'bg-orange-100 text-orange-700 hover:bg-orange-200' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Bell className="w-4 h-4" />
              {isPartner ? '제휴 예약하기' : '예약하기'}
            </button>
          )}
          <button
            onClick={(e) => {
              handleButtonClick(e);
              onWishlist?.();
            }}
            className="flex items-center gap-1 px-3 py-1.5 bg-white border border-teal-400 text-teal-500 rounded-lg text-sm hover:bg-teal-50 transition-colors"
          >
            <Star className="w-4 h-4 fill-current" />
            찜하기
          </button>
        </div>
      </div>
    </div>
  );
}
