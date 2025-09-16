import BackHeader from "../molecules/BackHeader";
import CouponList from "../organisms/profile/CouponList";

type Coupon = {
  id: string | number;
  title: string;
  highlight: string;
  expires: string;
};

type Props = {
  onBack?: () => void;
  coupons: Coupon[];
};

export default function CouponTemplate({ onBack, coupons }: Props) {
  return (
    <div className="h-dvh flex flex-col ">
      {/* 헤더 (고정) */}
      <div className="mt-11 px-6 pt-[env(safe-area-inset-top)] flex-none">
        <BackHeader onBack={onBack} label="내 쿠폰함" />
      </div>

      {/* 리스트 영역 (스크롤) */}
      <div className="flex-1 min-h-0 overflow-y-auto mb-25 pb-[env(safe-area-inset-bottom)]">
        <CouponList items={coupons} />
      </div>
    </div>
  );
}