// src/pages/DiaryWritePage.tsx
import { useRef, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import axios from "axios";
import DiaryWriteTemplate from "../components/templates/DiaryWriteTemplate";

export default function DiaryWritePage() {
  const router = useRouter();

  const [text, setText] = useState("");
  const [images, setImages] = useState<string[]>([]); // preview 전용

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const pendingIndexRef = useRef<number>(-1);

  const handlePickAt = (idx: number) => {
    pendingIndexRef.current = idx;
    fileInputRef.current?.click();
  };

  const handleChangeFile: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setImages((prev) => {
      const next = [...prev];
      const i = pendingIndexRef.current;
      if (i >= 0 && i < prev.length) next[i] = url;
      else next.push(url);
      return next;
    });

    e.currentTarget.value = "";
  };

  const handleRemoveAt = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async () => {
    const trimmed = text.trim();
    if (!trimmed) {
      alert("내용을 입력해주세요.");
      return;
    }

    const title = trimmed.split("\n")[0].slice(0, 50);

    try {
      const res = await axios.post(
        "https://danyeowatdaeng.p-e.kr/api/mypet/diaries",
        {
          title,
          content: trimmed,
          // imageUrl: "https://업로드된이미지.url" (업로드 기능 붙이면 여기에 넣음)
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      if (res.status === 200 || res.status === 201) {
        router.navigate({ to: "/mypet/quest", search: { completed: "diary" }, replace: true });
      } else {
        alert("다이어리 작성에 실패했어요.");
      }
    } catch (e: any) {
      if (e?.response?.status === 401) {
        alert("로그인이 필요합니다.");
        router.navigate({ to: "/login" });
        return;
      }
      console.error("다이어리 작성 실패:", e?.response ?? e);
      alert(e?.response?.data?.message ?? "오류가 발생했어요.");
    }
  };

  return (
    <>
      <DiaryWriteTemplate
        onBack={() => router.history.back()}
        text={text}
        onTextChange={setText}
        images={images}
        onPickImageAt={handlePickAt}
        onRemoveImageAt={handleRemoveAt}
        onSubmit={handleSubmit}
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