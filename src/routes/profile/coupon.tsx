import { createFileRoute } from "@tanstack/react-router";
import CouponPage from "../../pages/CouponPage";

export const Route = createFileRoute("/profile/coupon")({
  component: CouponPage,
});