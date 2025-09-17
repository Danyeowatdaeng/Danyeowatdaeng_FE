import StatItem from "../../molecules/StatItem";

type Props = {
  point: number | string;
  stamp: number | string;
  onClickStamp?: () => void;
  onClickPoint?: () => void;
  className?: string;
};

export default function ProfileStats({
  point,
  stamp,
  onClickStamp,
  onClickPoint,
  className = "",
}: Props) {
  return (
    <section className={`rounded-2xl border border-[#ABABAB] px-2 py-6 ${className}`}>
      <div className="grid grid-cols-[1fr_1px_1fr] items-center">
        {/* 포인트 (클릭 시 포인트 페이지 이동) */}
        <StatItem
          iconSrc="/Assets/icons/Point.svg"
          value={point}
          caption="내 포인트"
          onClick={onClickPoint}   // ✅ 수정: 포인트는 onClickPoint
        />

        {/* 구분선 */}
        <div className="h-[60px] w-px bg-[#D9D9D9] justify-self-center" />

        {/* 스탬프 (클릭 시 스탬프 페이지 이동) */}
        <StatItem
          iconSrc="/Assets/icons/Stamp.svg"
          value={stamp}
          caption="스탬프"
          onClick={onClickStamp}   // ✅ 그대로 유지
        />
      </div>
    </section>
  );
}