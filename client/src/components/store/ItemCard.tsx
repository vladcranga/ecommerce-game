import { Link } from 'react-router-dom';
import { Item } from '../../types';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../store/slices/cartSlice';
import { AppDispatch, RootState } from '../../store';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import { MouseEvent } from 'react';
import { SerializedError } from '@reduxjs/toolkit';

interface ItemCardProps {
  item: Item;
}

const ItemCard = ({ item }: ItemCardProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { items: cartItems = [] } = useSelector((state: RootState) => state.cart);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return 'text-yellow-400';
      case 'epic':
        return 'text-purple-400';
      case 'rare':
        return 'text-blue-400';
      case 'uncommon':
        return 'text-green-400';
      default:
        return 'text-gray-400';
    }
  };

  const isInCart = cartItems?.some((cartItem) => cartItem.item._id === item._id) || false;
  const canAfford = user && user.points >= item.price;

  const handleAddToCart = async (e: MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking the button

    if (!user) {
      toast.error('Please log in to add items to cart');
      return;
    }

    if (isInCart) {
      toast.error('Item is already in your cart');
      return;
    }

    if (!canAfford) {
      toast.error(
        `You need ${item.price - (user?.points || 0)} more coins to add this item to cart`,
      );
      return;
    }

    if (item.stock <= 0) {
      toast.error('Item is out of stock');
      return;
    }

    try {
      await dispatch(addToCart(item._id)).unwrap();
      toast.success('Added to cart!');
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || 'Failed to add item to cart');
        return;
      }
      const err = error as SerializedError;
      toast.error(err.message || 'Failed to add item to cart');
    }
  };

  return (
    <Link to={`/store/${item._id}`} className="block">
      <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full h-48 object-contain bg-gray-900"
        />
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-white">{item.name}</h3>
            <span className={`${getRarityColor(item.rarity)} text-sm font-semibold`}>
              {item.rarity.charAt(0).toUpperCase() + item.rarity.slice(1)}
            </span>
          </div>
          <p className="text-gray-400 text-sm mb-4 mt-4 line-clamp-2">{item.description}</p>
          <div className="flex justify-center items-center gap-2 mb-4">
            {Number(item.averageRating) > 0 ? (
              <>
                <div className="flex items-center">
                  <span className="text-yellow-400">★</span>
                  <span className="text-gray-300 ml-1">{item.averageRating}</span>
                </div>
                <span className="text-gray-400 text-sm">({item.reviews?.length || 0})</span>
              </>
            ) : (
              <span className="text-gray-400 text-sm">No reviews yet.</span>
            )}
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Level {item.level}</span>
            <span className={`font-bold ${canAfford ? 'text-game-accent' : 'text-red-500'}`}>
              {item.price} coins
            </span>
            <span className={`text-gray-400 ${item.stock === 0 ? 'text-red-500' : ''}`}>
              {item.stock} in stock
            </span>
          </div>
          <div className="mt-3 space-y-1">
            {Object.entries(item.attributes)
              .filter(([_, value]) => value > 0)
              .slice(0, 2)
              .map(([key, value]) => (
                <div key={key} className="text-sm text-gray-300">
                  {key.charAt(0).toUpperCase() + key.slice(1)}: +{value}
                </div>
              ))}
          </div>
          {user && (
            <button
              onClick={handleAddToCart}
              className={`mt-4 w-full font-bold py-2 px-4 rounded transition-colors duration-200 ${
                item.stock === 0
                  ? 'bg-gray-600 cursor-not-allowed'
                  : isInCart
                    ? 'bg-green-600 cursor-not-allowed'
                    : !canAfford
                      ? 'bg-red-600 cursor-not-allowed'
                      : 'bg-game-accent hover:bg-game-accent-dark'
              } text-white`}
              disabled={item.stock === 0 || isInCart || !canAfford}
            >
              {item.stock === 0
                ? 'Out of Stock'
                : isInCart
                  ? 'In Cart'
                  : !canAfford
                    ? 'Not Enough Coins'
                    : 'Add to Cart'}
            </button>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ItemCard;
