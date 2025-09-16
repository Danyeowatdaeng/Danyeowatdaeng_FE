import { useRouter } from "@tanstack/react-router";
import ProfileTemplate from "../components/templates/ProfileTemplate";

export default function ProfilePage() {
  const router = useRouter();

  const goToCoupon = () => router.navigate({ to: "/profile/coupon" });
  const goToStamp  = () => router.navigate({ to: "/profile/stamp" });
  const goToPoint  = () => router.navigate({ to: "/profile/point" });

  return (
    <ProfileTemplate
      name="USER01"
      subtitle="지역, 반려동물 정보 등"
      onInfo={() => console.log("프로필 가이드 클릭")}
      onEditAvatar={() => console.log("아바타 수정")}
      onClickCoupon={goToCoupon}
      point={12345}
      stamp={4}
      onClickStamp={goToStamp}
      onClickPoint={goToPoint}
    />
  );
}