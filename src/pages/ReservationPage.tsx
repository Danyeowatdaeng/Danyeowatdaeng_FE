import { useState } from "react";
import { useRouter, useParams } from "@tanstack/react-router";
import BackHeader from "../components/molecules/BackHeader";
import PrimaryButton from "../components/molecules/PrimaryButton";
import Input from "../components/atoms/Input";
import Label from "../components/atoms/Label";

export default function ReservationPage() {
  const router = useRouter();
  const { placeId } = useParams({ from: "/reservation/$placeId" });
  const [showCouponModal, setShowCouponModal] = useState(false);
  
  // 예약 정보 상태
  const [reservationInfo, setReservationInfo] = useState({
    period: "",
    rooms: "",
    people: "",
  });
  
  // 쿠폰 정보 상태
  const [selectedCoupon, setSelectedCoupon] = useState<{
    id: string;
    name: string;
    discount: number;
    type: 'percentage' | 'fixed';
  } | null>(null);

  // 기본 금액 (실제로는 API에서 가져와야 함)
  const basePrice = 369346;
  const discountAmount = selectedCoupon 
    ? selectedCoupon.type === 'percentage' 
      ? Math.floor(basePrice * selectedCoupon.discount / 100)
      : selectedCoupon.discount
    : 0;
  const finalPrice = basePrice - discountAmount;

  const handleNext = () => {
    if (!reservationInfo.period || !reservationInfo.rooms || !reservationInfo.people) {
      alert("모든 정보를 입력해주세요.");
      return;
    }
    // 다음 단계로 진행 (쿠폰 선택은 선택사항)
    router.navigate({ 
      to: "/reservation/$placeId/complete", 
      params: { placeId },
      search: { 
        period: reservationInfo.period,
        rooms: reservationInfo.rooms,
        people: reservationInfo.people,
        couponId: selectedCoupon?.id
      }
    });
  };

  const handleReservationRequest = () => {
    router.navigate({ 
      to: "/reservation/$placeId/complete", 
      params: { placeId },
      search: { 
        period: reservationInfo.period,
        rooms: reservationInfo.rooms,
        people: reservationInfo.people,
        couponId: selectedCoupon?.id
      }
    });
  };

  return (
    <div className="h-screen bg-white">
      <BackHeader 
        onBack={() => router.history.go(-1)} 
        title="예약하기"
      />
      
      <div className="p-6">
        {/* 호텔 정보 */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900 mb-2">펫 프렌들리 호텔</h1>
          <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
            <span className="text-gray-500">호텔 이미지</span>
          </div>
        </div>

        {/* 예약 정보 입력 */}
        <div className="space-y-4 mb-6">
          <div>
            <Label text="기간" />
            <select
              value={reservationInfo.period}
              onChange={(e) => setReservationInfo(prev => ({ ...prev, period: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">선택</option>
              <option value="1박">1박</option>
              <option value="2박">2박</option>
              <option value="3박">3박</option>
            </select>
          </div>

          <div>
            <Label text="객실 수" />
            <select
              value={reservationInfo.rooms}
              onChange={(e) => setReservationInfo(prev => ({ ...prev, rooms: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">선택</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
          </div>

          <div>
            <Label text="인원" />
            <select
              value={reservationInfo.people}
              onChange={(e) => setReservationInfo(prev => ({ ...prev, people: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">선택</option>
              <option value="1명">1명</option>
              <option value="2명">2명</option>
              <option value="3명">3명</option>
              <option value="4명">4명</option>
            </select>
          </div>
        </div>

        {/* 금액 정보 */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-lg font-bold text-gray-900">최종 금액</span>
            <span className="text-lg font-bold text-gray-900">{basePrice.toLocaleString()}원</span>
          </div>
          
          {selectedCoupon && (
            <div className="flex justify-between items-center mb-2 text-green-600">
              <span>쿠폰 할인</span>
              <span>-{discountAmount.toLocaleString()}원</span>
            </div>
          )}
          
          {selectedCoupon && (
            <div className="flex justify-between items-center text-lg font-bold text-gray-900">
              <span>최종 금액</span>
              <span>{finalPrice.toLocaleString()}원</span>
            </div>
          )}
        </div>

        {/* 쿠폰 사용 버튼 */}
        <div className="mb-6">
          <button
            onClick={() => setShowCouponModal(true)}
            className="w-full p-3 border-2 border-green-500 text-green-500 rounded-lg font-medium hover:bg-green-50"
          >
            {selectedCoupon ? `${selectedCoupon.name} 적용됨` : '쿠폰 사용하기'}
          </button>
        </div>

        {/* 예약 요청 버튼 */}
        <PrimaryButton
          variant="primary"
          size="lg"
          onClick={handleReservationRequest}
        >
          예약 요청하기
        </PrimaryButton>
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
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-50">
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
