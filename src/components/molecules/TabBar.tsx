// 탭바
import TabBarItem from "./TabBarItem";
import { useNavigate, useLocation } from "@tanstack/react-router";

type TabBarProps = {
  className?: string;
};

export default function TabBar({ className = "" }: TabBarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <nav
      className={`w-full bg-white border-t border-black/5
                  pt-3 pb-[calc(12px+env(safe-area-inset-bottom))]
                  shadow-[0_-4px_12px_rgba(0,0,0,0.04)]
                  ${className}`}
      aria-label="하단 탭"
    >
      <div className="mx-auto max-w-[560px] px-4">
        <div className="grid grid-cols-5 place-items-center gap-2">
          <TabBarItem
            activeIconSrc="/Assets/icons/HomeActive.svg"
            inactiveIconSrc="/Assets/icons/Home.svg"
            label="홈"
            active={currentPath === "/"}
            onClick={() => navigate({ to: "/" })}
          />
          <TabBarItem
            activeIconSrc="/Assets/icons/PawPrintActive.svg"
            inactiveIconSrc="/Assets/icons/PawPrint.svg"
            label="마이펫"
            active={currentPath === "/mypet"}
            onClick={() => navigate({ to: "/mypet" })}
          />
          <TabBarItem
            activeIconSrc="/Assets/icons/ChatActive.svg"
            inactiveIconSrc="/Assets/icons/Chat.svg"
            label="챗봇"
            active={currentPath === "/chat"}
            onClick={() => navigate({ to: "/chat" })}
          />
          <TabBarItem
            activeIconSrc="/Assets/icons/StarActive.svg"
            inactiveIconSrc="/Assets/icons/Star.svg"
            label="찜하기"
            active={currentPath === "/wish"}
            onClick={() => navigate({ to: "/" })}
          />
          <TabBarItem
            activeIconSrc="/Assets/icons/UserActive.svg"
            inactiveIconSrc="/Assets/icons/User.svg"
            label="프로필"
            active={currentPath === "/profile"}
            onClick={() => navigate({ to: "/profile" })}
          />
        </div>
      </div>
    </nav>
  );
}
