import { useNavigate } from "@tanstack/react-router";
import { post } from "../../api";
import BackHeader from "../../components/molecules/BackHeader";
import PrimaryButton from "../../components/molecules/PrimaryButton";
import Title from "../../components/atoms/Title";
import useUserInfoStore from "../../store/userInfoStore";

export default function CheckCharacterPage() {
  const navigate = useNavigate();
  const { petAvatarId, petImage, generatedCharacterImage, setIsLogin } = useUserInfoStore();

  return (
    <div className="flex flex-col py-10 px-7 items-center justify-center gap-4">
      <BackHeader onBack={() => navigate({ to: "/login/makeCharacter" })} />
      <Title className="mb-4">
        {generatedCharacterImage ? "생성된 캐릭터를 확인하세요" : "펫 아바타를 확인하세요"}
      </Title>
      <div>
        {generatedCharacterImage ? (
          <img
            src={generatedCharacterImage}
            alt="Generated Character"
            className="max-h-[300px] rounded-lg shadow-lg"
          />
        ) : !petImage ? (
          <img
            src={`/Assets/icons/PetAvatar${petAvatarId}.svg`}
            alt="Pet Avatar"
            className="max-h-[300px]"
          />
        ) : (
          <img 
            src={URL.createObjectURL(petImage)} 
            alt="Original Pet Image" 
            className="max-h-[300px] rounded-lg shadow-lg"
          />
        )}
      </div>
      <PrimaryButton
        onClick={async () => {
          const res = await post("/members/complete-signup", {
            petAvatarId: petAvatarId,
            petImage: petImage,
          });

          if (res.isSuccess === false) {
            alert("회원가입에 실패했습니다. 다시 시도해주세요.");
          }

          if (res.isSuccess) {
            setIsLogin(true);
            navigate({ to: "/" });
          }
        }}
      >
        시작하기
      </PrimaryButton>
    </div>
  );
}
