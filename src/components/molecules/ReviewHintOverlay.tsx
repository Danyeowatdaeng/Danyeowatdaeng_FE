type Props = {
  open: boolean;
  message?: string;
  onClose?: () => void;
};

/** 지도 위에 1초 정도 뜨는 힌트 오버레이 */
export default function ReviewHintOverlay({
  open,
  message = "리뷰를 남길 장소를 선택해주세요",
  onClose,
}: Props) {
  return (
    <div
      className={[
        "fixed inset-0 z-[60] flex items-center justify-center transition-opacity duration-300",
        open ? "opacity-100" : "opacity-0 pointer-events-none",
      ].join(" ")}
      onClick={onClose}
    >
      {/* 살짝 어두워지는 배경 */}
      <div className="absolute inset-0 bg-black/20" />

      {/* 말풍선 카드 */}
      <div className="relative px-4 py-3 rounded-2xl bg-white shadow-lg flex items-center gap-3">
        <img
          src="/Assets/icons/PawIconActive.svg"
          alt=""
          aria-hidden
          className="w-6 h-6"
        />
        <span className="text-sm font-medium text-[#222] whitespace-nowrap">
          {message}
        </span>
      </div>
    </div>
  );
}