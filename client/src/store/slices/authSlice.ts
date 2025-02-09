import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types';
import axios from '../../utils/axiosConfig';
import { AxiosError } from 'axios';

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  loading: false,
  error: null,
};

// Async thunk to fetch fresh user data
export const fetchUserData = createAsyncThunk(
  'auth/fetchUserData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/auth/me');
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch user data');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

// Async thunks for inventory management
export const equipItem = createAsyncThunk(
  'auth/equipItem',
  async (itemId: string, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post(`/inventory/equip/${itemId}`);
      // Fetch fresh user data after equipping item
      await dispatch(fetchUserData());
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message || 'Failed to equip item');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

export const unequipItem = createAsyncThunk(
  'auth/unequipItem',
  async (slot: string, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post(`/inventory/unequip/${slot}`);
      // Fetch fresh user data after unequipping item
      await dispatch(fetchUserData());
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message || 'Failed to unequip item');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

// Async thunk to add coins
export const addCoins = createAsyncThunk(
  'auth/addCoins',
  async (amount: number, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post('/auth/add-coins', { amount });
      // Fetch fresh user data after adding coins
      await dispatch(fetchUserData());
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message || 'Failed to add coins');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Handle fetchUserData
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        // Update localStorage with fresh data
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCredentials, logout, setLoading, setError } = authSlice.actions;
export default authSlice.reducer;
