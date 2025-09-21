// src/pages/WalkPage.tsx
import { useRef, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import axios from "axios";
import WalkTemplate from "../components/templates/WalkTemplate";
import ConfirmModal from "../components/molecules/ConfirmModal";

export default function WalkPage() {
  const router = useRouter();

  const [image, setImage] = useState<string | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);

  const onPick = () => fileRef.current?.click();
  const onRemove = () => {
    if (image?.startsWith("blob:")) URL.revokeObjectURL(image);
    setImage(undefined);
  };

  const onFile: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f); // 미리보기용
    setImage(url);
    // 같은 파일 다시 선택 가능하도록 초기화
    e.currentTarget.value = "";
  };

  const submit = () => {
    if (!image) {
      alert("산책 사진을 등록해주세요.");
      return;
    }
    setOpen(true);
  };

  // ✅ API 호출 후 완료 처리
  const handleConfirm = async () => {
    try {
      setSubmitting(true);

      // 서버 스펙: { imageUrl: string }
      // blob: URL은 서버가 접근할 수 없으므로 http(s)로 시작할 때만 전달
      const imageUrl =
        image && /^https?:\/\//i.test(image) ? image : undefined;

      await axios.post(
        "https://danyeowatdaeng.p-e.kr/api/walk",
        { imageUrl }, // 없으면 필드만 비우고 전달
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      setOpen(false);

      // ✅ 일일 퀘스트로 복귀하면서 'walk' 완료 플래그 전달
      router.navigate({
        to: "/mypet/quest",
        search: { completed: "walk" },
      });
    } catch (e) {
      console.error("산책 기록 등록 실패:", e);
      alert("산책 기록 등록에 실패했어요. 잠시 후 다시 시도해주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <WalkTemplate
        onBack={() => router.history.back()}
        image={image}
        onPick={onPick}
        onRemove={onRemove}
        onSubmit={submit}
        inactiveIconSrc="/Assets/icons/PawIconInactive.svg"
        activeIconSrc="/Assets/icons/PawIconActive.svg"
      />

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onFile}
      />

      <ConfirmModal
        open={open}
        onClose={() => (!submitting ? setOpen(false) : null)}
        onConfirm={submitting ? () => {} : handleConfirm}
        title="산책하기 퀘스트 완료!"
        iconSrc="/Assets/icons/PawIconActive.svg"
        confirmLabel={submitting ? "전송 중..." : "확인"}
      />
    </>
  );
}