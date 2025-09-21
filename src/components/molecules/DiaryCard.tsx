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
  fallbackSrc?: string; // ✅ 썸네일 깨질 때 대체 이미지
};

export default function DiaryCard({
  item,
  onClick,
  className = "",
  fallbackSrc = "/Assets/images/diary-fallback.png", // 없으면 회색 박스 유지
}: Props) {
  return (
    <button
      type="button"
      className={`text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00A3A5] rounded-xl ${className}`}
      onClick={() => onClick?.(item.id)}
      aria-label={item.caption ?? "다이어리"}
    >
      <div className="w-full aspect-square rounded-xl overflow-hidden bg-gray-100">
        <img
          src={item.imageSrc}
          alt={item.caption ?? "diary image"}
          loading="lazy"
          className="w-full h-full object-cover"
          onError={(e) => {
            const img = e.currentTarget;
            if (img.src !== fallbackSrc) img.src = fallbackSrc;
          }}
        />
      </div>
      {item.caption && (
        <Label content={item.caption} className="text-[15px] mt-3" />
      )}
    </button>
  );
}