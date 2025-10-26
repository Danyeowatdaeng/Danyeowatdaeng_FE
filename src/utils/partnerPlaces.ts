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

// 장소명을 예약 페이지 ID로 변환하는 함수
export const getPlaceIdFromName = (placeName: string): string | null => {
  if (placeName.includes("냐옹냐옹고양이까페")) {
    return "nyang";
  } else if (placeName.includes("광주애견호텔유치원")) {
    return "hotel";
  } else if (placeName.includes("24시 애견미용") || placeName.includes("애견 미용")) {
    return "beauty";
  }
  return null;
};

// 예약 페이지 ID를 장소명으로 변환하는 함수
export const getPlaceNameFromId = (placeId: string): string | null => {
  switch(placeId) {
    case "nyang":
      return "냐옹냐옹고양이까페";
    case "hotel":
      return "광주애견호텔유치원";
    case "beauty":
      return "24시 애견 미용";
    default:
      return null;
  }
};
