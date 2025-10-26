import ShowMoreIcon from "../../atoms/Icon/ShowMoreIcon";
import CategoryItem from "../../molecules/category/CategoryItem";

export default function MyGroup() {
  return (
    <div className="flex justify-between items-center border-b-1 border-[#EFEFEF]">
      <div className="flex gap-5 items-center">
        <CategoryItem
          style="bg-white border-1 border-[#D9D9D9]"
          iconSrc="/Assets/icons/categories/Suitcase.svg"
          label=""
          onClick={() => {}}
        />
        <div className="gap-y-3 h-full">
          <div className="text-[16px]">강아지 산책 코스</div>
          <div className="text-[#858585] text-[14px]">비공개 / 장소 3개</div>
        </div>
      </div>
      <ShowMoreIcon />
    </div>
  );
}
