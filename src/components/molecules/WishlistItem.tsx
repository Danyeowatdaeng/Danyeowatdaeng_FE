import StarIcon from "../atoms/Icon/StarIcon";

export type WishlistItemData = {
  contentId: number;
  title: string;
  address: string;
  image?: string;
  onRemove?: (contentId: number) => void;
};

type WishlistItemProps = {
  item: WishlistItemData;
};

export default function WishlistItem({ item }: WishlistItemProps) {
  return (
    <div className="flex items-center gap-4 py-4 border-b border-gray-100">
      {/* 정보 */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-base text-gray-900 truncate">
          {item.title}
        </h3>
        <p className="text-sm text-gray-500 truncate mt-1">{item.address}</p>
      </div>

      {/* 찜하기 아이콘 */}
      <button
        onClick={() => item.onRemove?.(item.contentId)}
        className="flex-shrink-0"
        aria-label="찜하기 취소"
      >
        <StarIcon width={24} height={24} color="#00A3A5" />
      </button>
    </div>
  );
}
