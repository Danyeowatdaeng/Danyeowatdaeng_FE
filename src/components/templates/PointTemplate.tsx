// src/components/templates/PointTemplate.tsx
import { useEffect, useState } from "react";
import BackHeader from "../molecules/BackHeader";
import Label from "../atoms/Label";
import Button from "../atoms/Button";
import CouponList from "../organisms/profile/CouponList";
import type { Coupon } from "../organisms/profile/CouponList";

type Props = {
  onBack?: () => void;
  point: number;
  coupons: Coupon[];
  onDownloadAll?: () => void;
  onCouponClick?: (id: Coupon["id"]) => void;
  onCouponDownload?: (id: Coupon["id"]) => void;
};

export default function PointTemplate({
  onBack,
  point,
  coupons,
  onDownloadAll,
  onCouponClick,
  onCouponDownload,
}: Props) {
  const fmt = new Intl.NumberFormat("ko-KR");

  const [list, setList] = useState<Coupon[]>(coupons);

  useEffect(() => {
    setList(coupons);
  }, [coupons]);

  const handleDownloadOne = (id: Coupon["id"]) => {
    setList(prev =>
      prev.map(c => (c.id === id ? { ...c, disabled: true } : c))
    );
    onCouponDownload?.(id);
  };

  const handleDownloadAll = () => {
    const allDisabled = list.every(c => c.disabled);
    if (allDisabled) {
      alert("모든 쿠폰을 다운 받았습니다.");
      return;
    }

    setList(prev => prev.map(c => (c.disabled ? c : { ...c, disabled: true })));
    onDownloadAll?.();
  };

  return (
    <div className="min-h-dvh bg-[#F3F3F3]">
      {/* 헤더 */}
      <div className="px-6 pt-11 pb-1 bg-white">
        <BackHeader onBack={onBack} label="내 포인트" />
      </div>

      {/* 보유 포인트 카드 */}
      <section className="px-6 py-5">
        <div className="relative w-full bg-[#00A3A5] rounded-[20px] text-white px-6 py-5">
          <div className="text-[12px] opacity-90">보유 포인트</div>
          <div className="mt-2 flex items-baseline gap-2">
            <div className="text-[30px] leading-none font-extrabold">
              {fmt.format(point)}
            </div>
            <div className="text-[16px]">P</div>
          </div>
        </div>
      </section>

      {/* 구분선 */}
      <div className="px-6">
        <hr className="border-1 border-[#D9D9D9]" />
      </div>

      {/* 포인트 변환 + 전체 다운로드 버튼 */}
      <section className="px-6 pt-6">
        <Label content="포인트 변환" className="text-[20px] font-extrabold" />
        <Button
          onClick={handleDownloadAll}
          aria-label="쿠폰 모두 다운받기"
          className="mt-4 w-full h-[50px] rounded-[10px] bg-[#FF8A2B] text-white text-[16px] font-semibold"
        >
          쿠폰 모두 다운받기
        </Button>
      </section>

      {/* 쿠폰 리스트 */}
      <CouponList
        className="mt-1"
        items={list}
        onItemClick={onCouponClick}
        onDownloadClick={handleDownloadOne}
        ticketBgSrc="/Assets/icons/Ticket2.svg"
      />
    </div>
  );
}