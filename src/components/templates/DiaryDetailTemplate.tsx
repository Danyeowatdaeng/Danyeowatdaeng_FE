import BackHeader from "../molecules/BackHeader";
import PhotoSection from "../organisms/mypet/PhotoSection";
import TextAreaBox from "../molecules/TextAreaBox";
import CTAButton from "../atoms/CTAButton";
import Button from "../atoms/Button";
import Icon from "../atoms/Icon";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  onBack?: () => void;

  // 콘텐츠
  text: string;
  onTextChange: (v: string) => void;
  images: string[];
  onPickImageAt: (idx: number) => void;
  onRemoveImageAt: (idx: number) => void;

  // 프로필 아이콘
  avatarSrc?: string;

  // 액션
  isEditing: boolean;
  onToggleEdit: () => void;
  onDelete: () => void;
  onSubmit: () => void;

  // 네비게이션
  onPrev?: () => void;
  onNext?: () => void;
  canPrev?: boolean;
  canNext?: boolean;

  className?: string;
};

export default function DiaryDetailTemplate({
  onBack,
  text,
  onTextChange,
  images,
  onPickImageAt,
  onRemoveImageAt,
  avatarSrc,
  isEditing,
  onToggleEdit,
  onDelete,
  onSubmit,
  onPrev,
  onNext,
  canPrev = false,
  canNext = false,
  className = "",
}: Props) {
  return (
    <div className={`p-6 my-5 ${className}`}>
      {/* 헤더 */}
      <BackHeader onBack={onBack} label="마이펫 다이어리" />

      {/* 에디터 영역 */}
      <div className="flex-1 mt-8">
        <PhotoSection
          images={images}
          onPickAt={isEditing ? onPickImageAt : () => {}}
          onRemoveAt={isEditing ? onRemoveImageAt : () => {}}
        />

        {/* 아바타 + 수정/삭제 아이콘 */}
        <div className="mt-6 flex items-center justify-between">
          {/* 펫 프로필 */}
          <div className="w-[56px] h-[56px] rounded-full bg-[#FF8E3C] grid place-items-center overflow-hidden">
            {avatarSrc && (
              <img
                src={avatarSrc}
                alt="pet avatar"
                className="w-[56px] h-[56px] object-contain"
              />
            )}
          </div>

          {/* 수정/삭제 버튼 */}
          <div className="flex items-center gap-3">
            <Button
              onClick={onToggleEdit}
              aria-label="수정"
              className="w-[32px] h-[32px] rounded-full border border-gray-300 grid place-items-center active:scale-95 transition"
            >
              <Icon src="/Assets/icons/Edit2.svg" alt="수정 아이콘" className="w-[24px] h-[24px]" />
            </Button>

            <Button
              onClick={onDelete}
              aria-label="삭제"
              className="w-[32px] h-[32px] rounded-full border border-gray-300 grid place-items-center active:scale-95 transition"
            >
              <Icon src="/Assets/icons/Delete.svg" alt="삭제 아이콘" className="w-[24px] h-[24px]" />
            </Button>
          </div>
        </div>

        {/* 텍스트 입력 */}
        <TextAreaBox
          value={text}
          onChange={onTextChange}
          placeholder="내용을 입력해주세요"
          className="mt-3"
          readOnly={!isEditing}
        />

        {/* 편집 중일 때만: 변경 사항 저장 버튼 노출 */}
        {isEditing && (
          <CTAButton
            onClick={onSubmit}
            label="변경 사항 저장"
            className="mt-6"
          />
        )}
      </div>

      {/* 보기 모드일 때만: 이전/다음 버튼 노출 */}
      {!isEditing && (
        <div className="flex items-center justify-between mt-8">
          <Button
            onClick={onPrev}
            disabled={!canPrev}
            aria-label="이전"
            className="w-[36px] h-[36px] rounded-full grid place-items-center disabled:opacity-40 active:scale-95 transition"
          >
            <ChevronLeft className="w-[20px] h-[20px] text-gray-500" />
          </Button>
          <Button
            onClick={onNext}
            disabled={!canNext}
            aria-label="다음"
            className="w-[36px] h-[36px] rounded-full grid place-items-center disabled:opacity-40 active:scale-95 transition"
          >
            <ChevronRight className="w-[20px] h-[20px] text-gray-500" />
          </Button>
        </div>
      )}
    </div>
  );
}