import Icon from "../atoms/Icon";
import PrimaryButton from "./PrimaryButton";

type Provider = "kakao" | "naver" | "google";

type SocialButtonProps = {
  provider: Provider;
  label: React.ReactNode; // 버튼 라벨
} & React.ComponentPropsWithoutRef<"button">;

export function SocialButton({ provider, label, ...rest }: SocialButtonProps) {
  return (
    <PrimaryButton variant="primary" size="md" {...rest}>
      {provider === "kakao" && <Icon />}
      {provider === "naver" && <Icon />}
      {provider === "google" && <Icon />}
      <span className="font-bold text-[0.9rem] text-white">{label}</span>
    </PrimaryButton>
  );
}
