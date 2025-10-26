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
