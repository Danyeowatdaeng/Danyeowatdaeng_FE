import { useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import ProfileTemplate from "../components/templates/ProfileTemplate";
import { usePointStore } from "../store/pointStore"; // 👈 추가
import { getMemberInfo, type MemberInfo } from "../api";

export default function ProfilePage() {
  const router = useRouter();
  const point = usePointStore((s) => s.point); // 👈 전역 포인트 값
  const [memberInfo, setMemberInfo] = useState<MemberInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMemberInfo = async () => {
      try {
        setLoading(true);
        const response = await getMemberInfo();
        if (response.isSuccess && response.data) {
          setMemberInfo(response.data);
        }
      } catch (error) {
        console.error("회원 정보 조회 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMemberInfo();
  }, []);

  const goToCoupon = () => router.navigate({ to: "/profile/coupon" });
  const goToStamp  = () => router.navigate({ to: "/profile/stamp" });
  const goToPoint  = () => router.navigate({ to: "/profile/point" });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>로딩 중...</p>
      </div>
    );
  }

  return (
    <ProfileTemplate
      name={memberInfo?.nickname || memberInfo?.email || "USER01"}
      subtitle="지역, 반려동물 정보 등"
      imageSrc={memberInfo?.profileImageUrl || undefined}
      onInfo={() => console.log("프로필 가이드 클릭")}
      onEditAvatar={() => console.log("아바타 수정")}
      onClickCoupon={goToCoupon}
      point={point}     // 👈 전역 상태에서 읽은 값 전달
      stamp={4}
      onClickStamp={goToStamp}
      onClickPoint={goToPoint}
    />
  );
}