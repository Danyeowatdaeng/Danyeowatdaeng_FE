import { useState } from "react";
import { useRouter, useParams } from "@tanstack/react-router";
import BackHeader from "../components/molecules/BackHeader";
import PrimaryButton from "../components/molecules/PrimaryButton";
import Label from "../components/atoms/Label";

export default function ReservationPage() {
  const router = useRouter();
  const { placeId } = useParams({ from: "/reservation/$placeId" });
  const [showCouponModal, setShowCouponModal] = useState(false);
  
  // 장소별 설정
  const getPlaceConfig = () => {
    switch(placeId) {
      case "nyang":
        return {
          title: "냐옹냐옹고양이까페",
          subtitle: "고양이 카페",
          imageSrc: "/Assets/images/nayeong.jpg",
          fields: [
            { label: "방문 날짜", name: "date", options: ["2024.07.15", "2024.07.16", "2024.07.17"] },
            { label: "인원", name: "people", options: ["1명", "2명", "3명", "4명"] },
            { label: "시간대", name: "time", options: ["10:00-12:00", "12:00-14:00", "14:00-16:00", "16:00-18:00"] }
          ]
        };
      case "hotel":
        return {
          title: "광주애견호텔유치원",
          subtitle: "펫 호텔",
          imageSrc: "/Assets/images/hotel.jpg",
          fields: [
            { label: "기간", name: "period", options: ["1박", "2박", "3박"] },
            { label: "객실 수", name: "rooms", options: ["1개", "2개", "3개"] },
            { label: "반려동물 수", name: "pets", options: ["1마리", "2마리", "3마리"] }
          ]
        };
      case "beauty":
        return {
          title: "24시 애견 미용",
          subtitle: "반려동물 미용",
          imageSrc: "/Assets/images/24.jpg",
          fields: [
            { label: "예약 날짜", name: "date", options: ["2024.07.15", "2024.07.16", "2024.07.17"] },
            { label: "시간", name: "time", options: ["10:00", "11:00", "14:00", "15:00"] },
            { label: "서비스", name: "service", options: ["기본 미용", "풀 코스", "짧게 깎기"] }
          ]
        };
      default:
        return {
          title: "제휴 업체",
          subtitle: "예약",
          imageSrc: "/Assets/images/placeholder.jpg",
          fields: []
        };
    }
  };

  const config = getPlaceConfig();
  
  // 예약 정보 상태
  const [reservationInfo, setReservationInfo] = useState<Record<string, string>>({});
  
  // 쿠폰 정보 상태
  const [selectedCoupon, setSelectedCoupon] = useState<{
    id: string;
    name: string;
    discount: number;
    type: 'percentage' | 'fixed';
  } | null>(null);

  // 기본 금액 (실제로는 API에서 가져와야 함)
  const basePrice = placeId === 'hotel' ? 369346 : placeId === 'beauty' ? 50000 : 15000;
  const discountAmount = selectedCoupon 
    ? selectedCoupon.type === 'percentage' 
      ? Math.floor(basePrice * selectedCoupon.discount / 100)
      : selectedCoupon.discount
    : 0;
  const finalPrice = basePrice - discountAmount;

  const handleReservationRequest = () => {
    // 기본 필드가 없는 경우에도 빈 값으로 전달
    const searchParams: Record<string, string | undefined> = {
      couponId: selectedCoupon?.id,
    };
    
    // reservationInfo의 모든 값을 전달
    Object.entries(reservationInfo).forEach(([key, value]) => {
      if (value) {
        searchParams[key] = value;
      }
    });

    router.navigate({ 
      to: "/reservation/$placeId/complete", 
      params: { placeId },
      search: searchParams
    });
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      <BackHeader 
        onBack={() => router.history.go(-1)} 
        label="예약하기"
      />
      
      <div className="px-6 py-4">
        {/* 가게 정보 */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{config.title}</h1>
          <div className="w-full h-56 rounded-lg mb-4 overflow-hidden">
            <img 
              src={config.imageSrc} 
              alt={config.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* 예약 정보 입력 */}
        <div className="space-y-3 mb-6">
          {config.fields.map((field) => (
            <div key={field.name}>
              <Label content={field.label} />
              <select
                value={reservationInfo[field.name] || ""}
                onChange={(e) => setReservationInfo(prev => ({ ...prev, [field.name]: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">선택</option>
                {field.options.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          ))}
        </div>

        {/* 금액 정보 */}
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-gray-900">최종 금액</span>
            <span className="text-lg font-bold text-gray-900">{basePrice.toLocaleString()}원</span>
          </div>
        </div>

        {/* 쿠폰 사용 버튼 */}
        <div className="mb-4">
          <button
            onClick={() => setShowCouponModal(true)}
            className="w-full py-2 border-2 border-green-500 text-green-500 rounded-lg text-sm font-medium hover:bg-green-50"
          >
            {selectedCoupon ? `${selectedCoupon.name} 적용됨` : '쿠폰 사용하기'}
          </button>
        </div>
      </div>

      {/* 고정된 하단 예약 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="w-full">
          <PrimaryButton
            variant="primary"
            size="lg"
            onClick={handleReservationRequest}
          >
            예약 요청하기
          </PrimaryButton>
        </div>
      </div>

      {/* 쿠폰 모달 */}
      {showCouponModal && (
        <CouponModal
          onClose={() => setShowCouponModal(false)}
          onSelectCoupon={setSelectedCoupon}
          selectedCoupon={selectedCoupon}
        />
      )}
    </div>
  );
}

// 쿠폰 모달 컴포넌트
function CouponModal({ 
  onClose, 
  onSelectCoupon, 
  selectedCoupon 
}: {
  onClose: () => void;
  onSelectCoupon: (coupon: any) => void;
  selectedCoupon: any;
}) {
  const coupons = [
    { id: '1', name: '음료 무료 쿠폰', discount: 0, type: 'fixed' as const, description: 'FREE', validUntil: '2025.09.30' },
    { id: '2', name: '반려견 미용 할인쿠폰', discount: 10, type: 'percentage' as const, description: '10%', validUntil: '2025.09.30' },
    { id: '3', name: '음료 무료 쿠폰', discount: 20, type: 'percentage' as const, description: '20%', validUntil: '2025.09.30' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="bg-white rounded-t-lg w-full max-w-md">
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900">사용 가능한 쿠폰</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              ✕
            </button>
          </div>
        </div>
        
        <div className="p-4 space-y-3">
          {coupons.map((coupon) => (
            <div
              key={coupon.id}
              className={`p-3 border rounded-lg cursor-pointer ${
                selectedCoupon?.id === coupon.id 
                  ? 'border-orange-500 bg-orange-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => onSelectCoupon(coupon)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium text-gray-900">{coupon.name}</div>
                  <div className="text-sm text-gray-500">유효기간: ~{coupon.validUntil}</div>
                </div>
                <div className="text-orange-500 font-bold">{coupon.description}</div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-4">
          <PrimaryButton
            variant="primary"
            size="md"
            onClick={onClose}
          >
            확인
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
