import HomeLandingTemplate from "../components/templates/HomeLandingTemplate";
import type { CategoryItemProps } from "../components/molecules/CategoryItem";
import type { EventListItemData } from "../components/molecules/EventListItem";
import { useRouter } from "@tanstack/react-router";
import { useMapSearch } from "../hooks/useMapSearch";

export default function HomeLandingPage() {
  const router = useRouter();

  // 축제 데이터 가져오기
  const { data: festivalData } = useMapSearch({
    category: "festival",
    distance: "2km",
    enabled: true,
  });

  // 카테고리
  const categories: CategoryItemProps[] = [
    {
      style: "",
      iconSrc: "/Assets/icons/categories/Suitcase.svg",
      label: "관광지",
      onClick: () => {
        router.navigate({
          to: "/landing/category/$category",
          params: { category: "tourist" },
        });
      },
    },
    {
      style: "",
      iconSrc: "/Assets/icons/categories/Building.svg",
      label: "숙박",
      onClick: () => {
        router.navigate({
          to: "/landing/category/$category",
          params: { category: "accommodation" },
        });
      },
    },
    {
      style: "",
      iconSrc: "/Assets/icons/categories/Sailboat.svg",
      label: "체험/레저",
      onClick: () => {
        router.navigate({
          to: "/landing/category/$category",
          params: { category: "experience" },
        });
      },
    },
    {
      style: "",
      iconSrc: "/Assets/icons/categories/Cutlery.svg",
      label: "음식점",
      onClick: () => {
        router.navigate({
          to: "/landing/category/$category",
          params: { category: "restaurant" },
        });
      },
    },
    {
      style: "",
      iconSrc: "/Assets/icons/categories/Coffee.svg",
      label: "카페",
      onClick: () => {
        router.navigate({
          to: "/landing/category/$category",
          params: { category: "cafe" },
        });
      },
    },
    {
      style: "",
      iconSrc: "/Assets/icons/categories/ShoppingCart.svg",
      label: "쇼핑",
      onClick: () => {
        router.navigate({
          to: "/landing/category/$category",
          params: { category: "shopping" },
        });
      },
    },
    {
      style: "",
      iconSrc: "/Assets/icons/categories/Dog.svg",
      label: "문화시설",
      onClick: () => {
        router.navigate({
          to: "/landing/category/$category",
          params: { category: "culture" },
        });
      },
    },
    {
      style: "",
      iconSrc: "/Assets/icons/categories/Confetti.svg",
      label: "공연/축제",
      onClick: () => {
        router.navigate({
          to: "/landing/category/$category",
          params: { category: "festival" },
        });
      },
    },
  ];

  // 축제 API 데이터를 EventListItemData 형식으로 변환
  const events: EventListItemData[] = festivalData
    .slice(0, 3)
    .map((festival) => ({
      id: festival.id,
      title: festival.title,
      tag: "축제",
      subtitle: festival.address,
      thumbnailSrc: festival.image,
    }));

  return (
    <HomeLandingTemplate
      categories={categories}
      eventTitle="7월의 펫 이벤트"
      events={events}
      onMoreEvents={() => {
        router.navigate({
          to: "/landing/category/$category",
          params: { category: "festival" },
        });
      }}
      onEventClick={(id) => console.log("아이템 클릭:", id)}
    />
  );
}
