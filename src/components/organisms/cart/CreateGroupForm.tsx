import { useState } from "react";
import Input from "../../atoms/Input";
import Button from "../../atoms/Button";
import PrimaryButton from "../../molecules/PrimaryButton";
import Icon from "../../atoms/Icon";

type CreateGroupFormProps = {
  onSubmit: (data: { name: string; icon: string; isPublic: boolean }) => void;
};

export default function CreateGroupForm({ onSubmit }: CreateGroupFormProps) {
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupIcon, setNewGroupIcon] = useState("");
  const [isPublic, setIsPublic] = useState(false); // false = 비공개, true = 공개
  const selected = "bg-[#00A3A5] text-white text-sm rounded-4xl px-4 h-8";
  const unselected =
    "border border-gray-300 bg-white text-gray-700 text-sm rounded-4xl px-4 h-8";
  const handleSubmit = () => {
    if (!newGroupName.trim()) {
      alert("그룹 이름을 입력해주세요.");
      return;
    }
    if (!newGroupIcon) {
      alert("아이콘을 선택해주세요.");
      return;
    }

    onSubmit({
      name: newGroupName,
      icon: newGroupIcon,
      isPublic,
    });

    // 폼 초기화
    setNewGroupName("");
    setNewGroupIcon("");
    setIsPublic(false);
  };

  return (
    <div className="px-4 space-y-4">
      {/* 공개 범위 */}
      <div className="flex justify-between items-center">
        <label className="block text-sm font-semibold mb-2 text-[#858585]">
          공개 범위
        </label>
        <div className="flex gap-2">
          <Button
            className={`${isPublic ? selected : unselected}`}
            onClick={() => setIsPublic(true)}
          >
            공개
          </Button>
          <Button
            className={`${!isPublic ? selected : unselected}`}
            onClick={() => setIsPublic(false)}
          >
            비공개
          </Button>
        </div>
      </div>

      {/* 이름 입력 */}
      <div>
        <label className="block text-sm font-semibold mb-2 text-[#858585]">
          이름
        </label>
        <Input
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
          placeholder="ex) 여행"
          className="w-full px-4 py-2 border-b border-gray-300"
        />
      </div>

      {/* 아이콘 선택 */}
      <div>
        <label className="block text-sm font-semibold mb-2 text-[#858585]">
          아이콘
        </label>
        <div className="grid grid-cols-4 gap-4">
          {[
            { name: "Suitcase", label: "관광지" },
            { name: "Building", label: "숙박" },
            { name: "Sailboat", label: "체험" },
            { name: "Cutlery", label: "음식점" },
            { name: "Coffee", label: "카페" },
            { name: "ShoppingCart", label: "쇼핑" },
            { name: "Dog", label: "문화" },
            { name: "Confetti", label: "축제" },
          ].map((icon) => (
            <button
              key={icon.name}
              onClick={() => setNewGroupIcon(icon.name)}
              className={`w-full aspect-square flex items-center justify-center rounded-xl border-2 p-2 ${
                newGroupIcon === icon.name
                  ? "border-teal-500 bg-teal-50"
                  : "border-gray-200 "
              }`}
            >
              <Icon
                src={`/Assets/icons/categories/${icon.name}.svg`}
                alt={icon.label}
                width={40}
                height={40}
              />
            </button>
          ))}
        </div>
      </div>

      {/* 저장 버튼 */}
      <div className="pt-4">
        <PrimaryButton size="lg" onClick={handleSubmit}>
          저장
        </PrimaryButton>
      </div>
    </div>
  );
}
