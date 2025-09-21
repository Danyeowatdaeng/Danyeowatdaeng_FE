import { useRouter } from "@tanstack/react-router";
import PointTemplate from "../components/templates/PointTemplate";
import type { Coupon } from "../components/organisms/profile/CouponList";
import { usePointStore } from "../store/pointStore"; // 👈 추가

export default function PointsPage() {
  const router = useRouter();
  const point = usePointStore((s) => s.point); // 👈 전역 포인트 값

  // 더미 데이터
  const coupons: Coupon[] = [
    { id: 1, title: "음료 무료쿠폰", highlight: "FREE", expires: "~2025.09.30" },
    { id: 2, title: "반려견 미용 할인쿠폰", highlight: "10%", expires: "~2025.09.30" },
    { id: 3, title: "음료 무료 쿠폰", highlight: "20%", expires: "~2025.09.30", disabled: true },
  ];

  return (
    <PointTemplate
      onBack={() => router.history.back()}
      point={point}
      coupons={coupons}
      onDownloadAll={() => alert("모두 다운로드!")}
      onCouponClick={(id) => console.log("쿠폰 클릭:", id)}
      onCouponDownload={(id) => console.log("쿠폰 다운로드:", id)}
    />
  );
}