// src/pages/StampPage.tsx
import { useRouter } from "@tanstack/react-router";
import StampTemplate from "../components/templates/StampTemplate";
import type { StampItem } from "../components/organisms/profile/StampGrid";

export default function StampPage() {
  const router = useRouter();

  // 예시 12칸
  const items: StampItem[] = [
    { kind: "stamp", state: "active" },
    { kind: "stamp", state: "active" },
    { kind: "gift",  state: "rewarded", caption: "지급 완료" },

    { kind: "stamp", state: "active" },
    { kind: "stamp", state: "inactive" },
    { kind: "gift",  state: "inactive", caption: "쿠폰 지급" },

    { kind: "stamp", state: "inactive" },
    { kind: "stamp", state: "inactive" },
    { kind: "gift",  state: "inactive", caption: "쿠폰 지급" },

    { kind: "stamp", state: "inactive" },
    { kind: "stamp", state: "inactive" },
    { kind: "gift",  state: "inactive", caption: "쿠폰 지급" },
  ];

  return (
    <StampTemplate
      onBack={() => router.history.back()}
      onScan={() => console.log("QR 스캔")}
      items={items}
    />
  );
}