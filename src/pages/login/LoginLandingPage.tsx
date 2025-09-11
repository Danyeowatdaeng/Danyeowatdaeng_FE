import AuthLandingTemplate from "../../components/templates/AuthLandingLayout";
import { useRouter } from "@tanstack/react-router";

export default function LoginLandingPage() {
  const router = useRouter();
  const onBack = () => router.history.go(-1);

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
