import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import PermissionCheckLayout from "../../components/templates/PermissionCheckLayout";
import { post } from "../../api";

export default function CheckPermissionPage() {
  const navigate = useNavigate();
  const permissionList = [
    { title: "카메라", description: "바코드/QR, 포토리뷰 등의 서비스 이용" },
    { title: "사진", description: "사진 관련 서비스 이용" },
    { title: "알림", description: "알림 관련 서비스 이용" },
    { title: "위치", description: "위치 기반 서비스 이용" },
  ];
  const [checkedList, setCheckedList] = useState<boolean[]>(
    new Array(permissionList.length).fill(false)
  );

  const handlePermissionChange = (index: number) => {
    setCheckedList((prev: boolean[]) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  const handleSubmit = async () => {
    const res: { status: number } = await post("/terms/agree-terms", {
      termsCodes: [],
    });
    if (res.status !== 200) {
      alert("오류가 발생했습니다. 다시 시도해주세요.");
      return;
    }

    console.log("약관 동의 완료");
    navigate({ to: "/" });
  };

  return (
    <PermissionCheckLayout
      onBack={() => navigate({ to: "/login" })}
      pageTitle="접근 권한을 허용해주세요"
      permissionList={permissionList}
      checkedList={checkedList}
      onChange={handlePermissionChange}
      handleSubmit={handleSubmit}
    />
  );
}
