import BackHeader from "../molecules/BackHeader";
import { ChevronRight } from "lucide-react";
import DistanceButton, { type Distance } from "../molecules/DistanceButton";
import CafeGrid from "../molecules/category/CafeGrid";
import TabBar from "../molecules/TabBar";
import { useWebControlStore } from "../../store/webControlStore";
import type { CafeCardData } from "../molecules/category/CafeCard";

type CafeListTemplateProps = {
  // 헤더
  title?: string; // 상단 제목
  onBack?: () => void; // 뒤로가기

  // 거리 선택
  distanceLabel?: Distance;
  onDistanceClick?: (d: Distance) => void;
  cafes: CafeCardData[];
  loading?: boolean;
  error?: string | null;
  onCafeClick?: (id: string | number) => void;
  onRetry?: () => void;
};

export default function CafeListTemplate({
  title = "카페",
  onBack,
  distanceLabel = "500m",
  onDistanceClick,
  cafes,
  loading = false,
  error = null,
  onCafeClick,
  onRetry,
}: CafeListTemplateProps) {
  const isWide = useWebControlStore((state) => state.isWide);

  // 로딩 상태 렌더링
  const renderLoading = () => (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-500">데이터를 불러오는 중...</p>
      </div>
    </div>
  );

  // 에러 상태 렌더링
  const renderError = () => (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center">
        <p className="text-red-500 mb-4">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            다시 시도
          </button>
        )}
      </div>
    </div>
  );

  // 빈 데이터 상태 렌더링
  const renderEmpty = () => (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-500">해당 지역에 {title}이 없습니다.</p>
        <p className="text-gray-400 text-sm mt-2">다른 거리를 선택해보세요.</p>
      </div>
    </div>
  );

  return (
    <>
      <div className="h-dvh flex flex-col pt-[env(safe-area-inset-top)] px-6 pb-[env(safe-area-inset-bottom)]">
        {/* 상단 헤더 */}
        <div className="flex-none pt-11">
          <BackHeader onBack={onBack} label={title} />
        </div>

        {/* 거리 선택 박스 */}
        <div className=" flex-none">
          <div className="flex items-center gap-2 text-gray-700">
            <span className="text-[13px]">{distanceLabel}</span>
            <ChevronRight size={16} aria-hidden color="gray" />
            <DistanceButton
              current={distanceLabel}
              onClick={(d) => onDistanceClick?.(d)}
            />
          </div>
        </div>

        {/* 카페 리스트 (여기만 스크롤) */}
        <div
          className={`flex-1 overflow-y-auto py-4 ${isWide ? "mb-53" : "mb-22"}`}
        >
          <div className="max-w-[560px] mx-auto">
            {loading ? (
              renderLoading()
            ) : error ? (
              renderError()
            ) : cafes.length === 0 ? (
              renderEmpty()
            ) : (
              <CafeGrid items={cafes} onItemClick={onCafeClick} />
            )}
          </div>
        </div>
      </div>
      {isWide && <TabBar className="absolute bottom-0 w-full z-30" />}
    </>
  );
}
