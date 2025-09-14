import TextAreaBox from "../../molecules/TextAreaBox";
import PhotoSection from "./PhotoSection";
import Button from "../../atoms/Button";

type Props = {
  text: string;
  onTextChange: (v: string) => void;

  images: string[];
  onPickImageAt: (idx: number) => void;
  onRemoveImageAt: (idx: number) => void;

  onSubmit?: () => void;
  className?: string;
};

export default function DiaryEditor({
  text,
  onTextChange,
  images,
  onPickImageAt,
  onRemoveImageAt,
  onSubmit,
  className = "",
}: Props) {
  return (
    <div className={`flex flex-col gap-8 ${className}`}>
      <TextAreaBox
        value={text}
        onChange={onTextChange}
        placeholder="내용을 입력해주세요 (최소 20자)"
      />


      {/* 보더 */}
      <hr className="border-1 border-[#EFEFEF] -mx-6" />

      <PhotoSection
        images={images}
        onPickAt={onPickImageAt}
        onRemoveAt={onRemoveImageAt}
      />

      <Button
        onClick={onSubmit}
        className="mt-4 h-[49px] rounded-xl bg-[#00A3A5] text-white text-[16px]"
      >
        등록하기
      </Button>
    </div>
  );
}