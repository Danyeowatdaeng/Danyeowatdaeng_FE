import Label from "../../atoms/Label";
import UploadFile from "../../molecules/UploadFile";

type Props = {
  images: string[];
  onPickAt: (idx: number) => void;
  onRemoveAt: (idx: number) => void;
  className?: string;
  title?: string;
};

export default function PhotoSection({
  images,
  onPickAt,
  onRemoveAt,
  className = "",
  title = "사진 등록",
}: Props) {
  return (
    <section className={className}>
      <Label content={title} className="text-[14px] text-[#858585] mb-3" />
      <div className="flex flex-wrap gap-4">
        {/* 첫 타일 */}
        {images.map((src, i) => (
          <UploadFile
            key={i}
            imageSrc={src}
            onRemove={() => onRemoveAt(i)}
            onPick={() => onPickAt(i)}
          />
        ))}

        {/* 추가 타일 (최대 6장) */}
        {images.length < 6 && (
          <UploadFile onPick={() => onPickAt(images.length)} />
        )}
      </div>
    </section>
  );
}