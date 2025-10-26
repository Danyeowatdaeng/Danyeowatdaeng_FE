import CafeCard, { type CafeCardData } from "./CafeCard";

type Props = {
  items: CafeCardData[];
  onItemClick?: (id: string | number) => void;
  className?: string;
};

export default function CafeGrid({
  items,
  onItemClick,
  className = "",
}: Props) {
  return (
    <div
      className={`grid grid-cols-2 sm:grid-cols-2 gap-x-6 gap-y-6 ${className}`}
    >
      {items.map((it) => (
        <CafeCard key={it.id} item={it} onClick={onItemClick} />
      ))}
    </div>
  );
}
