
import { Star } from 'lucide-react'

function RatingStars({
    rating = 0,
    interactive = false,
    onChange,
    size = 20
}) {
    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    disabled={!interactive}
                    onClick={() => onChange?.(star)}
                    aria-label={`Rate ${star} out of 5`}
                    className={interactive ? 'cursor-pointer' : 'cursor-default'}
                >
                    <Star
                        size={size}
                        className={`transition ${
                            star <= rating
                                ? 'fill-[#C49A55] text-[#C49A55]'
                                : 'text-gray-300'
                        }`}
                    />
                </button>
            ))}
        </div>
    )
}

export default RatingStars
