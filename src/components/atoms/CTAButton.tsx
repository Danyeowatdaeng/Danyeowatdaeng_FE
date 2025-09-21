type CTAButtonProps = {
  label: string;
  bgColor?: string;
  textColor?: string;
  onClick?: () => void;
  className?: string;
};

export default function SimpleButton({
  label,
  bgColor = "#00A3A5",  // 기본색
  textColor = "#FFFFFF",// 기본 텍스트 색
  onClick,
  className = "",
}: CTAButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full h-[49px] rounded-xl font-semibold
        flex items-center justify-center
        ${className}
      `}
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      {label}
    </button>
  );
}