import BackHeader from "../molecules/BackHeader";
import Icon from "../atoms/Icon";
import { SocialButton } from "../molecules/SocialButton";

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
      </div>
    </div>
  );
}
