import Button from "../atoms/Button";
import Label from "../atoms/Label";

export type CafeCardData = {
  id: string | number;
  title: string;
  star: string; // 별점인데 일단 string으로
  image: string;
  rating: number;
  reviewCount: number;
  address: string;
  latitude: number;
  longitude: number;
  phone: string;
  source: string;
};

type Props = {
  item: CafeCardData;
  onClick?: (id: string | number) => void;
};

export default function CafeCard({ item, onClick }: Props) {
  return (
    <Button
      className="w-full p-0 bg-transparent text-left"
      onClick={() => onClick?.(item.id)}
      aria-label={item.title}
    >
      {/* 썸네일 */}
      <img
        src={item.image}
        alt={item.title}
        className="w-full h-[99px] rounded-2xl object-cover bg-gray-200"
      />

      {/* 텍스트 */}
      <div className="mt-3 px-0.5">
        <Label
          content={item.title}
          className="text-[16px] font-medium text-black leading-[1.2] line-clamp-1"
        />

        <Label
          content={item.star}
          className="text-[16px] font-medium text-black text-orange leading-[1.2] line-clamp-1"
        />

        <div className="mt-1 text-[13px] text-gray-500 line-clamp-1">
          {item.address}
        </div>
      </div>
    </Button>
  );
}
