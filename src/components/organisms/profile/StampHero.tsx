// QR안내 + 카메라 버튼
import Button from "../../atoms/Button";
import Icon from "../../atoms/Icon";
import Label from "../../atoms/Label";

type Props = { onScan?: () => void; className?: string };

export default function StampHero({ onScan, className = "" }: Props) {
  return (
    <section className={["relative w-full text-white", className].join(" ")}>
      <div className="text-center">
        <Label content="QR 코드 찍고 스탬프 적립하자!" className="text-[18px] font-bold" />
      </div>

      {/* 우측 상단 근처에 둥근 버튼 */}
      <Button
        onClick={onScan}
        aria-label="스탬프 찍기"
        className="absolute right-6 top-18 grid h-[38px] w-[38px] place-items-center rounded-full bg-white"
      >
        <Icon src="/Assets/icons/CameraBlue.svg" alt="" aria-hidden />
      </Button>
    </section>
  );
}