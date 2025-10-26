import { useRef, useState } from "react";
import Title from "../../components/atoms/Title";
import BackHeader from "../../components/molecules/BackHeader";
import PrimaryButton from "../../components/molecules/PrimaryButton";
import { post } from "../../api";
import useUserInfoStore from "../../store/userInfoStore";
import { useNavigate } from "@tanstack/react-router";
import axios from "axios";

export default function MakeCharacterPage() {
  const navigate = useNavigate();
  const { petAvatarId, setPetAvatarId, petImage, setPetImage } =
    useUserInfoStore();

  const [preview, setPreview] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [generatedBlob, setGeneratedBlob] = useState<Blob | null>(null); // 생성된 이미지 Blob 저장
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

    try {
      // axios를 직접 사용하여 Blob 응답 받기
      const res = await axios.post(
        "https://danyeowatdaeng.p-e.kr/api/pet-avatars/upload/transform",
        formData,
        {
          responseType: "blob",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      console.log("API 응답:", res);
      console.log("응답 데이터 (Blob):", res.data);
      console.log("Blob size:", res.data.size);
      console.log("Blob type:", res.data.type);

      // Blob이 비어있는지 확인
      if (res.data.size === 0) {
        throw new Error("서버에서 빈 이미지를 반환했습니다.");
      }

      // Blob URL 생성
      const url = URL.createObjectURL(res.data);
      console.log("생성된 Blob URL:", url);

      // Blob 저장 (나중에 서버에 전송하기 위해)
      setGeneratedBlob(res.data);

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
            try {
              // 생성된 캐릭터 이미지가 있으면 서버에 업로드
              if (generatedBlob) {
                const formData = new FormData();
                formData.append("file", generatedBlob, "pet-avatar.png");

                const uploadRes = await axios.post(
                  "https://danyeowatdaeng.p-e.kr/api/pet-avatars/upload",
                  formData,
                  {
                    headers: {
                      "Content-Type": "multipart/form-data",
                    },
                    withCredentials: true,
                  }
                );

                console.log("생성된 캐릭터 업로드 완료:", uploadRes.data);

                // 업로드 성공 후 다음 단계로
                if (uploadRes.data) {
                  navigate({ to: "/login/checkCharacter" });
                }
              } else {
                // 기본 아바타 선택
                const res = await post("/members/pet-avatar", {
                  petAvatarId: petAvatarId,
                });
                if (res.isSuccess) {
                  navigate({ to: "/login/checkCharacter" });
                }
              }
            } catch (error) {
              console.error("캐릭터 저장 실패:", error);
              alert("캐릭터 저장에 실패했습니다. 다시 시도해주세요.");
            }
          }}
        >
          선택
        </PrimaryButton>
      </div>
    </div>
  );
}
