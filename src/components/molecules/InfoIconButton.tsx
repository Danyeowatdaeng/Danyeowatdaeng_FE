import Button from "../atoms/Button";
import Icon from "../atoms/Icon";

type Props = {
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
};

export default function InfoIconButton({
  onClick,
  className = "",
  ariaLabel = "정보",
}: Props) {
  return (
    <Button
      aria-label={ariaLabel}
      onClick={onClick}
      className={`grid place-items-center ${className}`}
    >
      <Icon
        src="/Assets/icons/Info.svg"
        alt=""
        aria-hidden
        className="w-[22px] h-[22px]"
      />
    </Button>
  );
}