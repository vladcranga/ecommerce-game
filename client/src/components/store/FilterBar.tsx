import { ChangeEvent } from 'react';

interface FilterBarProps {
  searchTerm: string;
  category: string;
  rarity: string;
  minLevel: string;
  maxPrice: string;
  sortBy: string;
  onSearchChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onCategoryChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  onRarityChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  onMinLevelChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onMaxPriceChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSortChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

const FilterBar = ({
  searchTerm,
  category,
  rarity,
  minLevel,
  maxPrice,
  sortBy,
  onSearchChange,
  onCategoryChange,
  onRarityChange,
  onMinLevelChange,
  onMaxPriceChange,
  onSortChange,
}: FilterBarProps) => {
  const categories = ['all', 'weapon', 'helmet', 'chestpiece', 'boots', 'potion', 'mount'];
  const rarities = ['all', 'common', 'uncommon', 'rare', 'epic', 'legendary'];
  const sortOptions = [
    { value: 'name', label: 'Name (A-Z)' },
    { value: '-name', label: 'Name (Z-A)' },
    { value: 'price', label: 'Price (Low to High)' },
    { value: '-price', label: 'Price (High to Low)' },
    { value: 'level', label: 'Level (Low to High)' },
    { value: '-level', label: 'Level (High to Low)' },
  ];

  // Input validation handlers
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
    e.target.value = value;
    onSearchChange(e);
  };

  const handleMinLevelChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/^0+|[^0-9]/g, '');
    e.target.value = value;
    onMinLevelChange(e);
  };

  const handleMaxPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/^0+|[^0-9]/g, '');
    e.target.value = value;
    onMaxPriceChange(e);
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Search */}
        <div className="flex flex-col">
          <label htmlFor="search" className="text-gray-400 mb-1">
            Search
          </label>
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Enter an item..."
            className="bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-game-accent"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-col">
          <label htmlFor="category" className="text-gray-400 mb-1">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={onCategoryChange}
            className="bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-game-accent"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Rarity Filter */}
        <div className="flex flex-col">
          <label htmlFor="rarity" className="text-gray-400 mb-1">
            Rarity
          </label>
          <select
            id="rarity"
            value={rarity}
            onChange={onRarityChange}
            className="bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-game-accent"
          >
            {rarities.map((r) => (
              <option key={r} value={r}>
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Min Level Filter */}
        <div className="flex flex-col">
          <label htmlFor="minLevel" className="text-gray-400 mb-1">
            Minimum Level
          </label>
          <input
            type="text"
            inputMode="numeric"
            pattern="[1-9][0-9]*"
            id="minLevel"
            value={minLevel}
            onChange={handleMinLevelChange}
            placeholder="Enter a level..."
            min="1"
            className="bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-game-accent"
          />
        </div>

        {/* Max Price Filter */}
        <div className="flex flex-col">
          <label htmlFor="maxPrice" className="text-gray-400 mb-1">
            Maximum Price
          </label>
          <input
            type="text"
            inputMode="numeric"
            pattern="[1-9][0-9]*"
            id="maxPrice"
            value={maxPrice}
            onChange={handleMaxPriceChange}
            placeholder="Enter a price..."
            min="1"
            className="bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-game-accent"
          />
        </div>

        {/* Sort */}
        <div className="flex flex-col">
          <label htmlFor="sort" className="text-gray-400 mb-1">
            Sort By
          </label>
          <select
            id="sort"
            value={sortBy}
            onChange={onSortChange}
            className="bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-game-accent"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
