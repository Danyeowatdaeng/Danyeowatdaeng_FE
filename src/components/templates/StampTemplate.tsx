// 헤더 고정 + 배너 + 라운드된 흰 컨테이너 + 스크롤 그리드
import BackHeader from "../molecules/BackHeader";
import StampHero from "../organisms/profile/StampHero";
import StampGrid from "../organisms/profile/StampGrid";
import type { StampItem } from "../organisms/profile/StampGrid";

type Props = {
  onBack?: () => void;
  onScan?: () => void;
  items: StampItem[];
};

export default function StampTemplate({ onBack, onScan, items }: Props) {
  const owned = items.filter(i => i.state !== "inactive").length;

  return (
    <div className="bg-[#00A3A5]">
      {/* 헤더 */}
      <div className="bg-red-100">
        <BackHeader onBack={onBack} label="마이 스탬프" />
      </div>

      {/* 상단 배너 */}
      <StampHero onScan={onScan} className="" />

      {/* 본문 스크롤 영역 */}
      <div className="flex-1">
        <div className="-mt-8 bg-white">
          <p className="pt-8 text-[16px] text-[#9B9B9B]">보유스탬프 {owned}개</p>
          <StampGrid items={items} className="mt-16 pb-10" />
        </div>
      </div>
    </div>
  );
}