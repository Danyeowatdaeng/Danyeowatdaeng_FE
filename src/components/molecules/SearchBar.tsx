import { useState, useRef } from "react";
import { Search, X } from "lucide-react";
import Input from "../atoms/Input";
import Button from "../atoms/Button";
import * as React from "react";
import { get } from "../../api";
import { useSearchResultStore } from "../../store/searchResultStore";

type SearchBarProps = {
  placeholder?: string;
  onFocus?: () => void;
  className?: string;
};

export default function SearchBar({
  placeholder = "",
  onFocus,
  className = "",
}: SearchBarProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [searchValue, setSearchValue] = useState<string>("");
  const { setSearchResults } = useSearchResultStore();
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (searchValue.trim() === "") return;

    try {
      const response = await get("/map/search/keyword", {
        keyword: searchValue.trim(),
        page: 0,
        size: 100,
        sort: "string",
      });

      console.log("검색 결과:", response);
      setSearchResults([...response.data]);
    } catch (error) {
      console.error("검색 오류:", error);
    }
  };

  const handleClear = () => {
    if (searchValue === "") return;
    setSearchValue("");
  };

  const hasText = searchValue.length > 0;

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className={`w-full h-[57px] border-[#B8B8B8] border-1 rounded-lg bg-[#ffffff]
                  flex items-center gap-3 px-5
                  shadow-[0_2px_6px_rgba(0,0,0,0.04)] ${className}`}
      aria-label="검색"
      role="search"
      onClick={() => onFocus?.()}
    >
      <Input
        name="q"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder={placeholder}
        onFocus={onFocus}
        inputMode="search"
        enterKeyHint="search"
        className="bg-transparent outline-none border-none
                   text-[16px] leading-[22px] w-full"
        aria-label="검색어 입력"
      />

      {/* 텍스트가 있을 때만 X 버튼 노출 */}
      {hasText && (
        <Button
          type="button"
          aria-label="지우기"
          onClick={handleClear}
          className="p-0 inline-flex items-center justify-center w-6 h-6"
        >
          <X size={18} className="text-gray-400" />
        </Button>
      )}

      <Button
        type="submit"
        aria-label="검색하기"
        className="p-0 inline-flex items-center justify-center w-6 h-6"
      >
        <Search size={22} strokeWidth={2} className="text-gray-500" />
      </Button>
    </form>
  );
}
