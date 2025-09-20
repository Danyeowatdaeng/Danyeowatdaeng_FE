import { useState } from "react";
import Label from "../../atoms/Label";
import Button from "../../atoms/Button";
import AvatarPicker from "../../molecules/AvatarPicker";
import LabeledClearInput from "../../molecules/LabeledClearInput";

type Props = {
  avatarSrc?: string;
  name: string;
  subtitle: string;
  avatarOptions?: string[];
  onUploadAvatar?: () => void;
  onSave?: (data: { avatar?: string; name: string; subtitle: string }) => void;
  className?: string;
};

export default function PetEditForm({
  avatarSrc,
  name,
  subtitle,
  avatarOptions = [
    "/Assets/icons/PetProfile1.svg",
    "/Assets/icons/PetProfile2.svg",
  ],
  onUploadAvatar,
  onSave,
  className = "",
}: Props) {
  const [avatar, setAvatar] = useState<string | undefined>(avatarSrc);
  const [nickname, setNickname] = useState(name);
  const [feature, setFeature] = useState(subtitle);

  return (
    <div className={`flex flex-col ${className}`}>
      {/* 타이틀 */}
      <div className="text-center">
        <Label content="마이펫" className="text-[17px] font-bold" />
      </div>

      {/* 아바타 선택 */}
      <AvatarPicker
        className="mt-6"
        value={avatar}
        options={avatarOptions}
        onChange={setAvatar}
        onUpload={onUploadAvatar}
        size={138}
        thumbSize={58}
      />

      {/* 이름 */}
      <LabeledClearInput
        className="mt-10"
        label="이름"
        value={nickname}
        onChange={setNickname}
      />

      {/* 특징 */}
      <LabeledClearInput
        className="mt-8"
        label="특징"
        value={feature}
        onChange={setFeature}
      />

      {/* 저장 */}
      <Button
        onClick={() => onSave?.({ avatar, name: nickname, subtitle: feature })}
        className="mt-10 w-full rounded-full bg-[#00A3A5] py-4 text-white"
      >
        저장하기
      </Button>
    </div>
  );
}