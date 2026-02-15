import { cn } from "@/lib/utils";

interface WindArrowProps {
  direction: number;
  className?: string;
}

export function WindArrow({ direction, className }: WindArrowProps) {
  return (
    <div
      className={cn("flex items-center justify-center", className)}
      title={`${Math.round(direction)} degrees`}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        className="text-primary"
        style={{ transform: `rotate(${direction}deg)` }}
      >
        <path
          d="M12 2L6 14h12L12 2z"
          fill="currentColor"
          opacity="0.8"
        />
        <path
          d="M12 14v8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
