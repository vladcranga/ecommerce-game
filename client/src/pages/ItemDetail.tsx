import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Item, Review } from '../types/index';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { toast } from 'react-toastify';
import ReviewForm from '../components/reviews/ReviewForm';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import api from '../services/api';
import DeleteConfirmationModal from '../components/modals/DeleteConfirmationModal';

const ItemDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingReview, setEditingReview] = useState(false);
  const [addingReview, setAddingReview] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<Review | null>(null);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await api.get(`/items/${id}`);
        setItem(response.data);
      } catch (err) {
        setError('Failed to load item details');
        console.error('Error fetching item:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const userReview = item?.reviews.find((review) => review.user._id === user?.id);

  const handleAddReview = async (data: { rating: number; comment: string }) => {
    try {
      const response = await api.post(`/items/${id}/reviews`, data);
      setItem(response.data);
      setAddingReview(false);
      toast.success('Review added successfully!');
    } catch (err) {
      toast.error('Failed to add review');
      console.error('Error adding review:', err);
    }
  };

  const handleEditReview = async (data: { rating: number; comment: string }) => {
    try {
      const response = await api.put(`/items/${id}/reviews`, data);
      setItem(response.data);
      setEditingReview(false);
      toast.success('Review updated successfully!');
    } catch (err) {
      toast.error('Failed to update review');
      console.error('Error updating review:', err);
    }
  };

  const handleDeleteClick = (review: Review) => {
    setReviewToDelete(review);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!reviewToDelete) return;

    try {
      const response = await api.delete(`/items/${id}/reviews`);
      setItem(response.data);
      toast.success('Review deleted successfully!');
      setIsDeleteModalOpen(false);
      setReviewToDelete(null);
    } catch (err) {
      toast.error('Failed to delete review');
      console.error('Error deleting review:', err);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setReviewToDelete(null);
  };

  if (loading) return <div className="text-center p-8">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-8">{error}</div>;
  if (!item) return <div className="text-center p-8">Item not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Navbar />
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        {/* Item Details */}
        <div className="p-6">
          <div className="flex items-start gap-8">
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-64 h-64 object-contain bg-gray-900 rounded-lg"
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-game-accent mb-2">{item.name}</h1>
              <p className="text-gray-300 mb-4">{item.description}</p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-700 p-4 rounded-lg">
                  <span className="text-gray-400">Price:</span>
                  <span className="text-game-accent ml-2">{item.price} coins</span>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <span className="text-gray-400">Level Required:</span>
                  <span className="text-game-accent ml-2">{item.level}</span>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <span className="text-gray-400">Category:</span>
                  <span className="text-game-accent ml-2">{item.category}</span>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <span className="text-gray-400">Rarity:</span>
                  <span className="text-game-accent ml-2">{item.rarity}</span>
                </div>
              </div>
              {/* Attributes */}
              <div className="bg-gray-700 p-4 rounded-lg mb-6">
                <h3 className="text-xl font-semibold text-game-accent mb-3">Attributes</h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(item.attributes).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-gray-400 capitalize">{key}:</span>
                      <span className="text-game-accent">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="border-t border-gray-700 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-game-accent">Reviews</h2>
            {user && !userReview && !addingReview && (
              <button
                onClick={() => setAddingReview(true)}
                className="px-4 py-2 bg-game-accent hover:bg-game-accent-dark text-white rounded-lg"
              >
                Add Review
              </button>
            )}
          </div>

          {addingReview && (
            <div className="mb-4 bg-gray-800 p-4 rounded-lg">
              <ReviewForm onSubmit={handleAddReview} onCancel={() => setAddingReview(false)} />
            </div>
          )}

          {item.reviews.length > 0 ? (
            <div className="space-y-4">
              {item.reviews.map((review) => (
                <div
                  key={`${review.user._id}-${review.createdAt}`}
                  className="bg-gray-700 p-4 rounded-lg"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-game-accent font-semibold">{review.user.username}</span>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center">
                        <span className="text-yellow-400 mr-1">★</span>
                        <span className="text-gray-300">{review.rating}</span>
                      </div>
                      {user?.id === review.user._id && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingReview(true)}
                            className="text-gray-400 hover:text-white"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteClick(review)}
                            className="text-red-400 hover:text-red-300"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  {editingReview && user?.id === review.user._id ? (
                    <div className="mt-2">
                      <ReviewForm
                        initialReview={review}
                        onSubmit={handleEditReview}
                        onCancel={() => setEditingReview(false)}
                      />
                    </div>
                  ) : (
                    <>
                      <p className="text-gray-300">{review.comment}</p>
                      <span className="text-gray-400 text-sm">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No reviews yet.</p>
          )}
        </div>
      </div>
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
      <div className="mt-4">
        <Footer />
      </div>
    </div>
  );
};

export default ItemDetail;
