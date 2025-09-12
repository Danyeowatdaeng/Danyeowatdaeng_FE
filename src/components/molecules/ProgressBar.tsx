import React from "react";

type Props = {
  value: number;   // 0 ~ max
  max?: number;    // 기본 100
  className?: string;
  barClassName?: string;
};

export default function ProgressBar({
  value,
  max = 100,
  className = "",
  barClassName = "",
}: Props) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className={`w-full h-4.5 rounded-full border border-[#D9D9D9] ${className}`}>
      <div
        className={`h-full rounded-full bg-[#FF8A2B] transition-[width] ${barClassName}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}