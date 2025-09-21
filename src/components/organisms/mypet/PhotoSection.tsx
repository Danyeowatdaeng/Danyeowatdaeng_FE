import UploadFile from "../../molecules/UploadFile";

type Props = {
  images: string[];
  onPickAt: (idx: number) => void;
  onRemoveAt: (idx: number) => void;
  className?: string;
};

export default function PhotoSection({
  images,
  onPickAt,
  onRemoveAt,
  className = "",
}: Props) {
  return (
    <section className={className}>
      {/* 한 개의 큰 박스 (정사각형 느낌) */}
      <div className="w-full h-[270px] rounded-2xl bg-[#D9D9D9] overflow-hidden">
        <UploadFile
          imageSrc={images[0]}          // 이미지가 없으면 플러스 버튼만 보임
          onRemove={() => onRemoveAt(0)}
          onPick={() => onPickAt(0)}
          className="w-full h-full"      // 내부 업로드 컴포넌트를 꽉 채우기
        />
      </div>
    </section>
  );
}