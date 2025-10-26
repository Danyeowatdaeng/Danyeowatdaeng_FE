import { create } from "zustand";
import { persist } from "zustand/middleware";

type DistanceType = "500m" | "1km" | "2km" | "4km";

interface MapSettingsState {
  distance: DistanceType;
  setDistance: (distance: DistanceType) => void;
}

export const useMapSettingsStore = create<MapSettingsState>()(
  persist(
    (set) => ({
      distance: "2km", // 기본값
      setDistance: (distance) => set({ distance }),
    }),
    {
      name: "map-settings-storage", // localStorage 키
    }
  )
);
