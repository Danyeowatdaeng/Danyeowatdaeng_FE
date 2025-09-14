import { create } from "zustand";

export interface SearchResult {
  id: number;
  title: string;
  category: number;
  address: string;
  description: string;
  imageUrl1: string;
  imageUrl2: string;
  latitude: number;
  longitude: number;
  distance: number;
  phoneNumber: string;
  homepageUrl: string;
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
