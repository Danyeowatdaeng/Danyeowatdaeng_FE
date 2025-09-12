import Label from "../atoms/Label";

export type DiaryItem = {
  id: string | number;
  imageSrc: string;
  caption?: string;
};

type Props = {
  item: DiaryItem;
  onClick?: (id: string | number) => void;
  className?: string;
};

export default function DiaryCard({ item, onClick, className = "" }: Props) {
  return (
    <button
      className={`text-left ${className}`}
      onClick={() => onClick?.(item.id)}
      aria-label={item.caption ?? "다이어리"}
    >
      <div className="w-full aspect-square rounded-xl overflow-hidden bg-gray-100">
        <img
          src={item.imageSrc}
          alt={item.caption ?? "diary image"}
          className="w-full h-full object-cover"
        />
      </div>
      {item.caption && (
        <Label content={item.caption} className="text-[15px] mt-3" />
      )}
    </button>
  );
}