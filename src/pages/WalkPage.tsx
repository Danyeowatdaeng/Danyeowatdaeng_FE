import { useRef, useState } from "react";
import { useRouter } from "@tanstack/react-router";   // ✅ 추가
import WalkTemplate from "../components/templates/WalkTemplate";
import ConfirmModal from "../components/molecules/ConfirmModal";

export default function WalkPage() {
  const router = useRouter();                         // ✅ 추가
  const [image, setImage] = useState<string | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const onPick = () => fileRef.current?.click();
  const onRemove = () => setImage(undefined);
  const onFile: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setImage(url);
  };

  const submit = () => {
    if (!image) return;
    setOpen(true);
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
        onClose={() => setOpen(false)}
        onConfirm={() => {
          setOpen(false);
          // ✅ 일일퀘스트로 복귀하면서 'walk' 완료 표시
          router.navigate({ to: "/mypet/quest", search: { completed: "walk" } });
        }}
        title="산책하기 퀘스트 완료!"
        iconSrc="/Assets/icons/PawIconActive.svg"
        confirmLabel="확인"
      />
    </>
  );
}