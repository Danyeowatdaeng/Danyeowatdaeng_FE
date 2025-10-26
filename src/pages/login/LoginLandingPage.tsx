import { useEffect } from "react";
import AuthLandingTemplate from "../../components/templates/AuthLandingLayout";
import { useRouter } from "@tanstack/react-router";

export default function LoginLandingPage() {
  const router = useRouter();
  const onBack = () => router.history.go(-1);

  // OAuth 에러 처리
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get("error");

    if (error === "oauth_failed") {
      alert("로그인에 실패했습니다. 다시 시도해주세요.");
      // 에러 파라미터 제거
      window.history.replaceState({}, "", "/login");
    }
  }, []);

  const checkSignin = (social: string) => {
    window.location.href = `https://danyeowatdaeng.p-e.kr/oauth2/authorization/${social}`;
  };
  const onNaver = () => {
    checkSignin("naver");
  };
  const onKakao = () => {
    checkSignin("kakao");
  };
  const onGoogle = () => {
    checkSignin("google");
  };
  return (
    <AuthLandingTemplate
      onBack={onBack}
      onNaver={onNaver}
      onKakao={onKakao}
      onGoogle={onGoogle}
      logo="/Assets/icons/Logo.svg"
    />
  );
}
