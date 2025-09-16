import React from "react";
import MapArea from "../organisms/home/MapArea";
import CategoryGrid from "../molecules/CategoryGrid";
import type { CategoryItemProps } from "../molecules/CategoryItem";
import EventListSection from "../molecules/EventListSection";
import type { EventListItemData } from "../molecules/EventListItem";
import TabBar from "../molecules/TabBar";
import { useWebControlStore } from "../../store/webControlStore";

type Props = {
  categories: CategoryItemProps[];
  eventTitle: string; // "7월의 펫 이벤트"
  events: EventListItemData[]; // 리스트 아이템들
  onMoreEvents?: () => void; // 전체보기 버튼
  onEventClick?: (id: string | number) => void; // 리스트 아이템 클릭
};

export default function HomeLandingTemplate({
  categories,
  eventTitle,
  events,
  onMoreEvents,
  onEventClick,
}: Props) {
  const [mode, setMode] = React.useState<"browse" | "mapFocus">("browse");
  const mapExpanded = mode === "mapFocus";

  const handleMapTap = () => {
    setMode("mapFocus");
  };

  const handleMapBackdropTap = () => {
    setMode("browse");
  };
  const isWide = useWebControlStore((state) => state.isWide);
  return (
    <div className="min-h-full h-full flex flex-col relative">
      {/* 상단 Map */}
      <div className={mapExpanded ? "flex-1" : "h-fit"}>
        <MapArea
          expanded={mapExpanded}
          onTap={handleMapTap}
          onBackdropTap={handleMapBackdropTap}
        />
      </div>

      {/* 하단 컨텐츠 */}
      <div
        className={`relative bg-white 
                    h-[calc(100vh-300px)] w-fit
                    transition-all duration-100 ease-in-out
                    ${
                      mapExpanded
                        ? "opacity-0 translate-y-full invisible"
                        : "opacity-100 translate-y-0 visible"
                    }`}
      >
        <div className="h-full overflow-y-auto">
          <div className="px-4 pt-4">
            <CategoryGrid items={categories} />
          </div>
          <div className="px-6 pt-8 pb-[calc(4rem+env(safe-area-inset-bottom))]">
            <EventListSection
              title={eventTitle}
              items={events}
              onMore={onMoreEvents}
              onItemClick={onEventClick}
            />
          </div>
        </div>
      </div>
      {isWide && <TabBar className="sticky bottom-0 w-full z-30" />}
    </div>
  );
}
