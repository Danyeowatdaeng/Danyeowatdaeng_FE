// organisms/home/MapArea.tsx
import { memo } from "react";
import SearchBar from "../../molecules/SearchBar";
import KakaoMap from "./KakaoMap";

type MapAreaProps = {
  expanded: boolean;
  onTap: () => void;
  onBackdropTap: () => void;
};

function MapArea({ expanded, onTap, onBackdropTap }: MapAreaProps) {
  return (
    <div
      className={`
        relative w-full 
        transition-[height,margin] duration-1200 ease-in-out
        ${expanded ? "h-screen mb-0" : "h-56 mb-14"}
      `}
      onClick={expanded ? undefined : onTap}
    >
      {/* 실제 지도 SDK 붙이는 자리 */}
      <KakaoMap expanded={expanded} />

      {/* 검색바 */}
      <div
        className={`
          z-10 w-full px-5 transition-all duration-1200 ease-in-out
          ${expanded ? "absolute -translate-y-[95vh]" : "absolute -translate-y-1/2"}
        `}
      >
        <SearchBar onFocus={onTap} />
      </div>
      {expanded && (
        <>
          <button
            aria-label="닫기"
            onClick={onBackdropTap}
            className="absolute top-4 left-4 rounded-full bg-white/80 px-3 py-1"
          >
            닫기
          </button>
        </>
      )}
    </div>
  );
}

export default memo(MapArea);
