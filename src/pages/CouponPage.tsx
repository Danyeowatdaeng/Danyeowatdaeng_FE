import { useRouter } from "@tanstack/react-router";
import CouponTemplate from "../components/templates/CouponTemplate";

export default function CouponPage() {
  const router = useRouter();

  const coupons = [
    { id: 1, title: "음료 무료 쿠폰", highlight: "FREE", expires: "~2025.09.30" },
    { id: 2, title: "반려견 미용 할인쿠폰", highlight: "10%", expires: "~2025.09.30" },
    { id: 3, title: "음료 무료 쿠폰", highlight: "20%", expires: "~2025.09.30" },
    { id: 4, title: "음료 무료 쿠폰", highlight: "FREE", expires: "~2025.09.30" },
    { id: 5, title: "펫호텔 할인권", highlight: "10%", expires: "~2025.09.30" },
  ];

  return (
    <CouponTemplate
      coupons={coupons}
      onBack={() => router.history.back()}
    />
  );
}