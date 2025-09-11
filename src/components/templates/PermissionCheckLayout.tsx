import { cn } from "../../utils/style";

//components
import Title from "../atoms/Title";
import BackHeader from "../molecules/BackHeader";
import PrimaryButton from "../molecules/PrimaryButton";
import PermissionBox from "../organisms/login/PermissionBox";
interface CheckPermissionItemProps {
  onBack?: () => void;
  pageTitle: string;
  permissionList: { title: string; description: string }[];
  checkedList: boolean[];
  onChange: (index: number) => void;
  disabledList?: boolean[];
  handleSubmit: () => void;
}

export default function PermissionCheckLayout({
  onBack,
  pageTitle,
  permissionList,
  checkedList,
  onChange,
  disabledList,
  handleSubmit,
}: CheckPermissionItemProps) {
  return (
    <>
      <div className="p-10 gap-10 mx-auto">
        <BackHeader onBack={onBack} />
        <div>
          <Title className="mt-14">{pageTitle}</Title>
          <PermissionBox
            permissionList={permissionList}
            checkedList={checkedList}
            onChange={onChange}
            disabledList={disabledList}
          />
          <div
            className={cn(
              "transition-opacity duration-200 opacity-0 pointer-events-none fixed left-0 bottom-25 w-full px-10",
              {
                "opacity-100 pointer-events-auto": checkedList?.every((v) => v),
              }
            )}
          >
            <PrimaryButton onClick={handleSubmit} variant="primary" size="md">
              다음
            </PrimaryButton>
          </div>
        </div>
      </div>
    </>
  );
}
