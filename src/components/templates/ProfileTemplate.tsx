import ProfileBox from "../organisms/profile/ProfileBox";
import Coupon from "../molecules/CouponButton";
import ProfileStats from "../organisms/profile/ProfileStats";
import TabBar from "../molecules/TabBar";
import { useWebControlStore } from "../../store/webControlStore";
import Button from "../atoms/Button";
import Label from "../atoms/Label";

type Props = {
  // 프로필 박스
  name: string;
  subtitle?: string;
  imageSrc?: string;
  onInfo?: () => void;
  onEditAvatar?: () => void;

  // 쿠폰
  onClickCoupon?: () => void;

  // 스탯 박스
  point: number | string;
  stamp: number | string;
  onClickPoint?: () => void;
  onClickStamp?: () => void;

  // 로그아웃
  onLogout?: () => void;
};

export default function ProfileTemplate({
  name,
  subtitle,
  imageSrc,
  onInfo,
  onEditAvatar,
  onClickCoupon,
  point,
  stamp,
  onClickPoint,
  onClickStamp,
  onLogout,
}: Props) {
  const isWide = useWebControlStore((state) => state.isWide);

  return (
    <div className="flex flex-col justify-between h-full">
      <div className="p-6 my-5">
        {/* 프로필 박스 */}
        <ProfileBox
          name={name}
          subtitle={subtitle}
          imageSrc={imageSrc}
          onInfo={onInfo}
          onEditAvatar={onEditAvatar}
        />

        {/* 쿠폰 */}
        <div className="mt-12">
          <Coupon onClick={onClickCoupon} />
        </div>

        {/* Divider */}
        <hr className="my-8 border-[#D9D9D9]" />

        {/* 스탯 박스 */}
        <ProfileStats
          point={point}
          stamp={stamp}
          onClickPoint={onClickPoint}
          onClickStamp={onClickStamp}
        />

        {/* 로그아웃 버튼 */}
        {onLogout && (
          <Button
            onClick={onLogout}
            className="w-full h-[45px] mt-6 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center"
          >
            <Label content="로그아웃" className="text-[15px] font-medium" />
          </Button>
        )}
      </div>

      {isWide && <TabBar className="relative bottom-0 w-full z-30" />}
    </div>
  );
}