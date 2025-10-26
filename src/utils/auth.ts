// 쿠키에서 토큰을 확인하는 함수
export function isAuthenticated(): boolean {
  if (typeof document === "undefined") return false;

  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === "access_token" && value) {
      return true;
    }
  }
  return false;
}

// 로그인이 필요 없는 공개 라우트 목록
export const PUBLIC_ROUTES = [
  "/login",
  "/login/checkPermission",
  "/login/checkCharacter",
  "/login/makeCharacter",
];

// 해당 경로가 공개 라우트인지 확인
export function isPublicRoute(path: string): boolean {
  return PUBLIC_ROUTES.some((route) => path.startsWith(route));
}
