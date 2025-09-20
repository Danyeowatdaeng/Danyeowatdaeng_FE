import Icon from "../../components/atoms/Icon";

type Variant = "filled" | "white";

type Props = {
  iconSrc: string;
  onClick?: () => void;
  variant?: Variant;     // filled = 컬러 배경, white = 흰 배경
  bgColor?: string;      // filled일 때 배경색
  ariaLabel?: string;
  className?: string;
};

export default function CameraFab({
  iconSrc,
  onClick,
  variant = "filled",
  bgColor = "#00A3A5",
  ariaLabel = "카메라 열기",
  className = "",
}: Props) {
  const base = "w-[64px] h-[64px] rounded-full grid place-items-center shadow-md active:scale-95 transition-transform";
  const ring = variant === "white" ? "ring-2 ring-[#00A3A5]/15" : "";
  const style = variant === "filled" ? { backgroundColor: bgColor, color: "#fff" } : { backgroundColor: "#fff", color: bgColor };

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      className={`${base} ${ring} ${className}`}
      style={style}
    >
      <Icon src={iconSrc} alt="" aria-hidden className="w-8 h-8" />
    </button>
  );
}