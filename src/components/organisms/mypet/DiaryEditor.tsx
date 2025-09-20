import TextAreaBox from "../../molecules/TextAreaBox";
import PhotoSection from "./PhotoSection";
import CTAButton from "../../atoms/CTAButton";

type Props = {
  text: string;
  onTextChange: (v: string) => void;

  images: string[];
  onPickImageAt: (idx: number) => void;
  onRemoveImageAt: (idx: number) => void;

  /** ✅ 펫 프로필과 연동될 캐릭터 아이콘 */
  avatarSrc?: string;

  onSubmit?: () => void;
  className?: string;
};

export default function DiaryEditor({
  text,
  onTextChange,
  images,
  onPickImageAt,
  onRemoveImageAt,
  avatarSrc,
  onSubmit,
  className = "",
}: Props) {
  return (
    <div className={`flex flex-col ${className}`}>
      {/* 1) 상단 대표 사진 업로드 */}
      <PhotoSection
        images={images}
        onPickAt={onPickImageAt}
        onRemoveAt={onRemoveImageAt}
      />
      
      {/* 캐릭터 아이콘(프로필 연동) */}
      <div className="w-[56px] h-[56px] rounded-full bg-[#FF8E3C] grid place-items-center overflow-hidden mt-8">
        <img
          src={avatarSrc}
          alt="pet avatar"
          className="w-[56px] h-[56px] object-contain"
        />
      </div>
      
      <TextAreaBox
        value={text}
        onChange={onTextChange}
        placeholder="내용을 입력해주세요"
        className="mt-3"
      />


      <CTAButton 
        onClick={onSubmit}
        label="완료"
        className="mt-6"
      />
        
    </div>
  );
}