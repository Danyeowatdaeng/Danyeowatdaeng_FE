interface StarIconProps {
  className?: string;
  color?: string;
  height?: number;
  width?: number;
}

export default function StarIcon({
  className,
  color = "#ABABAB",
  height = 18,
  width = 18,
}: StarIconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 18 18`}
      fill={color}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.15877 2.14784C8.54036 1.51376 9.45964 1.51376 9.84123 2.14784L11.5011 4.90595C11.6382 5.13375 11.8618 5.29621 12.1208 5.35619L15.2568 6.08251C15.9778 6.24948 16.2619 7.12376 15.7767 7.68262L13.6666 10.1135C13.4923 10.3143 13.4069 10.5772 13.4298 10.8421L13.7082 14.0491C13.7722 14.7863 13.0284 15.3267 12.347 15.038L9.383 13.7823C9.1382 13.6785 8.8618 13.6785 8.617 13.7823L5.65297 15.038C4.97155 15.3267 4.22784 14.7863 4.29183 14.0491L4.57015 10.8421C4.59314 10.5772 4.50773 10.3143 4.33345 10.1135L2.22325 7.68262C1.73813 7.12376 2.0222 6.24948 2.74316 6.08251L5.87921 5.35619C6.13821 5.29621 6.36182 5.13375 6.49891 4.90595L8.15877 2.14784Z"
        fill={color}
        stroke={color}
        stroke-width="1.22727"
      />
    </svg>
  );
}
