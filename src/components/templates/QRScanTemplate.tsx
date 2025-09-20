// components/templates/QrScanTemplate.tsx
import BackHeader from "../../components/molecules/BackHeader";

type Props = {
  onBack?: () => void;
  videoRef: React.RefObject<HTMLVideoElement>;
  instruction?: string;
  onClose?: () => void;
  onManual?: () => void;
};

export default function QrScanTemplate({
  onBack,
  videoRef,
  instruction = "QR코드를 격자 안에 맞춰 스캔하세요",
  onClose,
  onManual,
}: Props) {
  return (
    <div className="relative w-full h-[100dvh] bg-[#E5E5E5]">
      <div className="px-4 pt-4">
        <BackHeader onBack={onBack} label="QR 스캔" />
      </div>

      {/* 상단 우측 버튼들 */}
      <div className="absolute top-4 right-4 flex gap-2">
        {onManual && <button onClick={onManual} className="px-3 py-1 rounded-full border text-sm bg-white/70">직접 입력</button>}
        {onClose && <button onClick={onClose} className="w-8 h-8 grid place-items-center rounded-md bg-white/70">×</button>}
      </div>

      {/* 카메라 미리보기 + 오버레이 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <video
          ref={videoRef}
          className="w-[88%] max-w-[560px] aspect-[3/4] rounded-2xl bg-black object-cover"
          playsInline
          muted
        />
        <div className="pointer-events-none absolute w-[80%] max-w-[520px] aspect-[1/1] rounded-3xl border-[8px] border-white/50" />
      </div>

      <p className="absolute bottom-[140px] left-1/2 -translate-x-1/2 text-[16px] text-black/80">
        {instruction}
      </p>
    </div>
  );
}