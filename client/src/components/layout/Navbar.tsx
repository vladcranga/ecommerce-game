import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { logout } from '../../store/slices/authSlice';
import { useEffect } from 'react';
import { fetchCart } from '../../store/slices/cartSlice';
import { AppDispatch } from '../../store';

const Navbar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { items: cartItems = [] } = useSelector((state: RootState) => state.cart);

  useEffect(() => {
    if (user) {
      dispatch(fetchCart());
    }
  }, [dispatch, user]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className="bg-gray-800 py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/store" className="text-2xl font-bold text-game-accent">
          Fantasy Store
        </Link>
        
        <div className="flex items-center gap-6">
          {user ? (
            <>
              <span className="text-gray-300">
                {user.username} | <span className="text-game-accent">{user.points} coins</span> | Level <span className="text-game-accent">{user.level}</span>
              </span>
              <Link to="/store" className="text-gray-300 hover:text-white">
                Store
              </Link>
              <Link to="/inventory" className="text-gray-300 hover:text-white">
                Inventory
              </Link>
              <Link to="/minigames" className="text-gray-300 hover:text-white">
                Minigames
              </Link>
              <Link to="/cart" className="text-gray-300 hover:text-white flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cartItems?.length > 0 && (
                  <span className="ml-1 bg-game-accent text-white rounded-full w-5 h-5 flex items-center justify-center text-sm">
                    {cartItems.length}
                  </span>
                )}
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-300 hover:text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-300 hover:text-white">
                Login
              </Link>
              <Link to="/register" className="text-gray-300 hover:text-white">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
