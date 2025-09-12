
type Props = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  maxLength?: number;
  className?: string;
};

export default function TextAreaBox({
  value,
  onChange,
  placeholder = "내용을 입력해주세요",
  maxLength = 1000,
  className = "",
}: Props) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className="w-full min-h-[140px] rounded-2xl bg-[#F3F3F3] px-5 py-4
                   text-[14px] placeholder:text-[#858585] outline-none"
      />
    </div>
  );
}