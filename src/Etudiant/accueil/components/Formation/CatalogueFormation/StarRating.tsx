import { Star } from "lucide-react";

export const StarRating = ({ rating }: { rating: number }) => {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.5;
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={14}
          className={
            i < full
              ? "fill-yellow-400 text-yellow-400"
              : hasHalf && i === full
              ? "fill-yellow-200 text-yellow-400"
              : "fill-gray-200 text-gray-200"
          }
        />
      ))}
    </div>
  );
};

export const StarRatingFallback = ({ id }: { id: number }) => {
  const ratings = [4.5, 4.8, 5.0, 4.2, 4.7, 4.6];
  const rating = ratings[id % ratings.length];
  return <StarRating rating={rating} />;
};