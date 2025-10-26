import { useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import ProfileTemplate from "../components/templates/ProfileTemplate";
import { usePointStore } from "../store/pointStore"; // 👈 추가
import useUserInfoStore from "../store/userInfoStore";

export default function ProfilePage() {
  const router = useRouter();
  const point = usePointStore((s) => s.point); // 👈 전역 포인트 값
  const [isInitialized, setIsInitialized] = useState(false);
  const { setIsLogin, memberInfo, isLoadingUserInfo, isLogin } = useUserInfoStore();

  const goToCoupon = () => router.navigate({ to: "/profile/coupon" });
  const goToStamp  = () => router.navigate({ to: "/profile/stamp" });
  const goToPoint  = () => router.navigate({ to: "/profile/point" });

  useEffect(() => {
    // 로그인 상태이고 사용자 정보가 로드되었을 때만 초기화
    if (isLogin && !isLoadingUserInfo && memberInfo) {
      setIsInitialized(true);
    }
  }, [isLogin, isLoadingUserInfo, memberInfo]);

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

  // 로딩 조건을 더 명확하게 설정
  const shouldShowLoading = isLoadingUserInfo || (isLogin && !memberInfo) || !isInitialized;

  if (shouldShowLoading) {
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
        memberInfo?.petAvatarCdnUrl 
          ? `https://${memberInfo.petAvatarCdnUrl}` 
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