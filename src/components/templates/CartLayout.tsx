import Title from "../atoms/Title";
import PrimaryButton from "../molecules/PrimaryButton";
import TabBar from "../molecules/TabBar";
import MyGroup from "../organisms/cart/myGroup";

export default function CartLayout() {
  return (
    <div className="flex flex-col justify-between h-full">
      <div className=" mx-8">
        <Title className="mt-25 mb-5">내 그룹</Title>
        <MyGroup />
        <div className="my-5">
          <PrimaryButton size={"sm"}>+ 새 그룹 추가</PrimaryButton>
        </div>
        <Title className="mt-10">최근 찜한 장소</Title>
      </div>
      <TabBar className="relative bottom-0 w-full z-30" />
    </div>
  );
}
