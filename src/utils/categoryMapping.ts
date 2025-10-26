// 카테고리별 contentTypeId 매핑
// 한국관광공사 TourAPI 기준
export const CATEGORY_MAPPING: Record<string, number> = {
  tourist: 12, // 관광지
  accommodation: 32, // 숙박
  experience: 28, // 레저/체험
  restaurant: 39, // 음식점
  cafe: 39, // 카페 (음식점과 동일)
  shopping: 38, // 쇼핑
  culture: 14, // 문화시설
  festival: 15, // 축제/공연
};

// 카테고리별 한글 제목 매핑
export const CATEGORY_TITLE_MAP: Record<string, string> = {
  tourist: "관광지",
  accommodation: "숙박",
  experience: "체험/레저",
  restaurant: "음식점",
  cafe: "카페",
  shopping: "쇼핑",
  culture: "문화시설",
  festival: "공연/축제",
};

// 거리별 미터 변환
export const DISTANCE_MAPPING: Record<string, number> = {
  "500m": 500,
  "1km": 1000,
  "2km": 2000,
  "4km": 4000,
};

// 거리별 줌 레벨 매핑
export const ZOOM_LEVEL_MAPPING: Record<string, number> = {
  "500m": 2,
  "1km": 3,
  "2km": 4,
  "4km": 5,
};
