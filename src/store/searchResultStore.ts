import { create } from "zustand";

export interface SearchResult {
  id: number;
  contentId?: number;
  contentTypeId?: number;
  name: string;
  category3: string;
  roadAddress: string;
  jibunAddress: string;
  homepage: string;
  closedDays: string;
  openingHours: string;
  latitude: number;
  longitude: number;
  phone: string;
  source: string;
  imageUrl?: string;
  // 바텀시트 표시를 위한 추가 필드들
  rating?: number;
  reviewCount?: number;
  distance?: string;
  status?: "영업 중" | "영업 전" | "영업 종료";
}

interface SearchResultState {
  searchResults: SearchResult[];
  setSearchResults: (results: SearchResult[]) => void;
  clearResults: () => void;
}

export const useSearchResultStore = create<SearchResultState>((set) => ({
  searchResults: [],
  setSearchResults: (results) => set({ searchResults: results }),
  clearResults: () => set({ searchResults: [] }),
}));
