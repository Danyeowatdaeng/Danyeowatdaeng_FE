import { useRouter, useParams, useSearch } from "@tanstack/react-router";
import PrimaryButton from "../components/molecules/PrimaryButton";

export default function ReservationCompletePage() {
  const router = useRouter();
  const { placeId } = useParams({ from: "/reservation/$placeId/complete" });
  const search = useSearch({ from: "/reservation/$placeId/complete" });

  const handleGoHome = () => {
    router.navigate({ to: "/" });
  };

  return (
    <div className="h-screen bg-white flex flex-col items-center justify-center p-6">
      {/* 강아지 캐릭터 이미지 */}
      <div className="w-32 h-32 mb-8 flex items-center justify-center">
        <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
          <span className="text-4xl">🐕</span>
        </div>
      </div>

      {/* 완료 메시지 */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          예약 요청이 완료되었어요!
        </h1>
        <p className="text-gray-600 mb-4">
          예약 정보가 확인되면 연락드릴게요
        </p>
        
        {/* 예약 정보 요약 */}
        <div className="bg-gray-50 p-4 rounded-lg text-left">
          <h3 className="font-medium text-gray-900 mb-2">예약 정보</h3>
          <div className="space-y-1 text-sm text-gray-600">
            <div>기간: {search.period}</div>
            <div>객실 수: {search.rooms}</div>
            <div>인원: {search.people}</div>
            {search.couponId && <div>쿠폰 적용됨</div>}
          </div>
        </div>
      </div>

      {/* 홈으로 가기 버튼 */}
      <PrimaryButton
        variant="primary"
        size="lg"
        onClick={handleGoHome}
      >
        홈으로 가기
      </PrimaryButton>
    </div>
  );
}
