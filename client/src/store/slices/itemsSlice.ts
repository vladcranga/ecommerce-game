import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Item } from '../../types';

interface ItemsState {
  items: Item[];
  selectedItem: Item | null;
  loading: boolean;
  error: string | null;
}

const initialState: ItemsState = {
  items: [],
  selectedItem: null,
  loading: false,
  error: null,
};

const itemsSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {
    setItems: (state, action: PayloadAction<Item[]>) => {
      state.items = action.payload;
    },
    setSelectedItem: (state, action: PayloadAction<Item>) => {
      state.selectedItem = action.payload;
    },
    addItem: (state, action: PayloadAction<Item>) => {
      state.items.push(action.payload);
    },
    updateItem: (state, action: PayloadAction<Item>) => {
      const index = state.items.findIndex(item => item._id === action.payload._id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item._id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setItems,
  setSelectedItem,
  addItem,
  updateItem,
  deleteItem,
  setLoading,
  setError,
} = itemsSlice.actions;

export default itemsSlice.reducer;
