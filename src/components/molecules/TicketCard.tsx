// src/components/molecules/TicketCard.tsx
import { useState } from "react"; // ⬅ 추가
import Button from "../atoms/Button";
import Label from "../atoms/Label";
import Icon from "../atoms/Icon";

type Props = {
  title: string;
  highlight: string;
  expires: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;

  onDownload?: () => void;
  downloadIcon?: string;           // 활성(주황) 아이콘
  downloadIconDisabled?: string;   // 비활성(회색) 아이콘
  downloadDisabled?: boolean;      // 부모가 강제 비활성화할 때

  backgroundSrc?: string;
};

export default function TicketCard({
  title,
  highlight,
  expires,
  onClick,
  disabled,
  className = "",
  onDownload,
  downloadIcon = "/Assets/icons/DownloadActive.svg",
  downloadIconDisabled = "/Assets/icons/Download.svg",
  downloadDisabled = false,
  backgroundSrc = "/Assets/icons/Ticket.svg",
}: Props) {
  const showDownload = typeof onDownload === "function";

  // ✅ 로컬 상태: 클릭하면 회색으로 바뀌도록 내부에서 관리
  const [downloaded, setDownloaded] = useState(false);

  // 부모 강제(disabled) 우선, 아니면 로컬 상태 사용
  const isDownloaded = downloadDisabled || downloaded;

  const handleDownload = () => {
    // 먼저 UI 즉시 반영 (주황 -> 회색)
    setDownloaded(true);
    // 부모 콜백 호출
    onDownload?.();
  };

  return (
    <div
      className={[
        "relative w-full h-[107px] select-none",
        "rounded-[16px] overflow-hidden",
        className,
      ].join(" ")}
    >
      {/* 티켓 배경 */}
      <Icon
        src={backgroundSrc}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full pointer-events-none select-none"
      />

      {/* 왼쪽(내용) 버튼 */}
      <Button
        onClick={onClick}
        disabled={disabled}
        aria-label={`${title} 쿠폰`}
        className={[
          "absolute inset-y-0 left-0",
          showDownload ? "right-[10px]" : "right-0",
          "px-10 text-left bg-transparent",
        ].join(" ")}
      >
        <Label content={title} className="text-[14px]" />
        <div className="text-[32px] font-extrabold leading-none text-[#00A3A5]">
          {highlight}
        </div>
        <Label content={`유효기간: ${expires}`} className="text-[12px] text-[#797979]" />
      </Button>

      {/* 오른쪽 다운로드 버튼 */}
      {showDownload && (
        <div className="absolute inset-y-0 right-0 w-[68px] flex items-center justify-center">
          <Button
            onClick={handleDownload}
            // 누른 뒤에도 다시 눌리게 할지 말지는 선택.
            // "한 번 받으면 비활성" 원하면 아래 줄을 true로 바꿔도 됨.
            // disabled={isDownloaded}
            aria-label="쿠폰 다운로드"
            className="h-[32px] w-[32px] flex items-center justify-center"
          >
            <Icon
              src={isDownloaded ? downloadIconDisabled : downloadIcon}
              alt=""
              aria-hidden
              className="h-7 w-7"
            />
          </Button>
        </div>
      )}
    </div>
  );
}