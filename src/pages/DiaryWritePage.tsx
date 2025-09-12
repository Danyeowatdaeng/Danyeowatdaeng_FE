import { useRef, useState } from "react";
import DiaryWriteTemplate from "../components/templates/DiaryWriteTemplate";
import { useRouter } from "@tanstack/react-router";

export default function DiaryWritePage() {
  const router = useRouter();

  const [text, setText] = useState("");
  const [images, setImages] = useState<string[]>([]);

  // 하나의 숨김 input으로 모든 타일에서 재사용
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
      if (pendingIndexRef.current >= 0 && pendingIndexRef.current < prev.length) {
        next[pendingIndexRef.current] = url; // 교체
      } else {
        next.push(url); // 추가
      }
      return next;
    });

    // 동일 파일 또 선택하려면 value 초기화 필요
    e.currentTarget.value = "";
  };

  const handleRemoveAt = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = () => {
    console.log("제출!", { text, images });
    // 실제로는 API 호출 후 라우팅 등
    router.history.back();
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

      {/* 숨김 파일 입력 */}
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