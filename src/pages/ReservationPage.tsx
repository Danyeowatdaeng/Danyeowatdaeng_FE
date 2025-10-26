import { useState } from "react";
import { useRouter, useParams } from "@tanstack/react-router";
import BackHeader from "../components/molecules/BackHeader";
import PrimaryButton from "../components/molecules/PrimaryButton";
import Label from "../components/atoms/Label";
import DateRangeCalendar from "../components/molecules/DateRangeCalendar";

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
  
  // 날짜 범위 상태
  const [selectedDateRange, setSelectedDateRange] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({ startDate: null, endDate: null });
  
  // 쿠폰 정보 상태
  const [selectedCoupon, setSelectedCoupon] = useState<{
    id: string;
    name: string;
    discount: number;
    type: 'percentage' | 'fixed';
    description: string;
  } | null>(null);

  // 기본 금액 (실제로는 API에서 가져와야 함)
  const basePrice = placeId === 'hotel' ? 369346 : placeId === 'beauty' ? 50000 : 15000;
  
  // 쿠폰 할인 계산
  const calculateDiscount = () => {
    if (!selectedCoupon) return 0;
    
    if (selectedCoupon.type === 'percentage') {
      return Math.floor(basePrice * (selectedCoupon.discount / 100));
    } else {
      return selectedCoupon.discount;
    }
  };
  
  const discountAmount = calculateDiscount();
  const finalPrice = basePrice - discountAmount;

  const handleReservationRequest = () => {
    // 기본 필드가 없는 경우에도 빈 값으로 전달
    const searchParams: Record<string, string | undefined> = {
      couponId: selectedCoupon?.id,
    };
    
    // 날짜 범위 추가
    if (selectedDateRange.startDate) {
      searchParams.startDate = selectedDateRange.startDate.toISOString().split('T')[0];
    }
    if (selectedDateRange.endDate) {
      searchParams.endDate = selectedDateRange.endDate.toISOString().split('T')[0];
    }
    
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
      
      <div className="px-4 py-3">
        {/* 가게 정보 - 컴팩트하게 */}
        <div className="mb-4">
          <h1 className="text-xl font-bold text-gray-900 mb-2">{config.title}</h1>
          <div className="w-full h-32 rounded-lg mb-3 overflow-hidden">
            <img 
              src={config.imageSrc} 
              alt={config.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* 날짜 선택 - 캘린더 */}
        <div className="mb-4">
          <Label content="방문 날짜" />
          <DateRangeCalendar 
            onDateRangeChange={(startDate, endDate) => {
              setSelectedDateRange({ startDate, endDate });
            }}
            className="mt-2"
          />
        </div>

        {/* 예약 정보 입력 - 날짜 필드 제외 */}
        <div className="space-y-3 mb-4">
          {config.fields
            .filter(field => !field.name.includes('date') && !field.name.includes('period'))
            .map((field) => (
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
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">기본 금액</span>
              <span className="text-sm text-gray-600">{basePrice.toLocaleString()}원</span>
            </div>
            {selectedCoupon && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-green-600">
                  쿠폰 할인 ({selectedCoupon.description})
                </span>
                <span className="text-sm text-green-600">
                  -{discountAmount.toLocaleString()}원
                </span>
              </div>
            )}
            <div className="border-t border-gray-300 pt-2">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">최종 금액</span>
                <span className={`text-lg font-bold ${
                  selectedCoupon ? 'text-green-600' : 'text-gray-900'
                }`}>
                  {finalPrice.toLocaleString()}원
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 쿠폰 사용 버튼 */}
        <div className="mb-4">
          <button
            onClick={() => setShowCouponModal(true)}
            className={`w-full py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
              selectedCoupon 
                ? 'bg-green-100 border-2 border-green-500 text-green-700 hover:bg-green-200' 
                : 'bg-gradient-to-r from-green-500 to-blue-500 text-white hover:from-green-600 hover:to-blue-600 shadow-lg hover:shadow-xl'
            }`}
          >
            {selectedCoupon ? (
              <div className="flex items-center justify-center gap-2">
                <span className="text-lg">🎫</span>
                <span>{selectedCoupon.name} 적용됨</span>
                <span className="text-xs bg-green-200 px-2 py-1 rounded-full">
                  {selectedCoupon.description}
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <span className="text-lg">🎫</span>
                <span>쿠폰 사용하기</span>
                <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">
                  할인 혜택
                </span>
              </div>
            )}
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
    { 
      id: '1', 
      name: '음료 무료 쿠폰', 
      discount: 0, 
      type: 'fixed' as const, 
      description: 'FREE', 
      validUntil: '2025.09.30',
      color: 'bg-green-500'
    },
    { 
      id: '2', 
      name: '반려견 미용 할인쿠폰', 
      discount: 10, 
      type: 'percentage' as const, 
      description: '10%', 
      validUntil: '2025.09.30',
      color: 'bg-blue-500'
    },
    { 
      id: '3', 
      name: '펫 호텔 할인쿠폰', 
      discount: 20, 
      type: 'percentage' as const, 
      description: '20%', 
      validUntil: '2025.09.30',
      color: 'bg-purple-500'
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-end justify-center">
      <div className="bg-white rounded-t-2xl w-full max-w-md max-h-[80vh] overflow-hidden">
        {/* 헤더 */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900">사용 가능한 쿠폰</h2>
            <button 
              onClick={onClose} 
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
            >
              <span className="text-gray-500 text-xl">×</span>
            </button>
          </div>
        </div>
        
        {/* 쿠폰 목록 */}
        <div className="p-4 space-y-4 overflow-y-auto max-h-96">
          {coupons.map((coupon) => (
            <div
              key={coupon.id}
              className={`relative cursor-pointer transition-all duration-200 ${
                selectedCoupon?.id === coupon.id 
                  ? 'scale-105 shadow-lg' 
                  : 'hover:scale-102'
              }`}
              onClick={() => onSelectCoupon(coupon)}
            >
              {/* 실제 쿠폰 디자인 */}
              <div className={`relative bg-white border-2 rounded-xl overflow-hidden ${
                selectedCoupon?.id === coupon.id 
                  ? 'border-orange-500 shadow-lg' 
                  : 'border-gray-200'
              }`}>
                {/* 쿠폰 상단 */}
                <div className={`${coupon.color} p-4 text-white`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-lg">{coupon.name}</h3>
                      <p className="text-sm opacity-90">유효기간: ~{coupon.validUntil}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{coupon.description}</div>
                      {coupon.type === 'percentage' && (
                        <div className="text-sm opacity-90">할인</div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* 쿠폰 하단 - 점선 효과 */}
                <div className="p-4 bg-gray-50 relative">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      {coupon.type === 'fixed' ? '무료 제공' : `${coupon.discount}% 할인`}
                    </div>
                    <div className="text-xs text-gray-500">
                      {selectedCoupon?.id === coupon.id ? '선택됨' : '클릭하여 선택'}
                    </div>
                  </div>
                  
                  {/* 점선 효과 */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent">
                    <div className="absolute inset-0 bg-repeat-x" style={{
                      backgroundImage: 'radial-gradient(circle, #d1d5db 1px, transparent 1px)',
                      backgroundSize: '8px 1px'
                    }}></div>
                  </div>
                </div>
                
                {/* 선택 표시 */}
                {selectedCoupon?.id === coupon.id && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* 하단 버튼 */}
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <div className="w-full">
            <PrimaryButton
              variant="primary"
              size="md"
              onClick={onClose}
            >
              {selectedCoupon ? '쿠폰 적용하기' : '닫기'}
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
}
