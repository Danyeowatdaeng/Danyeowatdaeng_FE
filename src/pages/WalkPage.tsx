import { useRef, useState } from "react";
import WalkTemplate from "../components/templates/WalkTemplate";
import ConfirmModal from "../components/molecules/ConfirmModal";

export default function WalkPage() {
  const [image, setImage] = useState<string | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const onPick = () => fileRef.current?.click();
  const onRemove = () => setImage(undefined);

  const onFile: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f); // 그대로 유지(간단 버전)
    setImage(url);
  };

  const submit = () => {
    if (!image) return;       // 이미지 없으면 무시
    setOpen(true);            // ✅ 완료 모달 열기
  };

  return (
    <>
      <WalkTemplate
        onBack={() => history.back()}
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

      {/* ✅ 재사용 모달 */}
      <ConfirmModal
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={() => {
          setOpen(false);
          history.back();       // ← 직전 화면(일일퀘스트)으로 복귀
        }}
        title="산책하기 퀘스트 완료!"
        iconSrc="/Assets/icons/PawIconActive.svg"
        confirmLabel="확인"
      />
    </>
  );
}