import { cva, type VariantProps } from "class-variance-authority";
import Button from "../atoms/Button";
import { cn } from "../../utils/style";

const buttonStyles = cva(
  // 기본 스타일
  "rounded-lg inline-flex gap-3 justify-center items-center w-full disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary: "bg-[#00A3A5] text-white disabled:bg-gray-300",
        secondary:
          "bg-gray-100 text-gray-900 hover:bg-gray-200 disabled:bg-gray-50",
        outline:
          "border-2 border-orange-500 text-orange-500 hover:bg-orange-50 disabled:border-gray-300 disabled:text-gray-300",
        ghost: "text-orange-500 hover:bg-orange-50 disabled:text-gray-300",
      },
      size: {
        sm: "h-12 px-4 text-md font-400",
        md: "h-12 px-6 text-base font-medium",
        lg: "h-12 px-8 text-lg font-bold",
        full: "h-12 w-full px-8 text-lg font-bold",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

interface StyledButtonProps
  extends Omit<React.ComponentPropsWithoutRef<"button">, "className">,
    VariantProps<typeof buttonStyles> {}

export default function PrimaryButton({
  children,
  variant,
  size,
  ...props
}: StyledButtonProps) {
  return (
    <Button className={cn(buttonStyles({ variant, size }))} {...props}>
      {children}
    </Button>
  );
}
