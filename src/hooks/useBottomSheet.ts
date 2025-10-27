import { useRef, useState, useEffect } from "react";
import { SpringValue, useSpring } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";

interface UseBottomSheetProps {
  minHeight: number; // 접힌 높이
  maxHeight: number; // 펼친 높이
  open: boolean;
  onClose: () => void;
}

interface UseBottomSheetReturn {
  height: SpringValue<number>;
  y: SpringValue<number>;
  isExpanded: boolean;
  bind: ReturnType<typeof useDrag>;
}

export function useBottomSheet({
  minHeight,
  maxHeight,
  open,
  onClose,
}: UseBottomSheetProps): UseBottomSheetReturn {
  const clamp = (n: number, min: number, max: number) =>
    Math.max(min, Math.min(max, n));

  const [isExpanded, setIsExpanded] = useState(false);
  const [{ height, y }, api] = useSpring(() => ({
    height: minHeight,
    y: 0,
    config: {
      tension: 200,
      friction: 20,
      clamp: true, // 목표값에 도달하면 정확히 멈추도록 설정
    },
  }));

  // stale state 방지
  const expandedRef = useRef(isExpanded);
  expandedRef.current = isExpanded;

  // open prop이 변경될 때 isExpanded 상태 업데이트
  useEffect(() => {
    if (open) {
      setIsExpanded(false); // 초기에는 절반만 올라오도록
    } else {
      setIsExpanded(false);
    }
  }, [open]);

  // 마운트될 때 높이 설정
  useEffect(() => {
    if (isExpanded) {
      api.start({
        to: { height: maxHeight, y: 0 },
        immediate: false,
      });
    } else {
      api.start({
        to: { height: minHeight, y: 0 },
        immediate: true,
      });
    }
  }, [isExpanded, api, maxHeight, minHeight]);

  const bind = useDrag(
    ({ last, movement: [, my] }) => {
      if (!last) {
        // 드래그 중
        let nextHeight: number;
        let nextY: number;

        if (expandedRef.current) {
          // 펼친 상태에서 드래그
          nextHeight = clamp(maxHeight - my, minHeight, maxHeight);
          nextY = clamp(my > 20 ? my / 2 : 0, 0, minHeight);
        } else {
          // 접힌 상태에서 드래그
          const deltaUp = Math.max(0, -my);
          nextHeight = clamp(minHeight + deltaUp, minHeight, maxHeight);
          nextY = clamp(my > 20 ? my : 0, 0, minHeight);
        }

        // 드래그 중에는 즉시 반영
        api.start({
          to: {
            height: nextHeight,
            y: nextY,
          },
          immediate: true,
        });
        return;
      }

      // 드래그 끝났을 때 처리
      if (my < -30 && !expandedRef.current) {
        // 위로 많이 드래그하면 확장
        setIsExpanded(true);
        api.start({
          to: {
            height: maxHeight,
            y: 0,
          },
          immediate: false,
          config: {
            tension: 300, // 더 빠른 스프링
            friction: 30, // 더 강한 감쇠
            clamp: true, // 정확한 위치에서 멈춤
          },
        });
      } else if (my > 30 && expandedRef.current) {
        // 아래로 많이 드래그하면 축소
        setIsExpanded(false);
        api.start({
          to: {
            height: minHeight,
            y: 0,
          },
          immediate: false,
        });
      } else if (my > 30 && !expandedRef.current) {
        // 많이 내리면 닫기
        setIsExpanded(false);
        onClose();
      } else {
        // 현재 상태 유지
        api.start({
          to: {
            height: expandedRef.current ? maxHeight : minHeight,
            y: 0,
          },
          immediate: false,
        });
      }
    },
    {
      axis: "y",
      filterTaps: true,
      threshold: 10, // 10픽셀 이하의 움직임은 무시
      enabled: open,
      eventOptions: { passive: false },
    }
  );

  return { height, y, isExpanded, bind };
}
