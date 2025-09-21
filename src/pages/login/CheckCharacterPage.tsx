import { useNavigate } from "@tanstack/react-router";
import { post } from "../../api";
import BackHeader from "../../components/molecules/BackHeader";
import PrimaryButton from "../../components/molecules/PrimaryButton";
import useUserInfoStore from "../../store/userInfoStore";

export default function CheckCharacterPage() {
  const navigate = useNavigate();
  const { petAvatarId, petImage, setIsLogin } = useUserInfoStore();

  return (
    <div className="flex flex-col py-10 px-7 items-center justify-center gap-4">
      <BackHeader />
      <div>
        {!petImage && (
          <img
            src={`/Assets/icons/PetAvatar${petAvatarId}.svg`}
            alt="Pet Avatar"
          />
        )}
        {petImage ? (
          <img src={URL.createObjectURL(petImage)} alt="Pet Avatar" />
        ) : (
          "No image selected"
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
