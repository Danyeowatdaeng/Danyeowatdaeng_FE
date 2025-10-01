import HomeLandingTemplate from "../components/templates/HomeLandingTemplate";
import type { CategoryItemProps } from "../components/molecules/CategoryItem";
import type { EventListItemData } from "../components/molecules/EventListItem";
import { useRouter } from "@tanstack/react-router";

export default function HomeLandingPage() {
  const router = useRouter();

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

  // 이벤트 리스트 더미 데이터
  const events: EventListItemData[] = [
    {
      id: 1,
      title: "해피독 여름 물놀이 축제",
      tag: "축제",
      subtitle: "경기도 가평군 청평면 물빛로 123",
      thumbnailSrc: "/Assets/images/event1.jpg",
    },
    {
      id: 2,
      title: "펫스파 힐링데이",
      tag: "스파",
      subtitle: "서울 강남구 반려로 45",
      thumbnailSrc: "/Assets/images/event2.jpg",
    },
  ];

  return (
    <HomeLandingTemplate
      categories={categories}
      eventTitle="7월의 펫 이벤트"
      events={events}
      onMoreEvents={() => console.log("전체보기 클릭")}
      onEventClick={(id) => console.log("아이템 클릭:", id)}
    />
  );
}
