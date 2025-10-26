import { useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import ProfileTemplate from "../components/templates/ProfileTemplate";
import { usePointStore } from "../store/pointStore"; // 👈 추가
import { getMemberInfo, type MemberInfo } from "../api";
import useUserInfoStore from "../store/userInfoStore";

export default function ProfilePage() {
  const router = useRouter();
  const point = usePointStore((s) => s.point); // 👈 전역 포인트 값
  const { setIsLogin, petAvatarCdnUrl, setPetAvatarCdnUrl } = useUserInfoStore();
  const [memberInfo, setMemberInfo] = useState<MemberInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMemberInfo = async () => {
      try {
        setLoading(true);
        const response = await getMemberInfo();
        if (response.isSuccess && response.data) {
          setMemberInfo(response.data);
          // 전역 상태에 petAvatarCdnUrl 저장
          setPetAvatarCdnUrl(response.data.petAvatarCdnUrl);
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

  const handleLogout = () => {
    if (window.confirm("로그아웃하시겠습니까?")) {
      // 쿠키 삭제
      document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      // 로그인 상태 업데이트
      setIsLogin(false);
      // 로그인 페이지로 이동
      router.navigate({ to: "/login" });
    }
  };

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
      imageSrc={
        petAvatarCdnUrl 
          ? `https://${petAvatarCdnUrl}` 
          : memberInfo?.profileImageUrl || undefined
      }
      onInfo={() => console.log("프로필 가이드 클릭")}
      onEditAvatar={() => console.log("아바타 수정")}
      onClickCoupon={goToCoupon}
      point={point}     // 👈 전역 상태에서 읽은 값 전달
      stamp={4}
      onClickStamp={goToStamp}
      onClickPoint={goToPoint}
      onLogout={handleLogout}
    />
  );
}