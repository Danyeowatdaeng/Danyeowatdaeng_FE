import { useRef, useState } from "react";
import Title from "../../components/atoms/Title";
import BackHeader from "../../components/molecules/BackHeader";
import PrimaryButton from "../../components/molecules/PrimaryButton";
import { post } from "../../api";
import useUserInfoStore from "../../store/userInfoStore";
import { useNavigate } from "@tanstack/react-router";

export default function MakeCharacterPage() {
  const navigate = useNavigate();
  const { petAvatarId, setPetAvatarId, petImage, setPetImage } =
    useUserInfoStore();

  const [preview, setPreview] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (
      file &&
      !["image/png", "image/jpeg", "image/webp"].includes(file.type)
    ) {
      alert("PNG, JPEG, WebP 파일만 업로드할 수 있습니다.");
      setPetImage(null);
      setPreview(null);
      setOriginalImage(null);
      return;
    }
    setPetImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        setPreview(dataUrl);
        setOriginalImage(dataUrl); // 원본 이미지 저장
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
      setOriginalImage(null);
    }
  };

  const handleUpload = async () => {
    if (!petImage) return alert("이미지를 선택해주세요");

    setIsGenerating(true);
    const formData = new FormData();
    formData.append("file", petImage);
    formData.append("key", "value");

    try {
      const res = await post(
        "https://danyeowatdaeng.p-e.kr/api/pet-avatars/transform-mypet",
        formData,
        { responseType: "blob", "Content-Type": "multipart/form-data" }
      );

      const maybeBlob = res?.data ?? res;
      const mimeFromBlob = maybeBlob?.type && String(maybeBlob.type);
      const mimeFromHeaders = res?.headers?.["content-type"]?.split(";")[0];
      const mime = mimeFromBlob || mimeFromHeaders || "image/png";

      const blob: Blob =
        maybeBlob instanceof Blob
          ? maybeBlob
          : new Blob([maybeBlob], { type: mime });

      const url = URL.createObjectURL(blob);
      setPreview((prev) => {
        if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
        return url;
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("캐릭터 생성에 실패했습니다. 다시 시도해주세요.");
      // 실패 시 원본 이미지로 복원
      setPreview(originalImage);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-h-full py-10 px-7 mx-auto min-h-dvh flex flex-col">
      <BackHeader />
      <div className="flex flex-col items-center flex-1 h-[30vh]">
        <Title className="w-fit px-auto mt-5">나의 펫을 선택하세요</Title>
        <div className="flex gap-6 mt-10 mx-10">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="w-21 h-21 rounded-full bg-gray-100 flex items-center justify-center shadow-md overflow-hidden"
            >
              <img
                onClick={() => setPetAvatarId(n)}
                src={`/Assets/character/PetProfile${n}.svg`}
                alt={`펫 아바타 ${n}`}
                className="w-full h-full object-contain"
              />
            </div>
          ))}
        </div>
        <div className="pt-10 flex flex-col items-center gap-2">
          <img
            className="max-h-[220px]"
            src={preview || `/Assets/icons/PetAvatar${petAvatarId}.svg`}
            alt="펫 아바타"
          />
        </div>
      </div>
      <div className="flex flex-col flex-1 gap-4 mb-12 justify-start">
        {!preview && (
          <>
            <PrimaryButton onClick={() => fileInputRef.current?.click()}>
              사진으로 나만의 캐릭터 생성하기
            </PrimaryButton>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleImageChange}
              hidden
            />
          </>
        )}
        {preview && (
          <PrimaryButton onClick={handleUpload} disabled={isGenerating}>
            {isGenerating ? "생성 중..." : "캐릭터로 변환하기"}
          </PrimaryButton>
        )}
        <PrimaryButton
          onClick={async () => {
            const res = await post("/members/pet-avatar", {
              petAvatarId: petAvatarId,
            });
            if (res.isSuccess) {
              navigate({ to: "/login/checkCharacter" });
            }
          }}
        >
          선택
        </PrimaryButton>
      </div>
    </div>
  );
}
