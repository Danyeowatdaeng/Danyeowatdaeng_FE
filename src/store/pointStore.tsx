import { create } from "zustand";
import { persist } from "zustand/middleware";

type PointState = {
  point: number;
  add: (amount: number) => void;
  set: (value: number) => void;
  reset: () => void;
};

// localStorage 에 저장해서 앱 재실행해도 유지되게 함
export const usePointStore = create<PointState>()(
  persist(
    (set) => ({
      point: 0,
      add: (amount) => set((s) => ({ point: s.point + amount })),
      set: (value) => set({ point: value }),
      reset: () => set({ point: 0 }),
    }),
    { name: "point-store" }
  )
);