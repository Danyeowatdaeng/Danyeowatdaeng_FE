import { useEffect, useState } from "react";
import CartLayout from "../components/templates/CartLayout";
import { getWishlist, type WishlistItem } from "../api";
import type { CafeCardData } from "../components/molecules/category/CafeCard";

export default function CartPage() {
  const [wishlistItems, setWishlistItems] = useState<CafeCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setLoading(true);
        const response = await getWishlist({ page: 0, size: 20 });

        if (response.isSuccess && response.data) {
          // WishlistItem을 CafeCardData로 변환
          const transformedData: CafeCardData[] = response.data.content.map(
            (item: WishlistItem) => ({
              id: item.placeId,
              title: item.placeName,
              star: "4.5", // 기본값
              image: item.imageUrl || "",
              rating: 4.5,
              reviewCount: 0,
              address: item.address,
              latitude: 0,
              longitude: 0,
              phone: "",
              source: "wishlist",
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

    fetchWishlist();
  }, []);

  return (
    <CartLayout wishlistItems={wishlistItems} loading={loading} error={error} />
  );
}
