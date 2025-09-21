// src/components/templates/DiaryDetailTemplate.tsx
import BackHeader from "../molecules/BackHeader";
import Icon from "../atoms/Icon";

type Props = {
  image: string;
  content: string;
  avatarSrc?: string;
  onBack?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  deleting?: boolean;
};

export default function DiaryDetailTemplate({
  image,
  content,
  avatarSrc = "/Assets/icons/PetProfile1.svg",
  onBack,
  onEdit,
  onDelete,
  deleting,
}: Props) {
  return (
    <div className="p-6">
      <BackHeader onBack={onBack} label="마이펫 다이어리" />

      <img
        src={image}
        alt="다이어리 이미지"
        className="w-full h-[300px] rounded-xl object-cover mt-6"
      />

      {/* 아바타 + 액션 */}
      <div className="flex items-center gap-3 mt-5">
        <div className="w-11 h-11 rounded-full overflow-hidden bg-[#FF8E3C] grid place-items-center">
          <img src={avatarSrc} alt="" className="w-11 h-11 object-contain" />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button
            aria-label="수정"
            onClick={onEdit}
            className="w-9 h-9 grid place-items-center rounded-full bg-white border"
          >
            <Icon src="/Assets/icons/Edit.svg" alt="" aria-hidden className="w-4 h-4" />
          </button>
          <button
            aria-label="삭제"
            onClick={onDelete}
            disabled={deleting}
            className="w-9 h-9 grid place-items-center rounded-full bg-white border disabled:opacity-60"
          >
            <Icon src="/Assets/icons/Trash.svg" alt="" aria-hidden className="w-4 h-4" />
          </button>
        </div>
      </div>

      <p className="mt-4 text-[16px] text-[#333] whitespace-pre-line">
        {content}
      </p>
    </div>
  );
}