import BackHeader from "../molecules/BackHeader";
import DiaryEditor from "../organisms/mypet/DiaryEditor";

type Props = {
  onBack?: () => void;

  text: string;
  onTextChange: (v: string) => void;

  images: string[];
  onPickImageAt: (idx: number) => void;
  onRemoveImageAt: (idx: number) => void;

  onSubmit?: () => void;
};

export default function DiaryWriteTemplate({
  onBack,
  text,
  onTextChange,
  images,
  onPickImageAt,
  onRemoveImageAt,
  onSubmit,
}: Props) {
  return (
    <div className="p-6 my-5">
      {/* 헤더 */}
      <BackHeader onBack={onBack} label="마이펫 다이어리" />

      {/* 에디터 */}
      <div className="flex-1 mt-10">
        <DiaryEditor
          text={text}
          onTextChange={onTextChange}
          images={images}
          onPickImageAt={onPickImageAt}
          onRemoveImageAt={onRemoveImageAt}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
}