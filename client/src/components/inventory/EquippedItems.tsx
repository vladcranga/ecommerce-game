import { Item } from '../../types';
import { useDispatch, useSelector } from 'react-redux';
import { unequipItem } from '../../store/slices/authSlice';
import { RootState } from '../../store';
import { useState } from 'react';
import { AppDispatch } from '../../store';

interface EquippedItemsProps {
  equippedItems: {
    weapon: Item | null;
    helmet: Item | null;
    chestpiece: Item | null;
    boots: Item | null;
    potion: Item | null;
  };
}

interface UnequipWarningProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  stats: Record<string, number>;
}

const UnequipWarning = ({ isOpen, onClose, onConfirm, itemName, stats }: UnequipWarningProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md">
        <h3 className="text-xl font-bold text-white mb-4">Unequip {itemName}?</h3>
        <p className="text-gray-300 mb-4">
          Unequipping this item without equipping another one will reduce your stats by:
        </p>
        <div className="grid grid-cols-2 gap-2 mb-6">
          {Object.entries(stats)
            .filter(([_, value]) => value > 0)
            .map(([key, value]) => (
              <div key={key} className="text-sm">
                <span className="text-gray-400 capitalize">{key}:</span>{' '}
                <span className="text-red-400">-{value}</span>
              </div>
            ))}
        </div>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Unequip
          </button>
        </div>
      </div>
    </div>
  );
};

const EquipmentSlot = ({ item, type }: { item: Item | null; type: string }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [showWarning, setShowWarning] = useState(false);
  const { loading } = useSelector((state: RootState) => state.auth);

  const handleUnequip = async () => {
    setShowWarning(false);
    await dispatch(unequipItem(type));
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-4">
      <h3 className="text-gray-400 mb-2 capitalize">{type}</h3>
      {item ? (
        <div className="relative">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-32 object-contain bg-gray-900 rounded-lg mb-2"
          />
          <div className="text-white font-semibold mb-1">{item.name}</div>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(item.attributes)
              .filter(([_, value]) => value && value > 0)
              .map(([key, value]) => (
                <div key={key} className="text-sm">
                  <span className="text-gray-400 capitalize">{key}:</span>{' '}
                  <span className="text-game-accent">+{value}</span>
                </div>
              ))}
          </div>
          <button
            onClick={() => setShowWarning(true)}
            disabled={loading}
            className="mt-2 w-full bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed text-white px-4 py-1 rounded text-sm"
          >
            {loading ? 'Unequipping...' : 'Unequip'}
          </button>
          <UnequipWarning
            isOpen={showWarning}
            onClose={() => setShowWarning(false)}
            onConfirm={handleUnequip}
            itemName={item.name}
            stats={item.attributes}
          />
        </div>
      ) : (
        <div className="h-32 bg-gray-900 rounded-lg flex items-center justify-center">
          <span className="text-gray-600">Empty {type} slot</span>
        </div>
      )}
    </div>
  );
};

const EquippedItems = ({ equippedItems }: EquippedItemsProps) => {
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Equipment</h2>
      <div>
        <EquipmentSlot item={equippedItems.weapon} type="weapon" />
        <EquipmentSlot item={equippedItems.helmet} type="helmet" />
        <EquipmentSlot item={equippedItems.chestpiece} type="chestpiece" />
        <EquipmentSlot item={equippedItems.boots} type="boots" />
        <EquipmentSlot item={equippedItems.potion} type="potion" />
      </div>
    </div>
  );
};

export default EquippedItems;
