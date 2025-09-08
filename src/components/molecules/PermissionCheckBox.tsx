import { ChevronRight } from "lucide-react";
import Label from "../atoms/Label";
import CheckBox from "../atoms/CheckBox";

type CheckPermissionItemProps = {
  id: string;
  title: string;
  desc?: string;
  checked?: boolean; // controlled
  defaultChecked?: boolean; // uncontrolled
  onClick?: (next: boolean) => void;
  disabled?: boolean;
};

export default function CheckPermissionItem({
  id,
  title,
  desc,
  checked,
  defaultChecked,
  onClick,
  disabled,
}: CheckPermissionItemProps) {
  return (
    <label
      htmlFor={id}
      className={`flex justify-baseline items-start gap-4 px-5 py-4
                 cursor-pointer select-none
                 transition hover:bg-[#ececec]
                 ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <CheckBox
        id={id}
        checked={checked}
        defaultChecked={defaultChecked}
        onChange={onClick}
        disabled={disabled}
      />
      <div className="flex-1">
        <Label
          content={title}
          className="text-[#444444] text-[14px] text-lg font-normal"
        />
        {desc && (
          <Label content={desc} className="mt-1 text-[11px] text-[#858585]" />
        )}
      </div>
      <ChevronRight
        onClick={undefined}
        className="mt-1 h-5 w-5 text-gray-400"
      />
    </label>
  );
}
