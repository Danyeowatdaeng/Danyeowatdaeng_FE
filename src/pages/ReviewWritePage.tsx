import { useParams, useSearch, useRouter } from "@tanstack/react-router";
import { useRef, useState } from "react";
import ReviewWriteTemplate from "../components/templates/ReviewWriteTemplate";

// 필요하면 Base64 인코딩 유틸
function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve((r.result as string) || "");
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

export default function ReviewWritePage() {
  const router = useRouter();
  const { placeId } = useParams({ strict: false }) as { placeId?: string };
  const { name } = useSearch({ from: "/place/$placeId/review" });

  const [text, setText] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const firstFileRef = useRef<File | undefined>(undefined);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const pendingIndexRef = useRef<number>(-1);

  const onPickImageAt = (idx: number) => {
    pendingIndexRef.current = idx;
    fileInputRef.current?.click();
  };

  const onFile: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setImages((prev) => {
      const next = [...prev];
      if (pendingIndexRef.current >= 0 && pendingIndexRef.current < next.length) {
        if (next[pendingIndexRef.current]?.startsWith("blob:")) {
          URL.revokeObjectURL(next[pendingIndexRef.current]);
        }
        next[pendingIndexRef.current] = url;
      } else {
        next.push(url);
      }
      return next;
    });
    if (!firstFileRef.current || pendingIndexRef.current === 0) {
      firstFileRef.current = f;
    }
    e.currentTarget.value = "";
  };

  const onRemoveImageAt = (idx: number) => {
    setImages((prev) => {
      const tgt = prev[idx];
      if (tgt?.startsWith("blob:")) URL.revokeObjectURL(tgt);
      const next = prev.filter((_, i) => i !== idx);
      if (idx === 0) firstFileRef.current = undefined;
      return next;
    });
  };

  const onSubmit = async () => {
    // TODO: 서버 API에 맞춰 전송 (placeId, 내용, 이미지 등)
    // 예: const imageUrl = firstFileRef.current ? await fileToDataUrl(firstFileRef.current) : undefined;
    // await axios.post("/api/reviews", { placeId, content: text, imageUrl })

    // 완료 후 퀘스트로 돌아가면서 'review' 완료 표시
    router.navigate({ to: "/mypet/quest", search: { completed: "review" } });
  };

  return (
    <>
      <ReviewWriteTemplate
        placeName={name ?? "리뷰 작성"}
        onBack={() => router.history.back()}
        text={text}
        onTextChange={setText}
        images={images}
        onPickImageAt={onPickImageAt}
        onRemoveImageAt={onRemoveImageAt}
        onSubmit={onSubmit}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onFile}
      />
    </>
  );
}