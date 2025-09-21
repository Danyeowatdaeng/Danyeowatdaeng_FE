import { post } from "../../api";
import BackHeader from "../../components/molecules/BackHeader";
import PrimaryButton from "../../components/molecules/PrimaryButton";
import useUserInfoStore from "../../store/userInfoStore";

export default function CheckCharacterPage() {
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

          if (res.status === 200) {
            setIsLogin(true);
            window.location.href = "/";
          }
        }}
      >
        시작하기
      </PrimaryButton>
    </div>
  );
}
