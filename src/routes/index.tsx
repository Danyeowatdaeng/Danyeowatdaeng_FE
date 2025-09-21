import { createFileRoute } from "@tanstack/react-router";
import { redirect } from "@tanstack/react-router";
import HomeLandingPage from "../pages/HomeLandingPage";
import useUserInfoStore from "../store/userInfoStore";
import { get } from "../api";

export const Route = createFileRoute("/")({
  beforeLoad: async ({ location, search }) => {
    const { isLogin, setIsLogin } = useUserInfoStore.getState();
    
    // OAuth2 인증 완료 후 리다이렉트된 경우 (쿠키에 인증 정보가 있을 수 있음)
    if (location.pathname === "/" && !isLogin) {
      try {
        // 서버에서 사용자 정보 확인 (쿠키 기반 인증)
        const response = await get("/members/me");
        if (response.isSuccess && response.data) {
          // 사용자 정보가 있으면 로그인 상태로 설정
          setIsLogin(true);
          return;
        }
      } catch (error) {
        console.log("사용자 정보 확인 실패:", error);
      }
      
      // 사용자 정보가 없으면 로그인 페이지로 리다이렉트
      throw redirect({ to: "/login" });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <HomeLandingPage />;
}
