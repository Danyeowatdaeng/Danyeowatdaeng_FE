import BackHeader from "../molecules/BackHeader";
import { ChevronRight } from "lucide-react";
import DistanceButton, { type Distance } from "../molecules/DistanceButton";
import CafeGrid from "../molecules/CafeGrid";
import type { CafeCardData } from "../molecules/CafeCard";
import TabBar from "../molecules/TabBar";
import { useWebControlStore } from "../../store/webControlStore";

type CafeListTemplateProps = {
  // 헤더
  title?: string; // 상단 제목
  onBack?: () => void; // 뒤로가기

  // 거리 선택
  distanceLabel?: Distance;
  onDistanceClick?: (d: Distance) => void;

  // 카페 리스트
  cafes: CafeCardData[];
  onCafeClick?: (id: string | number) => void;
};

export default function CafeListTemplate({
  title = "애견동반카페",
  onBack,
  distanceLabel = "500m",
  onDistanceClick,
  cafes,
  onCafeClick,
}: CafeListTemplateProps) {
  const isWide = useWebControlStore((state) => state.isWide);
  return (
    <div className="p-6 h-dvh flex flex-col pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
      {/* 상단 헤더 */}
      <div className="flex-none">
        <BackHeader onBack={onBack} label={title} />
      </div>

      {/* 거리 선택 박스 */}
      <div className=" flex-none">
        <div className="flex items-center gap-2 text-gray-700 bg-yellow-100">
          <span className="text-[13px]">{distanceLabel}</span>
          <ChevronRight size={16} aria-hidden color="gray" />
          <DistanceButton
            current={distanceLabel}
            onClick={(d) => onDistanceClick?.(d)}
          />
        </div>
      </div>

      {/* 카페 리스트 (여기만 스크롤) */}
      <div className="flex-1 overflow-y-auto py-4 ">
        <div className="max-w-[560px] mx-auto">
          <CafeGrid items={cafes} onItemClick={onCafeClick} />
        </div>
      </div>
      {isWide && <TabBar className="absolute bottom-0 w-full z-30" />}
    </div>
  );
}
