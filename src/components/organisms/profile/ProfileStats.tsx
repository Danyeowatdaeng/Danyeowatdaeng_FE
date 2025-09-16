import StatItem from "../../molecules/StatItem";

type Props = {
  point: number | string;
  stamp: number | string;
  onClickStamp?: () => void;
  className?: string;
};

export default function ProfileStats({
  point,
  stamp,
  onClickStamp,
  className = "",
}: Props) {
  return (
    <section className={`rounded-2xl border border-[#ABABAB] px-2 py-6 ${className}`}>
      <div className="grid grid-cols-[1fr_1px_1fr] items-center">
        {/* 포인트 */}
        <StatItem
          iconSrc="/Assets/icons/Point.svg"
          value={point}
          caption="내 포인트"
          onClick={onClickStamp}
        />

        {/* 구분선 */}
        <div className="h-[60px] w-px bg-[#D9D9D9] justify-self-center" />

        {/* 스탬프 (클릭 가능) */}
        <StatItem
          iconSrc="/Assets/icons/Stamp.svg"
          value={stamp}
          caption="스탬프"
          onClick={onClickStamp}
        />
      </div>
    </section>
  );
}