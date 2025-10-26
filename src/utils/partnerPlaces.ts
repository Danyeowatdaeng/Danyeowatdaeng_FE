// 제휴 장소 목록
export const PARTNER_PLACES = [
  "냐옹냐옹고양이까페",
  "광주애견호텔유치원", 
  "24시 애견미용"
];

// 장소명이 제휴 장소인지 확인하는 함수
export const isPartnerPlace = (placeName: string): boolean => {
  return PARTNER_PLACES.some(partnerPlace => 
    placeName.includes(partnerPlace) || partnerPlace.includes(placeName)
  );
};
