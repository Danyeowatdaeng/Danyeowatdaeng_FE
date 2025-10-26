import { useState, useEffect } from "react";
import Title from "../atoms/Title";
import PrimaryButton from "../molecules/PrimaryButton";
import TabBar from "../molecules/TabBar";
import { useWebControlStore } from "../../store/webControlStore";
import MyGroup from "../organisms/cart/myGroup";
import type { CafeCardData } from "../molecules/category/CafeCard";
import BottomSheet from "../atoms/BottomSheet";
import CreateGroupForm from "../organisms/cart/CreateGroupForm";
import WishlistItem, { type WishlistItemData } from "../molecules/WishlistItem";
import { 
  getWishlistGroups, 
  createWishlistGroup,
  updateWishlistGroup,
  deleteWishlistGroup,
  type WishlistGroup 
} from "../../api";

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
  const [editBottomSheetOpen, setEditBottomSheetOpen] = useState(false);
  const [groups, setGroups] = useState<WishlistGroup[]>([]);
  const [groupsLoading, setGroupsLoading] = useState(false);
  const [editingGroup, setEditingGroup] = useState<WishlistGroup | null>(null);

  // 그룹 목록 불러오기
  const fetchGroups = async () => {
    try {
      setGroupsLoading(true);
      const response = await getWishlistGroups();
      setGroups(response.data || []);
    } catch (error) {
      console.error("그룹 목록 조회 실패:", error);
      setGroups([]);
    } finally {
      setGroupsLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleCreateGroup = async (data: {
    name: string;
    icon: string;
    isPublic: boolean;
  }) => {
    try {
      // 아이콘 이름을 실제 URL로 변환
      const categoryImageUrl = `/Assets/icons/categories/${data.icon}.svg`;
      
      await createWishlistGroup({
        name: data.name,
        isPublic: data.isPublic,
        categoryImageUrl,
      });

      // 그룹 생성 후 목록 다시 불러오기
      await fetchGroups();
      setBottomSheetOpen(false);
    } catch (error) {
      console.error("그룹 생성 실패:", error);
      alert("그룹 생성에 실패했습니다.");
    }
  };

  const handleEditGroup = (group: WishlistGroup) => {
    setEditingGroup(group);
    setEditBottomSheetOpen(true);
  };

  const handleUpdateGroup = async (data: {
    name: string;
    icon: string;
    isPublic: boolean;
  }) => {
    if (!editingGroup) return;

    try {
      const categoryImageUrl = `/Assets/icons/categories/${data.icon}.svg`;
      
      await updateWishlistGroup(editingGroup.id, {
        name: data.name,
        isPublic: data.isPublic,
        categoryImageUrl,
      });

      // 그룹 수정 후 목록 다시 불러오기
      await fetchGroups();
      setEditBottomSheetOpen(false);
      setEditingGroup(null);
    } catch (error) {
      console.error("그룹 수정 실패:", error);
      alert("그룹 수정에 실패했습니다.");
    }
  };

  const handleDeleteGroup = async (group: WishlistGroup) => {
    const confirmed = window.confirm(`"${group.name}" 그룹을 삭제하시겠습니까?`);
    
    if (confirmed) {
      try {
        await deleteWishlistGroup(group.id);
        
        // 그룹 삭제 후 목록 다시 불러오기
        await fetchGroups();
      } catch (error) {
        console.error("그룹 삭제 실패:", error);
        alert("그룹 삭제에 실패했습니다.");
      }
    }
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
          
          {/* 그룹 목록 */}
          {groupsLoading ? (
            <div className="flex items-center justify-center py-5">
              <p className="text-gray-500">로딩 중...</p>
            </div>
          ) : groups.length === 0 ? (
            <div className="flex items-center justify-center py-5">
              <p className="text-gray-500">아직 생성된 그룹이 없습니다.</p>
            </div>
          ) : (
            <div className="space-y-2 mb-5">
              {groups.map((group) => (
                <MyGroup 
                  key={group.id} 
                  group={group}
                  onEdit={handleEditGroup}
                  onDelete={handleDeleteGroup}
                />
              ))}
            </div>
          )}
          
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

      {/* 그룹 수정 BottomSheet */}
      <BottomSheet
        open={editBottomSheetOpen}
        onOpenChange={setEditBottomSheetOpen}
        title="그룹 수정"
        height={550}
      >
        <CreateGroupForm 
          onSubmit={handleUpdateGroup}
          initialData={
            editingGroup
              ? {
                  name: editingGroup.name,
                  icon: editingGroup.categoryImageUrl.split('/').pop()?.replace('.svg', '') || '',
                  isPublic: editingGroup.isPublic,
                }
              : undefined
          }
        />
      </BottomSheet>
    </div>
  );
}
