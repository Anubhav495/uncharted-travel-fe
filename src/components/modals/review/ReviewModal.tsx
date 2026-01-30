import React, { useState } from 'react';
import { HiX, HiStar } from 'react-icons/hi';
import { useAuth } from '@/context/AuthContext';
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
    const { user } = useAuth();
    const { showToast } = useToast();
    const [rating, setRating] = useState(existingReview?.rating || 5);
    const [comment, setComment] = useState(existingReview?.comment || '');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hoverRating, setHoverRating] = useState(0);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setIsSubmitting(true);
        try {
            const response = await fetch('/api/submitReview', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    booking_id: bookingId,
                    user_id: user.id,
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
        } catch (error: any) {
            console.error(error);
            showToast(error.message, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[200]">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
                >
                    <HiX className="w-6 h-6" />
                </button>

                <h2 className="text-2xl font-bold text-gray-900 mb-1">Rate your Guide</h2>
                <p className="text-gray-500 mb-6 text-sm">How was your experience on <span className="font-semibold text-yellow-600">{trekTitle}</span>?</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Star Rating */}
                    <div className="flex flex-col items-center justify-center py-4 bg-gray-50 rounded-xl border border-gray-100">
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
                                                : 'text-gray-300'
                                            } transition-colors`}
                                    />
                                </button>
                            ))}
                        </div>
                        <p className="text-sm font-medium text-gray-400 mt-2">
                            {hoverRating || rating} out of 5 stars
                        </p>
                    </div>

                    {/* Comment */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Write a Review (Optional)</label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={4}
                            className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors"
                            placeholder="Share your experience about the guide..."
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ReviewModal;
