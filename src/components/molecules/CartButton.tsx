import React, { useState } from "react";
import Button from "../atoms/Button";
import StarIcon from "../atoms/Icon/StarIcon";
import { cn } from "../../utils/style";
import { addWishlist, addWishlistAtMap, deleteWishlist } from "../../api/index";

type CartButtonProps = {
  placeId?: number;
  contentTypeId?: number;
  title?: string;
  address?: string;
  imageUrl?: string;
  latitude?: number;
  longitude?: number;
  initialAdded?: boolean;
  map?: boolean;
  onWishlistAdded?: (contentId: number) => void; // 찜하기 추가 시 contentId 콜백
};

export default function CartButton({
  placeId,
  contentTypeId,
  title,
  address,
  imageUrl,
  latitude,
  longitude,
  initialAdded = false,
  map = false,
  onWishlistAdded,
}: CartButtonProps) {
  const [addCart, setAddCart] = useState(initialAdded);
  const [loading, setLoading] = useState(false);

  // initialAdded가 변경되면 상태 업데이트
  React.useEffect(() => {
    setAddCart(initialAdded);
  }, [initialAdded]);

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    // 필수 정보가 없으면 경고

    setLoading(true);

    try {
      if (addCart) {
        if (!placeId || !title || !address) {
          alert("장소 정보가 부족합니다.");
          return;
        }
        // 찜하기 삭제
        await deleteWishlist(placeId);
        setAddCart(false);
        console.log("찜하기 삭제 완료");
      } else {
        // 찜하기 추가
        let response;
        if (map) {
          response = await addWishlistAtMap({
            source: "map",
          });
        } else {
          response = await addWishlist({
            contentId: placeId || 0,
            contentTypeId: contentTypeId || 0,
            title: title || "",
            address: address || "",
            imageUrl: imageUrl || "",
            latitude: latitude || 0,
            longitude: longitude || 0,
          });
        }

        console.log("찜하기 추가 응답:", response);

        // 응답에서 contentId를 받아서 콜백 호출
        if (response.isSuccess && response.data?.contentId) {
          onWishlistAdded?.(response.data.contentId);
          console.log("찜하기 추가 완료, contentId:", response.data.contentId);
        }

        setAddCart(true);
      }
    } catch (error) {
      console.error("찜하기 API 오류:", error);
      alert("찜하기 처리에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      className={cn(
        "p-1 w-[85px] items-center justify-center h-[29px] flex border-1 rounded-3xl",
        addCart ? "border-[#00A3A5]" : "border-[#D9D9D9]",
        loading && "opacity-50 cursor-not-allowed"
      )}
      onClick={handleClick}
      disabled={loading}
    >
      <StarIcon className="mr-2" color={addCart ? "#00A3A5" : "#ABABAB"} />
      <div className={`${addCart ? "text-[#00A3A5]" : "text-[#ABABAB]"}`}>
        {loading ? "처리중..." : "찜하기"}
      </div>
    </Button>
  );
}
