import { useState, useEffect, useCallback } from "react";
import { get } from "../api";
import {
  CATEGORY_MAPPING,
  DISTANCE_MAPPING,
  CATEGORY_TITLE_MAP,
} from "../utils/categoryMapping";
import type { CafeCardData } from "../components/molecules/CafeCard";

// API 응답 타입 정의
export interface MapSearchResponse {
  items: Array<{
    title: string;
    addr1: string;
    addr2?: string;
    firstimage?: string;
    contentid: string;
    contenttypeid: string;
    mapx: string;
    mapy: string;
    tel?: string;
    overview?: string;
  }>;
  totalCount: number;
  pageNo: number;
  numOfRows: number;
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
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          // 기본값으로 서울 중심 좌표 사용
          console.warn(
            "위치 정보를 가져올 수 없습니다. 기본 위치를 사용합니다.",
            error
          );
          resolve({
            lat: 37.5665, // 서울시청
            lng: 126.978,
          });
        }
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

    try {
      // 현재 위치 가져오기
      const position =
        centerLat && centerLng
          ? { lat: centerLat, lng: centerLng }
          : await getCurrentPosition();

      // 거리를 기반으로 bounds 계산 (간단한 원형 영역)
      const distanceInMeters = DISTANCE_MAPPING[distance] || 1000;
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
        zoomLevel: 10,
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

        // 데이터 변환
        const transformedData: CafeCardData[] = response.items.map((item) => ({
          id: item.contentid,
          title: item.title,
          star: "4.5", // API에서 별점 정보가 없으므로 기본값
          image:
            item.firstimage ||
            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik01MCAzMEMzNS42NDE0IDMwIDI0IDQxLjY0MTQgMjQgNTZDMjQgNzAuMzU4NiAzNS42NDE0IDgyIDUwIDgyQzY0LjM1ODYgODIgNzYgNzAuMzU4NiA3NiA1NkM3NiA0MS42NDE0IDY0LjM1ODYgMzAgNTAgMzBaIiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik01MCA0MEM0Mi4yNjg0IDQwIDM2IDQ2LjI2ODQgMzYgNTRDMzYgNjEuNzMxNiA0Mi4yNjg0IDY4IDUwIDY4QzU3LjczMTYgNjggNjQgNjEuNzMxNiA2NCA1NEM2NCA0Ni4yNjg0IDU3LjczMTYgNDAgNTAgNDBaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K",
          rating: 4.5,
          reviewCount: Math.floor(Math.random() * 100) + 1, // 임시 리뷰 수
          address: `${item.addr1} ${item.addr2 || ""}`.trim(),
        }));

        setData(transformedData);
      } catch (apiError) {
        console.warn("API 호출 실패, 더미 데이터 사용:", apiError);

        // API 실패 시 더미 데이터 사용
        const dummyData: CafeCardData[] = [
          {
            id: "1",
            title: `${CATEGORY_TITLE_MAP[category] || "장소"} 1`,
            star: "4.5",
            image:
              "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik01MCAzMEMzNS42NDE0IDMwIDI0IDQxLjY0MTQgMjQgNTZDMjQgNzAuMzU4NiAzNS42NDE0IDgyIDUwIDgyQzY0LjM1ODYgODIgNzYgNzAuMzU4NiA3NiA1NkM3NiA0MS42NDE0IDY0LjM1ODYgMzAgNTAgMzBaIiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik01MCA0MEM0Mi4yNjg0IDQwIDM2IDQ2LjI2ODQgMzYgNTRDMzYgNjEuNzMxNiA0Mi4yNjg0IDY4IDUwIDY4QzU3LjczMTYgNjggNjQgNjEuNzMxNiA2NCA1NEM2NCA0Ni4yNjg0IDU3LjczMTYgNDAgNTAgNDBaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K",
            rating: 4.5,
            reviewCount: 23,
            address: "서울시 강남구 테헤란로 123",
          },
          {
            id: "2",
            title: `${CATEGORY_TITLE_MAP[category] || "장소"} 2`,
            star: "4.2",
            image:
              "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik01MCAzMEMzNS42NDE0IDMwIDI0IDQxLjY0MTQgMjQgNTZDMjQgNzAuMzU4NiAzNS42NDE0IDgyIDUwIDgyQzY0LjM1ODYgODIgNzYgNzAuMzU4NiA3NiA1NkM3NiA0MS42NDE0IDY0LjM1ODYgMzAgNTAgMzBaIiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik01MCA0MEM0Mi4yNjg0IDQwIDM2IDQ2LjI2ODQgMzYgNTRDMzYgNjEuNzMxNiA0Mi4yNjg0IDY4IDUwIDY4QzU3LjczMTYgNjggNjQgNjEuNzMxNiA2NCA1NEM2NCA0Ni4yNjg0IDU3LjczMTYgNDAgNTAgNDBaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K",
            rating: 4.2,
            reviewCount: 15,
            address: "서울시 서초구 서초대로 456",
          },
          {
            id: "3",
            title: `${CATEGORY_TITLE_MAP[category] || "장소"} 3`,
            star: "4.8",
            image:
              "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik01MCAzMEMzNS42NDE0IDMwIDI0IDQxLjY0MTQgMjQgNTZDMjQgNzAuMzU4NiAzNS42NDE0IDgyIDUwIDgyQzY0LjM1ODYgODIgNzYgNzAuMzU4NiA3NiA1NkM3NiA0MS42NDE0IDY0LjM1ODYgMzAgNTAgMzBaIiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik01MCA0MEM0Mi4yNjg0IDQwIDM2IDQ2LjI2ODQgMzYgNTRDMzYgNjEuNzMxNiA0Mi4yNjg0IDY4IDUwIDY4QzU3LjczMTYgNjggNjQgNjEuNzMxNiA2NCA1NEM2NCA0Ni4yNjg0IDU3LjczMTYgNDAgNTAgNDBaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K",
            rating: 4.8,
            reviewCount: 42,
            address: "서울시 마포구 홍대입구역 789",
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
