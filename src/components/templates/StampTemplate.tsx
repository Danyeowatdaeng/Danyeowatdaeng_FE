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
  const owned = items.filter((i) => i.state !== "inactive").length;

  return (
    <div className="min-h-dvh flex flex-col bg-[#00A3A5]">
      {/* 헤더: 청록 배경 위에 얹힘 */}
      <div className="px-6 pt-11 bg-white">
        <BackHeader onBack={onBack} label="마이 스탬프" />
      </div>

      {/* 상단 배너 */}
      <StampHero onScan={onScan} className="px-6 pt-4 pb-20" />

      {/* 흰색 컨테이너 (윗쪽만 둥글게) */}
      <div className="flex-1">
        <section
          className={[
            // 위를 살짝 겹치게
            "-mt- rounded-t-3xl bg-white",
            // 내부 패딩
            "px-6 pt-8 pb-2",
            // 내용이 넘치면 스크롤
            "min-h-[60vh]",
          ].join(" ")}
        >
          <p className="text-[14px] text-[#9B9B9B] px-5">보유스탬프 {owned}개</p>

          <StampGrid items={items} className="mt-6" />
        </section>
      </div>
    </div>
  );
}