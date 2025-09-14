interface FlagIconProps {
  className?: string;
  color?: string;
  height?: number;
  width?: number;
}

export default function FlagIcon({
  className,
  color = "#444444",
  height = 18,
  width = 18,
}: FlagIconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 17 22"
      className={className}
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 2.5C1 1.67157 1.67157 1 2.5 1H7.5C8.32843 1 9 1.67157 9 2.5V10.5C9 11.3284 8.32843 12 7.5 12H1V2.5Z"
        stroke={color}
        stroke-width="1.5"
      />
      <path
        d="M9 3H15.0362C15.8535 3 16.3257 3.9272 15.845 4.58817L13.8555 7.32366C13.3455 8.02496 13.3455 8.97504 13.8555 9.67634L15.845 12.4118C16.3257 13.0728 15.8535 14 15.0362 14H10C9.44772 14 9 13.5523 9 13V3Z"
        stroke={color}
        stroke-width="1.5"
      />
      <path
        d="M1 21L1 3"
        stroke={color}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}
