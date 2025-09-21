import { create } from "zustand";

export interface SearchResult {
  id: number;
  name: "string";
  category3: "string";
  roadAddress: "string";
  jibunAddress: "string";
  homepage: "string";
  closedDays: "string";
  openingHours: "string";
  latitude: 0;
  longitude: 0;
  phone: "string";
  source: "string";
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
