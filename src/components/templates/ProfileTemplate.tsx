import ProfileBox from "../organisms/profile/ProfileBox";
import Coupon from "../molecules/CouponButton";
import ProfileStats from "../organisms/profile/ProfileStats";
import TabBar from "../molecules/TabBar";
import { useWebControlStore } from "../../store/webControlStore";

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
        <ProfileStats point={point} stamp={stamp} />
      </div>
      {isWide && <TabBar className="relative bottom-0 w-full z-30" />}
    </div>
  );
}
