// QR안내 + 카메라 버튼
import Button from "../../atoms/Button";
import Icon from "../../atoms/Icon";
import Label from "../../atoms/Label";

type Props = { onScan?: () => void; className?: string };

export default function StampHero({ onScan, className = "" }: Props) {
  return (
    <section
      className={[
        "relative w-full text-white pb-12 px-6",
        className,
      ].join(" ")}
    >
      <div className="text-center">
        <Label content="QR 코드 찍고 스탬프 적립하자!" className="text-[20px] font-bold" />
      </div>

      <Button
        onClick={onScan}
        aria-label="스탬프 찍기"
        className="absolute right-6 top-16 grid h-[42px] w-[42px] place-items-center rounded-full bg-white"
      >
        <Icon src="/Assets/icons/CameraBlue.svg" alt="" aria-hidden />
      </Button>
    </section>
  );
}