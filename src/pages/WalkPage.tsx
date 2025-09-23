// src/pages/WalkPage.tsx  (Base64 업로드 + 응답 콘솔 확인)

import { useRef, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import axios from "axios";
import WalkTemplate from "../components/templates/WalkTemplate";
import ConfirmModal from "../components/molecules/ConfirmModal";

// 서버 응답 타입(스웨거 예시 기반)
type WalkCreateResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  data: {
    id: number;
    imageUrl: string;
    createdAt: string;
    updatedAt: string;
  };
  success: boolean;
};

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve((r.result as string) || "");
    r.onerror = reject;
    r.readAsDataURL(file); // "data:<mime>;base64,...."
  });
}

export default function WalkPage() {
  const router = useRouter();

  // 미리보기 / 실제 업로드 파일
  const [preview, setPreview] = useState<string | undefined>();
  const [file, setFile] = useState<File | undefined>();

  // 확인 모달
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);

  const onPick = () => fileRef.current?.click();

  const onRemove = () => {
    if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    setPreview(undefined);
    setFile(undefined);
  };

  const onFile: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f)); // 로컬 미리보기
    e.currentTarget.value = ""; // 같은 파일 재선택 허용
  };

  const submit = () => {
    if (!file) {
      alert("산책 사진을 등록해주세요.");
      return;
    }
    setOpen(true);
  };

  const handleConfirm = async () => {
    if (!file) return;

    try {
      setSubmitting(true);

      // Base64(Data URL)로 변환
      const dataUrl = await fileToDataUrl(file);
      // 서버가 순수 Base64만 받으면 아래 주석 사용
      // const imageUrl = dataUrl.split(",")[1];
      const imageUrl = dataUrl;

      const res = await axios.post<WalkCreateResponse>(
        "https://danyeowatdaeng.p-e.kr/api/walk",
        { imageUrl },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      // ✅ 콘솔에서 응답 확인
      console.log("POST /api/walk status:", res.status);
      console.log("POST /api/walk data:", res.data);

      if (!res.data?.isSuccess) {
        alert("서버에서 실패를 반환했어요.");
        return;
      }

      setOpen(false);
      // 일일 퀘스트 화면으로 복귀하며 완료 플래그 전달
      router.navigate({ to: "/mypet/quest", search: { completed: "walk" } });
    } catch (e: any) {
      if (axios.isAxiosError(e)) {
        console.error(
          "산책 기록 등록 실패:",
          e.response?.status,
          e.response?.data ?? e.message
        );
      } else {
        console.error("산책 기록 등록 실패:", e);
      }
      alert("산책 기록 등록에 실패했어요. 잠시 후 다시 시도해주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <WalkTemplate
        onBack={() => router.history.back()}
        image={preview}
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