import { useState } from "react";
import Title from "../atoms/Title";
import PrimaryButton from "../molecules/PrimaryButton";
import TabBar from "../molecules/TabBar";
import { useWebControlStore } from "../../store/webControlStore";
import MyGroup from "../organisms/cart/myGroup";
import CafeGrid from "../molecules/category/CafeGrid";
import type { CafeCardData } from "../molecules/category/CafeCard";
import BottomSheet from "../atoms/BottomSheet";
import CreateGroupForm from "../organisms/cart/CreateGroupForm";

type Props = {
  wishlistItems?: CafeCardData[];
  loading?: boolean;
  error?: string | null;
};

export default function CartLayout({
  wishlistItems = [],
  loading = false,
  error = null,
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

  return (
    <div className="flex flex-col justify-between h-full">
      <div className=" mx-8">
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
          <CafeGrid
            items={wishlistItems}
            onItemClick={(id) => console.log("찜한 장소 클릭:", id)}
          />
        )}
      </div>
      {isWide && <TabBar className="relative bottom-0 w-full z-30" />}

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
