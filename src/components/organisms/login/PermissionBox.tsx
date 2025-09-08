import CheckPermissionItem from "../../molecules/PermissionCheckBox";

type CheckPermissionItemProps = {
  permissionList: { title: string; description: string }[];
  checkedList: boolean[];
  onChange: (index: number) => void;
  disabledList?: boolean[];
};

export default function PermissionBox({
  permissionList,
  checkedList,
  onChange,
  disabledList,
}: CheckPermissionItemProps) {
  return (
    <div className="bg-[#EAEAEA] rounded-2xl mt-10 mb-20">
      {permissionList.map((permission, idx) => (
        <CheckPermissionItem
          key={idx}
          id={`permission${idx + 1}`}
          title={permission.title}
          desc={permission.description}
          checked={checkedList[idx]}
          disabled={disabledList ? disabledList[idx] : undefined}
          onClick={() => onChange(idx)}
        />
      ))}
    </div>
  );
}
