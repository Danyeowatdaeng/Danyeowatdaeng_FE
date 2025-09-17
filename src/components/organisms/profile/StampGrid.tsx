import StampMark from "../../molecules/StampMark";

export type StampItem = {
  kind: "stamp" | "gift";
  state: "active" | "inactive" | "rewarded";
  caption?: string;
};

type Props = {
  items: StampItem[];
  onItemClick?: (index: number, item: StampItem) => void;
  className?: string;
};

export default function StampGrid({ items, onItemClick, className = "" }: Props) {
  return (
    <section
      className={[
        // 3열 그리드 + 가운데 정렬 + 적당한 여백
        "grid grid-cols-3 gap-x-0 gap-y-3",
        className,
      ].join(" ")}
    >
      {items.map((it, i) => (
        <StampMark
          key={i}
          kind={it.kind}
          state={it.state}
          caption={it.caption}
          onClick={() => onItemClick?.(i, it)}
        />
      ))}
    </section>
  );
}