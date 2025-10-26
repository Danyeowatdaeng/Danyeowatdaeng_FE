import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import BackHeader from "../components/molecules/BackHeader";
import WishlistItem, {
  type WishlistItemData,
} from "../components/molecules/WishlistItem";
import TabBar from "../components/molecules/TabBar";
import BottomSheet from "../components/atoms/BottomSheet";
import PrimaryButton from "../components/molecules/PrimaryButton";
import { useWebControlStore } from "../store/webControlStore";
import {
  getWishlistGroup,
  getWishlist,
  addWishlistToGroup,
  type WishlistGroup,
  type WishlistItem as WishlistItemAPI,
} from "../api";

type Props = {
  groupId: number;
};

export default function GroupDetailPage({ groupId }: Props) {
  const navigate = useNavigate();
  const isWide = useWebControlStore((state) => state.isWide);
  const [group, setGroup] = useState<WishlistGroup | null>(null);
  const [loading, setLoading] = useState(true);
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const [allWishlists, setAllWishlists] = useState<WishlistItemAPI[]>([]);
  const [selectedWishlistIds, setSelectedWishlistIds] = useState<number[]>([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const fetchGroup = async () => {
    try {
      setLoading(true);
      console.log("=== 그룹 상세 조회 시작 ===");
      console.log("groupId:", groupId);
      console.log("API 호출: /wishlist-groups/" + groupId);

      // 그룹 상세 조회 API 사용
      const response = await getWishlistGroup(groupId);
      console.log("✅ 그룹 상세 조회 응답:", response);

      if (response.isSuccess) {
        console.log("✅ 그룹 데이터:", response.data);
        console.log("✅ 그룹 내 찜 목록:", response.data.wishlists);
        setGroup(response.data);
      } else {
        console.log("❌ 응답 실패");
        setGroup(null);
      }
    } catch (error) {
      console.error("❌ 그룹 조회 실패:", error);
      setGroup(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("🔄 useEffect 실행 - groupId:", groupId);
    fetchGroup();
  }, [groupId]);

  const handleBack = () => {
    navigate({ to: "/cart" });
  };

  const handleOpenAddSheet = async () => {
    try {
      setWishlistLoading(true);
      setBottomSheetOpen(true);

      // 전체 찜 목록 불러오기
      const response = await getWishlist({ page: 0, size: 100 });
      console.log("📋 전체 찜 목록:", response.data?.content);

      if (response.isSuccess && response.data) {
        // 이미 그룹에 추가된 항목 제외 (id 사용)
        const groupWishlistIds = group?.wishlists?.map((w) => w.id) || [];
        console.log("그룹에 이미 있는 ID들:", groupWishlistIds);

        const availableWishlists = response.data.content.filter(
          (item) => !groupWishlistIds.includes(item.id)
        );
        console.log("추가 가능한 찜 목록:", availableWishlists);
        setAllWishlists(availableWishlists);
      }
    } catch (error) {
      console.error("찜 목록 조회 실패:", error);
      alert("찜 목록을 불러오는데 실패했습니다.");
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleToggleWishlist = (wishlistId: number) => {
    setSelectedWishlistIds((prev) => {
      if (prev.includes(wishlistId)) {
        return prev.filter((id) => id !== wishlistId);
      } else {
        return [...prev, wishlistId];
      }
    });
  };

  const handleAddToGroup = async () => {
    if (selectedWishlistIds.length === 0) {
      alert("추가할 장소를 선택해주세요.");
      return;
    }

    try {
      console.log("그룹에 추가 시도:", {
        groupId,
        wishlistIds: selectedWishlistIds,
      });
      const response = await addWishlistToGroup(groupId, selectedWishlistIds);
      console.log("그룹에 추가 응답:", response);

      // 그룹 정보 다시 불러오기
      await fetchGroup();

      // 초기화
      setSelectedWishlistIds([]);
      setBottomSheetOpen(false);

      alert(`${selectedWishlistIds.length}개의 장소를 추가했습니다.`);
    } catch (error) {
      console.error("그룹에 추가 실패:", error);
      alert("그룹에 추가하는데 실패했습니다.");
    }
  };

  // WishlistInGroup을 WishlistItemData로 변환
  const wishlistItems: WishlistItemData[] =
    group?.wishlists?.map((item) => ({
      contentId: item.contentId,
      title: item.title,
      address: item.address,
      image: item.imageUrl,
    })) || [];

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="h-full flex flex-col">
        <div className="mx-8 mt-15">
          <BackHeader onBack={handleBack} label="그룹" />
          <div className="flex items-center justify-center py-10">
            <p className="text-gray-500">그룹을 찾을 수 없습니다.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* 스크롤 가능한 컨텐츠 영역 */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-8 pb-[calc(80px+env(safe-area-inset-bottom))]">
          <div className="mt-15">
            <BackHeader onBack={handleBack} label={group.name} />
          </div>

          {/* 그룹 정보 */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={group.categoryImageUrl}
                  alt={group.name}
                  className="w-16 h-16"
                />
                <div>
                  <h2 className="text-xl font-bold">{group.name}</h2>
                  <p className="text-sm text-gray-500">
                    {group.isPublic ? "공개" : "비공개"} / 장소{" "}
                    {wishlistItems.length}개
                  </p>
                </div>
              </div>

              {/* + 버튼 */}
              <button
                onClick={handleOpenAddSheet}
                className="w-12 h-12 rounded-full bg-[#00A3A5] text-white flex items-center justify-center shadow-lg hover:bg-[#008a8c] transition-colors"
                aria-label="찜 목록 추가"
              >
                <Plus size={24} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {/* 찜 목록 */}
          {wishlistItems.length === 0 ? (
            <div className="flex items-center justify-center py-10">
              <p className="text-gray-500">아직 추가된 장소가 없습니다.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {wishlistItems.map((item) => (
                <WishlistItem key={item.contentId} item={item} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 하단 고정 TabBar */}
      {isWide && <TabBar className="relative bottom-0 w-full z-30" />}
      {!isWide && <TabBar className="fixed bottom-0 left-0 w-full z-30" />}

      {/* 찜 목록 추가 BottomSheet */}
      <BottomSheet
        open={bottomSheetOpen}
        onOpenChange={setBottomSheetOpen}
        title="찜 목록 추가"
        height={600}
      >
        <div className="px-4 space-y-4">
          {wishlistLoading ? (
            <div className="flex items-center justify-center py-10">
              <p className="text-gray-500">로딩 중...</p>
            </div>
          ) : allWishlists.length === 0 ? (
            <div className="flex items-center justify-center py-10">
              <p className="text-gray-500">
                추가할 수 있는 찜 목록이 없습니다.
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {allWishlists.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleToggleWishlist(item.id)}
                    className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedWishlistIds.includes(item.id)
                        ? "border-[#00A3A5] bg-teal-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm">{item.title}</h3>
                      <p className="text-xs text-gray-500 truncate">
                        {item.address}
                      </p>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedWishlistIds.includes(item.id)
                          ? "border-[#00A3A5] bg-[#00A3A5]"
                          : "border-gray-300"
                      }`}
                    >
                      {selectedWishlistIds.includes(item.id) && (
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* 추가 버튼 */}
              <div className="pt-4 border-t">
                <PrimaryButton size="lg" onClick={handleAddToGroup}>
                  {selectedWishlistIds.length > 0
                    ? `${selectedWishlistIds.length}개 추가하기`
                    : "추가하기"}
                </PrimaryButton>
              </div>
            </>
          )}
        </div>
      </BottomSheet>
    </div>
  );
}
