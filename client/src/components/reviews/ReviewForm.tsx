import { useState } from 'react';
import { FormEvent } from 'react';
import { Review } from '../../types';

interface ReviewFormProps {
  initialReview?: Review;
  onSubmit: (data: { rating: number; comment: string }) => void;
  onCancel: () => void;
}

const ReviewForm = ({ initialReview, onSubmit, onCancel }: ReviewFormProps) => {
  const [rating, setRating] = useState(initialReview?.rating || 5);
  const [comment, setComment] = useState(initialReview?.comment || '');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({ rating, comment });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-gray-300 mb-2">Rating</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              className={`text-2xl ${value <= rating ? 'text-yellow-400' : 'text-gray-600'}`}
            >
              ★
            </button>
          ))}
        </div>
      </div>
      <div>
        <label htmlFor="comment" className="block text-gray-300 mb-2">
          Comment
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-game-accent"
          rows={3}
          required
        />
      </div>
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-300 hover:text-white"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-game-accent hover:bg-game-accent-dark text-white rounded-lg"
        >
          {initialReview ? 'Update Review' : 'Submit Review'}
        </button>
      </div>
    </form>
  );
};

export default ReviewForm;
