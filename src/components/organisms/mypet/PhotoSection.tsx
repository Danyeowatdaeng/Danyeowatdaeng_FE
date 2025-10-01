import UploadFile from "../../molecules/UploadFile";

type Props = {
  images: string[];
  onPickAt: (idx: number) => void;
  onRemoveAt: (idx: number) => void;
  size?: "large" | "small"; // 사이즈 옵션
  className?: string;
};

export default function PhotoSection({
  images,
  onPickAt,
  onRemoveAt,
  size = "large", // 기본값은 큰 박스
  className = "",
}: Props) {
  // 사이즈별 스타일 지정
  const boxClass =
    size === "large"
      ? "w-full h-[270px] rounded-2xl"
      : "w-[120px] h-[120px] rounded-xl";

  return (
    <section className={className}>
      <div
        className={`${boxClass} bg-[#D9D9D9] overflow-hidden flex items-center justify-center`}
      >
        <UploadFile
          imageSrc={images[0]} // 이미지 없으면 플러스 버튼만
          onRemove={() => onRemoveAt(0)}
          onPick={() => onPickAt(0)}
          className="w-full h-full"
        />
      </div>
    </section>
  );
}