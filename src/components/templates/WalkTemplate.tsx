import BackHeader from "../../components/molecules/BackHeader";
import UploadFile from "../../components/molecules/UploadFile";
import CTAButton from "../../components/atoms/CTAButton";
import Icon from "../../components/atoms/Icon";

type Props = {
  title?: string;
  onBack?: () => void;

  /** 상태와 핸들러는 Page에서 주입 */
  image?: string;
  onPick: () => void;
  onRemove: () => void;
  onSubmit?: () => void;

  inactiveIconSrc: string;
  activeIconSrc: string;

  className?: string;
};

export default function WalkTemplate({
  title = "산책하기",
  onBack,
  image,
  onPick,
  onRemove,
  onSubmit,
  inactiveIconSrc,
  activeIconSrc,
  className = "",
}: Props) {
  const active = !!image;

  return (
    <div className={`p-6 my-5 ${className}`}>
      <BackHeader onBack={onBack} label={title} />

      {/* 안내 아이콘 + 문구 */}
      <div className="w-full flex flex-col items-center mt-10 mb-4 ">
        <Icon
          src={active ? activeIconSrc : inactiveIconSrc}
          alt=""
          aria-hidden
          className="w-6 h-6"
        />
        <p className={`mt-2 text-[18px]  ${active ? "text-[#222]" : "text-[#9CA3AF]"}`}>
          산책한 사진을 첨부해주세요
        </p>
      </div>

      {/* 큰 업로드 영역 */}
      <div className="w-full h-[270px] rounded-2xl bg-[#D9D9D9] overflow-hidden mt-8">
        <UploadFile
          imageSrc={image}
          onPick={onPick}
          onRemove={onRemove}
          className="w-full h-full"
        />
      </div>

      {/* CTA 버튼 */}
      <div className="mt-25">
        <CTAButton
          label="완료"
          onClick={() => active && onSubmit?.()}
          bgColor={active ? "#00A3A5" : "#BDBDBD"}
          textColor="#FFFFFF"
          className={`${active ? "" : "pointer-events-none opacity-60"}`}
        />
      </div>
    </div>
  );
}