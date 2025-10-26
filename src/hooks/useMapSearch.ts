import { useState, useEffect, useCallback } from "react";
import { get } from "../api";
import {
  CATEGORY_MAPPING,
  DISTANCE_MAPPING,
  CATEGORY_TITLE_MAP,
  ZOOM_LEVEL_MAPPING,
} from "../utils/categoryMapping";
import type { CafeCardData } from "../components/molecules/category/CafeCard";

// API 응답 타입 정의 (실제 API 응답 구조에 맞게 수정)
export interface MapSearchResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  data: Array<{
    id: number;
    title: string;
    address: string;
    latitude: number;
    longitude: number;
    category: number;
    imageUrl1?: string;
    imageUrl2?: string;
    description?: string;
    distance?: number;
    homepageUrl?: string;
    phoneNumber?: string;
  }>;
  success: boolean;
}

// 훅의 파라미터 타입
interface UseMapSearchParams {
  category: string;
  distance: string;
  centerLat?: number;
  centerLng?: number;
  enabled?: boolean;
}

// 훅의 반환 타입
interface UseMapSearchReturn {
  data: CafeCardData[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useMapSearch({
  category,
  distance,
  centerLat,
  centerLng,
  enabled = true,
}: UseMapSearchParams): UseMapSearchReturn {
  const [data, setData] = useState<CafeCardData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 현재 위치를 가져오는 함수
  const getCurrentPosition = useCallback((): Promise<{
    lat: number;
    lng: number;
  }> => {
    return new Promise((resolve, reject) => {
      console.log("getCurrentPosition 함수 시작");

      if (!navigator.geolocation) {
        console.log("Geolocation이 지원되지 않음");
        reject(new Error("Geolocation is not supported"));
        return;
      }

      console.log("Geolocation 요청 시작");
      // 8초 타임아웃(fallback)
      const hardTimeout = setTimeout(() => {
        console.warn("Geolocation timeout → using default coord");
        resolve({ lat: 37.5665, lng: 126.978 }); // fallback(서울)
      }, 8000);

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          clearTimeout(hardTimeout);
          resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        (err) => {
          clearTimeout(hardTimeout);
          console.warn("Geolocation error:", err);
          resolve({ lat: 37.5665, lng: 126.978 }); // fallback
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    });
  }, []);

  // API 호출 함수
  const fetchData = useCallback(async () => {
    console.log("fetchData 함수 실행됨, enabled:", enabled);

    if (!enabled) {
      console.log("enabled가 false여서 fetchData 종료");
      return;
    }

    console.log("로딩 시작");
    setLoading(true);
    setError(null);

    console.log("setLoading, setError 완료");

    try {
      // 현재 위치 가져오기
      console.log("위치 정보 가져오기 시작");
      const position =
        centerLat && centerLng
          ? { lat: centerLat, lng: centerLng }
          : await getCurrentPosition();

      console.log("위치 정보:", position);

      // 거리를 기반으로 bounds 계산 (간단한 원형 영역)
      const distanceInMeters = DISTANCE_MAPPING[distance] || 1000;
      const zoomLevel = ZOOM_LEVEL_MAPPING[distance] || 3; // 거리에 따른 줌 레벨

      const latOffset = distanceInMeters / 111000; // 대략적인 위도 오프셋
      const lngOffset =
        distanceInMeters / (111000 * Math.cos((position.lat * Math.PI) / 180)); // 경도 오프셋

      const swLat = position.lat - latOffset;
      const swLng = position.lng - lngOffset;
      const neLat = position.lat + latOffset;
      const neLng = position.lng + lngOffset;

      // API 파라미터 구성
      const params = {
        swLat,
        swLng,
        neLat,
        neLng,
        category: CATEGORY_MAPPING[category],
        zoomLevel,
        json: true,
      };

      console.log("API 호출 파라미터:", params);
      console.log("API 엔드포인트:", "/map/search/bounds");

      // API 호출 시도
      try {
        const response: MapSearchResponse = await get(
          "/map/search/bounds",
          params
        );

        console.log("API 응답:", response);

        // 데이터 변환 (실제 API 응답 구조에 맞게 수정)
        const transformedData: CafeCardData[] = response.data.map((item) => ({
          contentId: item.id,
          id: item.id.toString(),
          title: item.title,
          star: "4.5", // API에서 별점 정보가 없으므로 기본값
          image: item.imageUrl1 || item.imageUrl2 || "",
          rating: 4.5,
          reviewCount: Math.floor(Math.random() * 100) + 1, // 임시 리뷰 수
          address: item.address,
          latitude: item.latitude,
          longitude: item.longitude,
          phone: item.phoneNumber || "",
          source: "tour-api",
        }));

        setData(transformedData);
      } catch (apiError) {
        console.warn("API 호출 실패, 더미 데이터 사용:", apiError);

        // API 실패 시 더미 데이터 사용
        const dummyData: CafeCardData[] = [
          {
            contentId: 1,
            id: "1",
            title: `${CATEGORY_TITLE_MAP[category] || "장소"} 1`,
            star: "4.5",
            image: "",
            rating: 4.5,
            reviewCount: 23,
            address: "서울시 강남구 테헤란로 123",
            latitude: 37.5665,
            longitude: 126.978,
            phone: "",
            source: "tour-api",
          },
          {
            contentId: 2,
            id: "2",
            title: `${CATEGORY_TITLE_MAP[category] || "장소"} 2`,
            star: "4.2",
            image: "",
            rating: 4.2,
            reviewCount: 15,
            address: "서울시 서초구 서초대로 456",
            latitude: 37.4833,
            longitude: 127.0322,
            phone: "",
            source: "tour-api",
          },
          {
            contentId: 3,
            id: "3",
            title: `${CATEGORY_TITLE_MAP[category] || "장소"} 3`,
            star: "4.8",
            image: "",
            rating: 4.8,
            reviewCount: 42,
            address: "서울시 마포구 홍대입구역 789",
            latitude: 37.5563,
            longitude: 126.9236,
            phone: "",
            source: "tour-api",
          },
        ];

        setData(dummyData);
      }
    } catch (err) {
      console.error("지도 검색 API 오류:", err);

      // 더 자세한 에러 정보 로깅
      if (err instanceof Error) {
        console.error("에러 메시지:", err.message);
        console.error("에러 스택:", err.stack);
      }

      // 네트워크 에러인지 확인
      if (err && typeof err === "object" && "response" in err) {
        const axiosError = err as {
          response?: { status?: number; data?: unknown };
        };
        console.error("HTTP 상태 코드:", axiosError.response?.status);
        console.error("응답 데이터:", axiosError.response?.data);
      }

      setError(
        err instanceof Error ? err.message : "데이터를 불러오는데 실패했습니다."
      );
    } finally {
      console.log("loading 종료");
      setLoading(false);
    }
  }, [category, distance, centerLat, centerLng, enabled, getCurrentPosition]);

  // 데이터 다시 가져오기
  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  // 의존성이 변경될 때마다 데이터 가져오기
  useEffect(() => {
    console.log("useEffect 실행됨, category:", category, "distance:", distance);
    fetchData();
  }, [category, distance, fetchData]);

  return {
    data,
    loading,
    error,
    refetch,
  };
}
