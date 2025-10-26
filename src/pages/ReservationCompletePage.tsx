import { useRouter, useSearch } from "@tanstack/react-router";
import PrimaryButton from "../components/molecules/PrimaryButton";

export default function ReservationCompletePage() {
  const router = useRouter();
  const search = useSearch({ from: "/reservation/$placeId/complete" });

  const handleGoHome = () => {
    router.navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      {/* 강아지 캐릭터 이미지 - 작게 */}
      <div className="w-20 h-20 mb-6 flex items-center justify-center">
        <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
          <span className="text-3xl">🐕</span>
        </div>
      </div>

      {/* 완료 메시지 - 컴팩트하게 */}
      <div className="text-center mb-6">
        <h1 className="text-xl font-bold text-gray-900 mb-2">
          예약 요청이 완료되었어요!
        </h1>
        <p className="text-gray-600 mb-4 text-sm">
          예약 정보가 확인되면 연락드릴게요
        </p>
        
        {/* 예약 정보 요약 - 컴팩트하게 */}
        <div className="bg-gray-50 p-3 rounded-lg text-left max-w-sm">
          <h3 className="font-medium text-gray-900 mb-2 text-sm">예약 정보</h3>
          <div className="space-y-1 text-xs text-gray-600">
            {Object.entries(search)
              .filter(([key]) => key !== 'couponId')
              .map(([key, value]) => (
                <div key={key} className="truncate">
                  {key}: {String(value)}
                </div>
              ))}
            {search.couponId && <div>쿠폰 적용됨</div>}
          </div>
        </div>
      </div>

      {/* 홈으로 가기 버튼 - 작게 */}
      <PrimaryButton
        variant="primary"
        size="md"
        onClick={handleGoHome}
        className="w-full max-w-xs"
      >
        홈으로 가기
      </PrimaryButton>
    </div>
  );
}
