// src/pages/MyPetDiaryWritePage.tsx
import { useRef, useState } from "react";
import axios from "axios";
import { useRouter } from "@tanstack/react-router";
import DiaryWriteTemplate from "../components/templates/DiaryWriteTemplate";
import ConfirmModal from "../components/molecules/ConfirmModal";
import type { DiaryCreateResponse } from "../api/diary";

// 파일 → Data URL(Base64) 인코딩
function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string) || "");
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function MyPetDiaryWritePage() {
  const router = useRouter();

  const [text, setText] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [firstFile, setFirstFile] = useState<File | undefined>(undefined);
  const [submitting, setSubmitting] = useState(false);

  // 저장 성공 시 표시할 모달
  const [open, setOpen] = useState(false);

  // 숨김 파일 입력
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const pendingIndexRef = useRef<number>(-1);

  const handlePickImageAt = (idx: number) => {
    pendingIndexRef.current = idx;
    fileInputRef.current?.click();
  };

  const handleChangeFile: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setImages((prev) => {
      const next = [...prev];
      if (pendingIndexRef.current >= 0 && pendingIndexRef.current < prev.length) {
        URL.revokeObjectURL(prev[pendingIndexRef.current]);
        next[pendingIndexRef.current] = url;
      } else {
        next.push(url);
      }
      return next;
    });

    // 대표 이미지는 0번으로 간주
    if (!firstFile || pendingIndexRef.current === 0) {
      setFirstFile(file);
    }
    e.currentTarget.value = "";
  };

  const handleRemoveImageAt = (idx: number) => {
    setImages((prev) => {
      const target = prev[idx];
      if (target?.startsWith("blob:")) URL.revokeObjectURL(target);
      const next = prev.filter((_, i) => i !== idx);
      if (idx === 0) setFirstFile(undefined);
      return next;
    });
  };

  const handleSubmit = async () => {
    if (!text.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    const derivedTitle = text.split("\n")[0].trim().slice(0, 60) || "무제";

    // 대표 이미지 Base64/Data URL
    let imageUrl: string | undefined;
    if (firstFile) {
      try {
        const dataUrl = await fileToDataUrl(firstFile);
        imageUrl = dataUrl; // 필요 시 dataUrl.split(",")[1] 만 보내도록 변경
      } catch {
        console.warn("이미지 인코딩 실패 — 이미지 없이 전송합니다.");
      }
    }

    try {
      setSubmitting(true);

      const res = await axios.post<DiaryCreateResponse>(
        "https://danyeowatdaeng.p-e.kr/api/mypet/diaries",
        { title: derivedTitle, content: text, imageUrl },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      if (res.data?.isSuccess) {
        // 바로 이동하지 말고 모달 먼저 열기
        setOpen(true);
      } else {
        alert("저장에 실패했습니다. 쿠키/크로스사이트 추적 설정을 확인해주세요.");
      }
    } catch (err) {
      console.error("다이어리 작성 실패:", err);
      alert("저장 중 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <DiaryWriteTemplate
        onBack={() => router.history.back()}
        text={text}
        onTextChange={setText}
        images={images}
        onPickImageAt={handlePickImageAt}
        onRemoveImageAt={handleRemoveImageAt}
        onSubmit={submitting ? undefined : handleSubmit}
      />

      {/* 숨김 파일 입력 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChangeFile}
      />

      {/* 저장 성공 모달 */}
      <ConfirmModal
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={() => {
          setOpen(false);
          // 일일퀘스트로 이동 + 다이어리 완료 표시
          router.navigate({ to: "/mypet/quest", search: { completed: "diary" } });
        }}
        title="다이어리 퀘스트 완료!"
        iconSrc="/Assets/icons/PawIconActive.svg"
        confirmLabel="확인"
      />
    </>
  );
}