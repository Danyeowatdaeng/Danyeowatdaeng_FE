import DiaryCard from "./DiaryCard";
import type { DiaryItem } from "./DiaryCard";

type Props = {
  items: DiaryItem[];
  onItemClick?: (id: string | number) => void;
  className?: string;
};

export default function DiaryGrid({ items, onItemClick, className = "" }: Props) {
  return (
    <div className={`grid grid-cols-2 gap-x-5 gap-y-8 ${className}`}>
      {items.map((it) => (
        <DiaryCard key={it.id} item={it} onClick={onItemClick} />
      ))}
    </div>
  );
}