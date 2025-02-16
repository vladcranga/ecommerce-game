import { useSelector } from 'react-redux';
import { RootState } from '../store';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import EquippedItems from '../components/inventory/EquippedItems';
import InventoryGrid from '../components/inventory/InventoryGrid';
import PlayerStats from '../components/inventory/PlayerStats';

const Inventory = () => {
  const { user, loading } = useSelector((state: RootState) => state.auth);

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  const defaultStats = {
    health: 100,
    defense: 5,
    damage: 10,
    magic: 0,
    speed: 10,
  };

  const defaultEquippedItems = {
    weapon: null,
    helmet: null,
    chestpiece: null,
    boots: null,
    potion: null,
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Equipment Slots */}
          <div className="lg:col-span-1">
            <EquippedItems equippedItems={user.equippedItems || defaultEquippedItems} />
          </div>

          {/* Middle Column - Player Stats */}
          <div className="lg:col-span-1">
            <PlayerStats stats={user.stats || defaultStats} />
          </div>

          {/* Right Column - Inventory Grid */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold text-white mb-4">Inventory</h2>
            <InventoryGrid inventory={user.inventory || []} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Inventory;
