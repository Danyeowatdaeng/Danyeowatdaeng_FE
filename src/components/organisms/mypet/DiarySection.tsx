import Title from "../../atoms/Title";
import PillButton from "../../molecules/PillButton";
import DiaryGrid from "../../molecules/DiaryGrid";
import type { DiaryItem } from "../../molecules/DiaryCard";

type Props = {
  title?: string;
  items: DiaryItem[];
  onWrite?: () => void;
  onItemClick?: (id: string | number) => void;
  className?: string;
};

export default function DiarySection({
  title = "마이펫 다이어리",
  items,
  onWrite,
  onItemClick,
  className = "",
}: Props) {
  return (
    <section className={`flex flex-col h-full min-h-0 ${className}`}>
      {/* 헤더(고정) */}
      <div className="flex items-center justify-between flex-none">
        <Title className="text-[20px] font-bold">{title}</Title>
        <PillButton text="작성하기" onClick={onWrite} />
      </div>

      {/* 그리드만 스크롤 */}
      <div className="flex-1 min-h-0 overflow-y-auto mt-4 bg-purple-100">
        <DiaryGrid items={items} onItemClick={onItemClick} />
      </div>
    </section>
  );
}