import { Star } from "lucide-react";

export const DynamicStarRating = ({ rating }: { rating: number }) => {
  const full = Math.floor(rating);
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={14}
          className={i < full ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}
        />
      ))}
      <span className="text-xs font-bold text-yellow-600 ml-1">{rating.toFixed(1)}</span>
    </div>
  );
};