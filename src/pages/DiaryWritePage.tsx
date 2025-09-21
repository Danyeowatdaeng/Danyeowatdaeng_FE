import { useRef, useState } from "react";
import axios from "axios";
import { useRouter } from "@tanstack/react-router";
import DiaryWriteTemplate from "../components/templates/DiaryWriteTemplate";
import type { DiaryCreateResponse } from "../api/diary";

export default function MyPetDiaryWritePage() {
  const router = useRouter();

  const [text, setText] = useState("");
  const [images, setImages] = useState<string[]>([]);

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
    e.currentTarget.value = "";
  };

  const handleRemoveImageAt = (idx: number) => {
    setImages((prev) => {
      const target = prev[idx];
      if (target?.startsWith("blob:")) URL.revokeObjectURL(target);
      return prev.filter((_, i) => i !== idx);
    });
  };

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!text.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    const derivedTitle = text.split("\n")[0].trim().slice(0, 60) || "무제";
    const first = images[0];
    const imageUrl = first && /^https?:\/\//i.test(first) ? first : "";

    try {
      setSubmitting(true);
      const res = await axios.post<DiaryCreateResponse>(
        "https://danyeowatdaeng.p-e.kr/api/mypet/diaries",
        {
          title: derivedTitle,
          content: text,
          imageUrl: imageUrl || undefined,
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      if (res.data?.isSuccess) {
        router.navigate({ to: "/mypet" });
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

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChangeFile}
      />
    </>
  );
}