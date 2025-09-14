import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import axios from "axios";
import PermissionCheckLayout from "../../components/templates/PermissionCheckLayout";

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
    try {
      const res = await axios.post(
        "https://danyeowatdaeng.p-e.kr/api/terms/agree-terms",
        {
          termsCodes: [],
        },
        {
          withCredentials: true, // 쿠키 전송을 위해 필요
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status !== 200) {
        alert("오류가 발생했습니다. 다시 시도해주세요.");
        return;
      }

      console.log("약관 동의 완료");
      navigate({ to: "/" });
    } catch (error) {
      console.error("API 요청 오류:", error);
      alert("오류가 발생했습니다. 다시 시도해주세요.");
    }
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
