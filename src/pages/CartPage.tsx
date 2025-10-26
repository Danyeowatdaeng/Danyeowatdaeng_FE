import { useEffect, useState } from "react";
import CartLayout from "../components/templates/CartLayout";
import { getWishlist, deleteWishlist, type WishlistItem } from "../api";
import type { CafeCardData } from "../components/molecules/category/CafeCard";

export default function CartPage() {
  const [wishlistItems, setWishlistItems] = useState<CafeCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await getWishlist({ page: 0, size: 20 });

      if (response.isSuccess && response.data) {
        // WishlistItem을 CafeCardData로 변환
        console.log(response.data.content);
        const transformedData: CafeCardData[] = response.data.content.map(
          (item: WishlistItem) => ({
            id: item.placeId,
            title: item.title,
            star: "4.5", // 기본값
            image: item.imageUrl || "",
            rating: 4.5,
            reviewCount: 0,
            address: item.address,
            latitude: 0,
            longitude: 0,
            phone: "",
            source: "wishlist",
            contentId: item.contentId,
          })
        );

        setWishlistItems(transformedData);
      }
    } catch (err) {
      console.error("찜 목록 조회 실패:", err);
      setError("찜 목록을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemoveItem = async (contentId: number) => {
    if (!window.confirm("찜하기를 취소하시겠습니까?")) {
      return;
    }

    try {
      await deleteWishlist(contentId);
      // 목록 다시 불러오기
      await fetchWishlist();
    } catch (err) {
      console.error("찜하기 삭제 실패:", err);
      alert("찜하기 취소에 실패했습니다.");
    }
  };

  return (
    <CartLayout
      wishlistItems={wishlistItems}
      loading={loading}
      error={error}
      onRemoveItem={handleRemoveItem}
    />
  );
}
