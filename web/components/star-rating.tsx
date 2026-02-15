import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  maxStars?: number;
}

export function StarRating({ rating, maxStars = 5 }: StarRatingProps) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`Rating: ${rating} out of ${maxStars}`}>
      {Array.from({ length: maxStars }, (_, i) => (
        <Star
          key={i}
          className={cn(
            "h-4 w-4",
            i < rating
              ? "fill-accent text-accent"
              : "fill-transparent text-muted-foreground/30"
          )}
        />
      ))}
    </div>
  );
}
