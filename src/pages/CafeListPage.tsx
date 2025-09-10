import { useState } from "react";
import CafeListTemplate from "../components/templates/CafeListTemplate";
import type { CafeCardData } from "../components/molecules/CafeCard";
import { useRouter } from "@tanstack/react-router";

export default function CafeListPage() {
  const router = useRouter();
  const [distance, setDistance] = useState<"500m" | "1km" | "2km" | "4km">("500m");

  const cafes: CafeCardData[] = [
    {
      id: 1,
      title: "달빛 애견카페",
      star: "⭐⭐⭐⭐",
      image: "/Assets/images/cafe1.jpg",
      rating: 4.0,
      reviewCount: 25,
      address: "서울 마포구 월드펫로 25",
    },
    {
      id: 2,
      title: "멍멍멍멍",
      star: "⭐⭐⭐⭐⭐",
      image: "/Assets/images/cafe2.jpg",
      rating: 4.4,
      reviewCount: 25,
      address: "서울 마포구 월드펫로 25",
    },    
    {
      id: 3,
      title: "멍멍멍멍",
      star: "⭐⭐⭐⭐⭐",
      image: "/Assets/images/cafe2.jpg",
      rating: 4.4,
      reviewCount: 25,
      address: "서울 마포구 월드펫로 25",
    },
    {
      id: 4,
      title: "멍멍멍멍",
      star: "⭐⭐⭐⭐⭐",
      image: "/Assets/images/cafe2.jpg",
      rating: 4.4,
      reviewCount: 25,
      address: "서울 마포구 월드펫로 25",
    },
    {
      id: 5,
      title: "멍멍멍멍",
      star: "⭐⭐⭐⭐⭐",
      image: "/Assets/images/cafe2.jpg",
      rating: 4.4,
      reviewCount: 25,
      address: "서울 마포구 월드펫로 25",
    },
    {
      id: 6,
      title: "멍멍멍멍",
      star: "⭐⭐⭐⭐⭐",
      image: "/Assets/images/cafe2.jpg",
      rating: 4.4,
      reviewCount: 25,
      address: "서울 마포구 월드펫로 25",
    },
    {
      id: 7,
      title: "멍멍멍멍",
      star: "⭐⭐⭐⭐⭐",
      image: "/Assets/images/cafe2.jpg",
      rating: 4.4,
      reviewCount: 25,
      address: "서울 마포구 월드펫로 25",
    },
    {
      id: 8,
      title: "멍멍멍멍",
      star: "⭐⭐⭐⭐⭐",
      image: "/Assets/images/cafe2.jpg",
      rating: 4.4,
      reviewCount: 25,
      address: "서울 마포구 월드펫로 25",
    },
  ];

  return (
    <CafeListTemplate
      title="애견동반카페"
      onBack={() => router.history.back()}     // 혹은 router.navigate({ to: "/landing" })
      distanceLabel={distance}
      onDistanceClick={setDistance}
      cafes={cafes}
      onCafeClick={(id) => console.log("카페 클릭:", id)}
    />
  );
}