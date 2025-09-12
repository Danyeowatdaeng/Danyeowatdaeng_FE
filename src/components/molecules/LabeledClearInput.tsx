import Label from "../atoms/Label";
import Input from "../atoms/Input";
import Button from "../atoms/Button";
import { X } from "lucide-react";

type Props = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
};

export default function LabeledClearInput({
  label,
  value,
  onChange,
  placeholder,
  className = "",
  inputClassName = "",
}: Props) {
  return (
    <div className={`px-2 ${className}`}>
      <Label content={label} className="text-[15px] text-[#858585]" />
      <div className="relative mt-3">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full bg-transparent pr-8 text-[15px] outline-none px-2 ${inputClassName}`}
        />
        {!!value && (
          <Button
            aria-label={`${label} 지우기`}
            onClick={() => onChange("")}
            className="absolute right-0 top-1 grid h-5 w-5 place-items-center text-gray-400 mx-1"
          >
            <X className="h-3 w-3" aria-hidden />
          </Button>
        )}
      </div>
      <div className="mt-2 h-px w-full bg-gray-300" />
    </div>
  );
}