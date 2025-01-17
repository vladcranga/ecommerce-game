import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { fetchCart, removeFromCart, checkout } from '../store/slices/cartSlice';
import { toast } from 'react-toastify';
import { AppDispatch } from '../store';
import Navbar from '../components/layout/Navbar';

const Cart = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: cartItems = [], loading, error } = useSelector((state: RootState) => state.cart);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleRemoveFromCart = async (itemId: string) => {
    try {
      await dispatch(removeFromCart(itemId)).unwrap();
    } catch (error) {
      toast.error('Failed to remove item from cart');
    }
  };

  const handlePurchase = async () => {
    try {
      await dispatch(checkout()).unwrap();
      toast.success('Purchase successful!');
    } catch (error) {
      toast.error('Failed to purchase items');
    }
  };

  const calculateTotal = () => {
    return (cartItems || []).reduce((total, item) => total + item.item.price, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6 text-white">Loading...</h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6 text-white">Error loading cart</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-white">Shopping Cart</h1>
        {cartItems.length === 0 ? (
          <div className="text-gray-300">Your cart is empty</div>
        ) : (
          <div className="space-y-6">
            {cartItems.map((cartItem) => (
              <div
                key={cartItem.item._id}
                className="bg-gray-800 p-4 rounded-lg flex items-center justify-between"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={cartItem.item.imageUrl}
                    alt={cartItem.item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {cartItem.item.name}
                    </h3>
                    <p className="text-gray-400">{cartItem.item.description}</p>
                    <p className="text-game-accent">{cartItem.item.price} coins</p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveFromCart(cartItem.item._id)}
                  className="text-red-500 hover:text-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
            <div className="mt-6 flex justify-between items-center">
              <div className="text-xl text-white">
                Total: <span className="text-game-accent">{calculateTotal()} coins</span>
              </div>
              <button
                onClick={handlePurchase}
                disabled={!user || user.points < calculateTotal()}
                className={`px-6 py-2 rounded ${
                  !user || user.points < calculateTotal()
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-game-accent hover:bg-game-accent-dark'
                } text-white font-semibold`}
              >
                Purchase
              </button>
            </div>
            {user && user.points < calculateTotal() && (
              <p className="text-red-500 mt-2">
                You don't have enough coins to make this purchase
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
