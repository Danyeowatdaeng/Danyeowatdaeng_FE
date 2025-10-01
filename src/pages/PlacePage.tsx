import { useEffect, useState } from "react";
import MapArea from "../components/organisms/home/MapArea";
import ReviewHintOverlay from "../components/molecules/ReviewHintOverlay";

export default function PlacePage() {
  const [expanded, setExpanded] = useState(true);     // 지도는 풀스크린으로 시작
  const [showHint, setShowHint] = useState(true);     // ✅ 진입 시 힌트 on

  // ✅ 1초 뒤 자동 닫힘
  useEffect(() => {
    if (!showHint) return;
    const t = setTimeout(() => setShowHint(false), 1000);
    return () => clearTimeout(t);
  }, [showHint]);

  // 지도 탭/드래그 등 사용자 액션 시 힌트 닫고 지도 상호작용 허용
  const dismissHint = () => setShowHint(false);

  return (
    <div className="relative w-full h-full">
      <MapArea
        expanded={expanded}
        onTap={() => {
          dismissHint();
          setExpanded(true);
        }}
        onBackdropTap={() => {
          dismissHint();
          setExpanded(false);
        }}
      />

      {/* ✅ 힌트 오버레이 (1초간 노출 또는 사용자가 탭하면 즉시 닫힘) */}
      <ReviewHintOverlay open={showHint} onClose={dismissHint} />
    </div>
  );
}