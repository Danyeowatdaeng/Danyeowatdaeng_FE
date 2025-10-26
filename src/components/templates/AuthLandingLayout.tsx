import BackHeader from "../molecules/BackHeader";
import Icon from "../atoms/Icon";
import { SocialButton } from "../molecules/SocialButton";
import PrimaryButton from "../molecules/PrimaryButton";
import { testSignup } from "../../api/auth";
import { useRouter } from "@tanstack/react-router";

type AuthLandingTemplateProps = {
  onBack?: () => void;
  onKakao: () => void;
  onNaver: () => void;
  onGoogle: () => void;
  logo?: string; // 커스터마이즈 가능하게 슬롯으로
  loadingProvider?: "kakao" | "naver" | "google" | null;
};

export default function AuthLandingTemplate({
  onBack,
  onKakao,
  // onNaver,
  onGoogle,
  logo,
}: AuthLandingTemplateProps) {
  const router = useRouter();

  const handleTestSignup = async () => {
    try {
      const testEmail = "test@example.com";
      const testName = "평가용 테스트 계정";
      
      await testSignup(testEmail, testName);
      // 회원가입 성공 후 약관 동의 페이지로 이동
      router.navigate({ to: "/login/checkPermission" });
    } catch (error) {
      console.error("테스트 회원가입 실패:", error);
      alert("테스트 회원가입에 실패했습니다.");
    }
  };
  return (
    <div className="h-[100vh] p-10">
      <div className="">
        <BackHeader onBack={onBack} />
      </div>
      <div className="flex h-[45vh] flex-8 w-full items-center justify-center">
        <Icon src={logo} />
      </div>
      <div className="flex h-[40vh] flex-col gap-5 w-full mx-auto justify-start items-center">
        <SocialButton
          onClick={onKakao}
          provider="kakao"
          label="카카오톡으로 시작하기"
        />
        {/* <SocialButton
          onClick={onNaver}
          provider="naver"
          label="네이버로 시작하기"
        /> */}
        <SocialButton
          onClick={onGoogle}
          provider="google"
          label="구글로 시작하기"
        />
        <PrimaryButton
          variant="secondary"
          size="md"
          onClick={handleTestSignup}
        >
          <span className="font-bold text-[0.9rem] text-gray-700">평가용 테스트 계정 회원가입</span>
        </PrimaryButton>
      </div>
    </div>
  );
}
