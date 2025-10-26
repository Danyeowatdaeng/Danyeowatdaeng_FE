import { useState, useRef, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import ShowMoreIcon from "../../atoms/Icon/ShowMoreIcon";
import CategoryItem from "../../molecules/category/CategoryItem";
import type { WishlistGroup } from "../../../api";

type MyGroupProps = {
  group: WishlistGroup;
  onClick?: () => void;
  onEdit?: (group: WishlistGroup) => void;
  onDelete?: (group: WishlistGroup) => void;
};

export default function MyGroup({ group, onClick, onEdit, onDelete }: MyGroupProps) {
  const navigate = useNavigate();
  const wishlistCount = group.wishlists?.length || 0;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  // 외부 클릭 시 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  const handleGroupClick = () => {
    if (onClick) {
      onClick();
    } else {
      // 기본 동작: 그룹 상세 페이지로 이동
      navigate({ to: `/cart/group/${group.id}` });
    }
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(!menuOpen);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
    onEdit?.(group);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
    onDelete?.(group);
  };
  
  return (
    <div 
      className="flex justify-between items-center border-b-1 border-[#EFEFEF] py-3 relative cursor-pointer hover:bg-gray-50 transition-colors rounded-lg px-2"
      onClick={handleGroupClick}
    >
      <div className="flex gap-5 items-center">
        <div className="pointer-events-none">
          <CategoryItem
            style="bg-white border-1 border-[#D9D9D9]"
            iconSrc={group.categoryImageUrl}
            label=""
            onClick={() => {}}
          />
        </div>
        <div className="gap-y-3 h-full">
          <div className="text-[16px]">{group.name}</div>
          <div className="text-[#858585] text-[14px]">
            {group.isPublic ? "공개" : "비공개"} / 장소 {wishlistCount}개
          </div>
        </div>
      </div>
      
      <div className="relative" ref={menuRef}>
        <button onClick={handleMenuClick} className="p-2">
          <ShowMoreIcon />
        </button>
        
        {menuOpen && (
          <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[120px] overflow-hidden">
            <button
              onClick={handleEdit}
              className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 transition-colors"
            >
              수정
            </button>
            <button
              onClick={handleDelete}
              className="w-full px-4 py-3 text-left text-sm text-red-500 hover:bg-gray-50 transition-colors"
            >
              삭제
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
