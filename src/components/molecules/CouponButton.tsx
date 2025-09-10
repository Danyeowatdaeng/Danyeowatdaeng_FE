import Button from "../atoms/Button";
import Icon from "../atoms/Icon";
import Label from "../atoms/Label";

type Props = {
  text?: string;
  onClick?: () => void;
  className?: string;
};

export default function CouponButton({
  text = "내 쿠폰함",
  onClick,
  className = "",
}: Props) {
  return (
    <Button
      onClick={onClick}
      className={`w-[174px] h-[45px] mx-auto rounded-full bg-[#00A3A5] text-white
                  flex items-center justify-center gap-2.5 px-4 ${className}`}
    >
      <Icon
        src="/Assets/icons/Coupon.svg"
        alt=""
        aria-hidden
        className="w-[24px] h-[24px]"
      />
      <Label content={text} className="text-[15px]" />
    </Button>
  );
}