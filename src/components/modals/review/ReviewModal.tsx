import React, { useState } from 'react';
import { HiX, HiStar } from 'react-icons/hi';
import { useToast } from '@/context/ToastContext';

interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    bookingId: string;
    trekTitle: string;
    // Optional: Pre-fill data if editing
    existingReview?: {
        rating: number;
        comment: string;
    };
    onReviewSubmitted: () => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
    isOpen,
    onClose,
    bookingId,
    trekTitle,
    existingReview,
    onReviewSubmitted
}) => {
    const { showToast } = useToast();
    const [rating, setRating] = useState(existingReview?.rating || 5);
    const [comment, setComment] = useState(existingReview?.comment || '');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hoverRating, setHoverRating] = useState(0);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await fetch('/api/submitReview', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    booking_id: bookingId,
                    rating,
                    comment
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to submit review');
            }

            showToast('Review submitted successfully!', 'success');
            onReviewSubmitted();
            onClose();
        } catch (error) {
            console.error(error);
            showToast(error instanceof Error ? error.message : 'Failed to submit review', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-[200]">
            <div className="bg-slate-900 border border-slate-700 rounded-none w-full max-w-md p-6 shadow-2xl relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-none transition-colors"
                >
                    <HiX className="w-6 h-6" />
                </button>

                <h2 className="text-2xl font-bold text-white mb-1">Rate your Guide</h2>
                <p className="text-slate-300 mb-6 text-sm">How was your experience on <span className="font-semibold text-yellow-400">{trekTitle}</span>?</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Star Rating */}
                    <div className="flex flex-col items-center justify-center py-4 bg-slate-800/80 rounded-none border border-slate-700">
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    className="focus:outline-none transition-transform hover:scale-110"
                                >
                                    <HiStar
                                        className={`w-10 h-10 ${star <= (hoverRating || rating)
                                                ? 'text-yellow-400'
                                                : 'text-slate-600'
                                            } transition-colors`}
                                    />
                                </button>
                            ))}
                        </div>
                        <p className="text-sm font-medium text-slate-400 mt-2">
                            {hoverRating || rating} out of 5 stars
                        </p>
                    </div>

                    {/* Comment */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Write a Review (Optional)</label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={4}
                            className="w-full border border-slate-700 bg-slate-800 text-white rounded-none p-3 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors placeholder:text-slate-500"
                            placeholder="Share your experience about the guide..."
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold py-3 rounded-none shadow-lg hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ReviewModal;
