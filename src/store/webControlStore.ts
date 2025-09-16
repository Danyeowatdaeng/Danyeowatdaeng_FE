import { create } from "zustand";

interface WebControlState {
  isWide: boolean;
  setIsWide: (value: boolean) => void;
}

export const useWebControlStore = create<WebControlState>((set) => ({
  isWide: typeof window !== "undefined" ? window.innerWidth > 600 : true,
  setIsWide: (value) => set({ isWide: value }),
}));

// 뷰포트 크기 변화 감지하여 store 값 자동 갱신
if (typeof window !== "undefined") {
  window.addEventListener("resize", () => {
    useWebControlStore.getState().setIsWide(window.innerWidth > 600);
  });
}
