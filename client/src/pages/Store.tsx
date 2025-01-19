import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { items } from '../services/api';
import { setItems, setError } from '../store/slices/itemsSlice';
import ItemCard from '../components/store/ItemCard';
import FilterBar from '../components/store/FilterBar';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { Item } from '../types';
import { AppDispatch } from '../store';

const Store = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: storeItems, error } = useSelector((state: RootState) => state.items);
  const { items: cartItems } = useSelector((state: RootState) => state.cart);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [rarity, setRarity] = useState('all');
  const [minLevel, setMinLevel] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('name');

  const fetchItems = async () => {
    try {
      const response = await items.getAll();
      dispatch(setItems(response.data));
    } catch (err: any) {
      dispatch(setError(err.message));
    }
  };

  useEffect(() => {
    fetchItems();
  }, [dispatch]);

  // Refresh items when cart changes
  useEffect(() => {
    fetchItems();
  }, [cartItems]);

  // Filter and sort items
  const filteredItems = useMemo(() => {
    return storeItems
      .filter((item: Item) => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = category === 'all' || item.category === category;
        const matchesRarity = rarity === 'all' || item.rarity === rarity;
        const matchesLevel = !minLevel || item.level >= parseInt(minLevel);
        const matchesPrice = !maxPrice || item.price <= parseInt(maxPrice);

        return matchesSearch && matchesCategory && matchesRarity && matchesLevel && matchesPrice;
      })
      .sort((a: Item, b: Item) => {
        const [field, order] = sortBy.startsWith('-') 
          ? [sortBy.slice(1), -1] 
          : [sortBy, 1];

        if (field === 'name') {
          return order * a.name.localeCompare(b.name);
        }
        return order * (a[field as keyof Item] as number - (b[field as keyof Item] as number));
      });
  }, [storeItems, searchTerm, category, rarity, minLevel, maxPrice, sortBy]);

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <div className="container mx-auto px-4 py-8">        
        {error && (
          <div className="bg-red-500 text-white p-4 rounded mb-4">
            {error}
          </div>
        )}

        <FilterBar
          searchTerm={searchTerm}
          category={category}
          rarity={rarity}
          minLevel={minLevel}
          maxPrice={maxPrice}
          sortBy={sortBy}
          onSearchChange={(e) => setSearchTerm(e.target.value)}
          onCategoryChange={(e) => setCategory(e.target.value)}
          onRarityChange={(e) => setRarity(e.target.value)}
          onMinLevelChange={(e) => setMinLevel(e.target.value)}
          onMaxPriceChange={(e) => setMaxPrice(e.target.value)}
          onSortChange={(e) => setSortBy(e.target.value)}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <ItemCard key={item._id} item={item} />
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center text-gray-400 py-8">
            No items found matching your criteria
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Store;
