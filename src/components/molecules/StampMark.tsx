import Button from "../atoms/Button";
import Icon from "../atoms/Icon";
import Label from "../atoms/Label";

type State = "active" | "inactive" | "rewarded"; // rewarded = 지급 완료(오렌지)
type Kind = "stamp" | "gift";

type Props = {
  kind: Kind;
  state: State;
  caption?: string;          // "지급 완료", "쿠폰 지급" 등
  onClick?: () => void;
  className?: string;
  size?: number;             // 아이콘 크기(px), 기본 112
};

export default function StampMark({
  kind,
  state,
  caption,
  onClick,
  className = "",
  size = 79,
}: Props) {
  const isGift = kind === "gift";
  const active = state === "active" || state === "rewarded";

  const iconSrc = (() => {
    if (isGift) return active ? "/Assets/icons/GiftStampActive.svg" : "/Assets/icons/GiftStamp.svg";
    return active ? "/Assets/icons/DogStampActive.svg" : "/Assets/icons/DogStamp.svg";
  })();

  return (
    <div className={["flex flex-col items-center", className].join(" ")}>
      <Button
        onClick={onClick}
        aria-label={isGift ? "선물" : "스탬프"}
        className="p-0 bg-transparent rounded-full active:scale-[.98]"
        style={{ width: size, height: size }}
      >
        {/* 아이콘만 표시 */}
        <Icon src={iconSrc} alt="" aria-hidden style={{ width: size, height: size }} />
      </Button>

      {caption ? (
        <Label
          content={caption}
          className={[
            "mt-2 text-[16px] font-bold",
            state === "rewarded" ? "text-[#FF8A00]" : "text-[#9B9B9B]",
          ].join(" ")}
        />
      ) : null}
    </div>
  );
}