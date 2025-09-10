import ProfileTemplate from "../components/templates/ProfileTemplate";

export default function ProfilePage() {
  return (
    <ProfileTemplate
      name="USER01"
      subtitle="지역, 반려동물 정보 등"
      // imageSrc="/Assets/images/profile.jpg" // 실제 이미지가 있으면 주석 해제
      onInfo={() => console.log("프로필 가이드 클릭")}
      onEditAvatar={() => console.log("아바타 수정")}
      onClickCoupon={() => console.log("내 쿠폰함 이동")}
      point={12345}
      stamp={4}
    />
  );
}