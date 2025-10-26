import { useState } from "react";
import Title from "../atoms/Title";
import PrimaryButton from "../molecules/PrimaryButton";
import TabBar from "../molecules/TabBar";
import { useWebControlStore } from "../../store/webControlStore";
import MyGroup from "../organisms/cart/myGroup";
import type { CafeCardData } from "../molecules/category/CafeCard";
import BottomSheet from "../atoms/BottomSheet";
import CreateGroupForm from "../organisms/cart/CreateGroupForm";
import WishlistItem, { type WishlistItemData } from "../molecules/WishlistItem";

type Props = {
  wishlistItems?: CafeCardData[];
  loading?: boolean;
  error?: string | null;
  onRemoveItem?: (contentId: number) => void;
};

export default function CartLayout({
  wishlistItems = [],
  loading = false,
  error = null,
  onRemoveItem,
}: Props) {
  const isWide = useWebControlStore((state) => state.isWide);
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);

  const handleCreateGroup = (data: {
    name: string;
    icon: string;
    isPublic: boolean;
  }) => {
    console.log("새 그룹 생성:", data);
    // TODO: API 호출
    setBottomSheetOpen(false);
  };

  // CafeCardData를 WishlistItemData로 변환
  const wishlistItemsData: WishlistItemData[] = wishlistItems
    .filter((item) => item.contentId) // contentId가 있는 것만
    .map((item) => ({
      contentId: item.contentId,
      title: item.title,
      address: item.address,
      image: item.image,
      onRemove: onRemoveItem,
    }));

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* 스크롤 가능한 컨텐츠 영역 */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-8 pb-[calc(80px+env(safe-area-inset-bottom))]">
          <Title className="mt-15 mb-5">내 그룹</Title>
          <MyGroup />
          <div className="my-5">
            <PrimaryButton size={"sm"} onClick={() => setBottomSheetOpen(true)}>
              + 새 그룹 추가
            </PrimaryButton>
          </div>
          <Title className="mt-10 mb-5">최근 찜한 장소</Title>

          {/* 찜 목록 */}
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <p className="text-gray-500">로딩 중...</p>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-10">
              <p className="text-red-500">{error}</p>
            </div>
          ) : wishlistItems.length === 0 ? (
            <div className="flex items-center justify-center py-10">
              <p className="text-gray-500">찜한 장소가 없습니다.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {wishlistItemsData.map((item) => (
                <WishlistItem key={item.contentId} item={item} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 하단 고정 TabBar */}
      {isWide && <TabBar className="relative bottom-0 w-full z-30" />}
      {!isWide && <TabBar className="fixed bottom-0 left-0 w-full z-30" />}

      {/* 새 그룹 추가 BottomSheet */}
      <BottomSheet
        open={bottomSheetOpen}
        onOpenChange={setBottomSheetOpen}
        title="그룹 추가"
        height={550}
      >
        <CreateGroupForm onSubmit={handleCreateGroup} />
      </BottomSheet>
    </div>
  );
}
