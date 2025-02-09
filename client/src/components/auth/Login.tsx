import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { auth } from '../../services/api';
import { setCredentials } from '../../store/slices/authSlice';
import { Link } from 'react-router-dom';
import { AxiosError } from 'axios';
import type { FormEvent } from 'react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await auth.login({ email, password });
      dispatch(setCredentials(data));
      navigate('/store');
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || 'Login failed');
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
        <Link to="/" className="text-game-accent hover:text-game-accent-dark mb-6 inline-block">
          ← Back to Home
        </Link>
        <h2 className="text-3xl font-bold text-game-accent mb-6 text-center">Login</h2>
        {error && <div className="bg-red-500 text-white p-3 rounded mb-4 text-center">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full bg-gray-700 rounded px-4 py-2 text-white 
                focus:outline-none focus:ring-2 focus:ring-game-accent`}
              required
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full bg-gray-700 rounded px-4 py-2 text-white 
                focus:outline-none focus:ring-2 focus:ring-game-accent`}
              required
            />
          </div>
          <button
            type="submit"
            className={`w-full bg-game-accent hover:bg-yellow-500 text-gray-900 
              font-bold py-2 px-4 rounded transition duration-300`}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
