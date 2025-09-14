import { useState } from "react";
import Button from "../atoms/Button";
import StarIcon from "../atoms/Icon/StarIcon";
import { cn } from "../../utils/style";

export default function CartButton() {
  const [addCart, setAddCart] = useState(false);
  return (
    <Button
      className={cn(
        "p-1 w-[85px] items-center justify-center h-[29px] flex border-1 rounded-3xl",
        addCart ? "border-[#00A3A5]" : "border-[#D9D9D9]"
      )}
      onClick={(e) => {
        e.stopPropagation();
        setAddCart(!addCart);
      }}
    >
      <StarIcon className="mr-2" color={addCart ? "#00A3A5" : "#ABABAB"} />
      <div className={`${addCart ? "text-[#00A3A5]" : "text-[#ABABAB]"}`}>
        찜하기
      </div>
    </Button>
  );
}
