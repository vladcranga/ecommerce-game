import { InventoryItem } from '../../types';
import { useDispatch, useSelector } from 'react-redux';
import { equipItem } from '../../store/slices/authSlice';
import { RootState } from '../../store';
import { AppDispatch } from '../../store';

interface InventoryGridProps {
  inventory: InventoryItem[];
}

const InventoryGrid = ({ inventory }: InventoryGridProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, user } = useSelector((state: RootState) => state.auth);

  const getRarityColor = (rarity: string) => {
    switch (rarity?.toLowerCase()) {
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

  const handleEquip = async (itemId: string) => {
    try {
      await dispatch(equipItem(itemId));
    } catch (error) {
      console.error('Error equipping item:', error);
    }
  };

  const renderInventoryItems = () => {
    if (!inventory) {
      console.warn('No inventory found');
      return null;
    }

    // Get list of equipped item IDs
    const equippedItemIds = user?.equippedItems
      ? Object.values(user.equippedItems)
          .filter(Boolean)
          .map((item) => item?._id)
      : [];

    return inventory
      .filter((invItem) => {
        // Filter out equipped items
        const itemId = typeof invItem.item === 'string' ? invItem.item : invItem.item._id;
        return !equippedItemIds.includes(itemId);
      })
      .map((invItem, index) => {
        // Skip invalid items
        if (!invItem || !invItem.item) {
          console.warn(`Invalid inventory item at index ${index}:`, invItem);
          return null;
        }

        // Handle case where item is just an ID
        if (typeof invItem.item === 'string') {
          console.warn(`Item at index ${index} is not populated:`, invItem.item);
          return null;
        }

        const item = invItem.item;

        return (
          <div key={item._id} className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-start gap-4">
              <img
                src={item.imageUrl || '/default-item.png'}
                alt={item.name}
                className="w-20 h-20 object-contain bg-gray-900 rounded-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/default-item.png';
                }}
              />
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-white font-semibold">{item.name}</h3>
                  <span className={`${getRarityColor(item.rarity)} text-sm`}>
                    {item.rarity.charAt(0).toUpperCase() + item.rarity.slice(1)}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mb-2">{item.description}</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {Object.entries(item.attributes || {})
                    .filter(([_, value]) => typeof value === 'number' && value > 0)
                    .map(([key, value]) => (
                      <div key={key}>
                        <span className="text-gray-400 capitalize">{key}:</span>{' '}
                        <span className="text-game-accent">+{value}</span>
                      </div>
                    ))}
                </div>
                <button
                  onClick={() => handleEquip(item._id)}
                  disabled={loading}
                  className="mt-2 bg-game-accent hover:bg-game-accent-dark disabled:bg-game-accent-dark disabled:cursor-not-allowed text-white px-4 py-1 rounded text-sm"
                >
                  {loading ? 'Equipping...' : 'Equip'}
                </button>
              </div>
            </div>
          </div>
        );
      })
      .filter(Boolean); // Remove null items
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      {renderInventoryItems()}
      {inventory.length === 0 && (
        <div className="text-gray-400 text-center py-8">Your inventory is empty</div>
      )}
    </div>
  );
};

export default InventoryGrid;
