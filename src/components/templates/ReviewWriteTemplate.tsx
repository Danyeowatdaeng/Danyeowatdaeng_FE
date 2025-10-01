// src/components/templates/ReviewWriteTemplate.tsx
import BackHeader from "../molecules/BackHeader";
import PhotoSection from "../organisms/mypet/PhotoSection";
import TextAreaBox from "../molecules/TextAreaBox";
import CTAButton from "../atoms/CTAButton";

type Props = {
  // 상단
  placeName?: string;
  onBack?: () => void;

  // 본문
  text: string;
  onTextChange: (v: string) => void;

  // 사진
  images: string[];
  onPickImageAt: (idx: number) => void;
  onRemoveImageAt: (idx: number) => void;

  // 완료
  onSubmit?: () => void;

  className?: string;
};

export default function ReviewWriteTemplate({
  placeName = "리뷰 작성",
  onBack,
  text,
  onTextChange,
  images,
  onPickImageAt,
  onRemoveImageAt,
  onSubmit,
  className = "",
}: Props) {
  return (
    <div className={`p-6 my-5 ${className}`}>
      <BackHeader onBack={onBack} label={placeName} />

      {/* 내용 */}
      <TextAreaBox
        value={text}
        onChange={onTextChange}
        placeholder="내용을 입력해주세요 (최소 ?자)"
        className="mt-6"
      />

      {/* 구분선 */}
      <hr className="my-6 border-[#ECECEC]" />

      {/* 섹션 타이틀 */}
      <p className="text-[#8C8C8C] text-[14px] mb-3">사진 등록</p>

      {/* 사진 등록 (컴팩트 사이즈) */}
      <PhotoSection
        images={images}
        onPickAt={onPickImageAt}
        onRemoveAt={onRemoveImageAt}
        className="mt-0"
        size="small"
      />

      <CTAButton label="완료" onClick={onSubmit} className="mt-8" />
    </div>
  );
}