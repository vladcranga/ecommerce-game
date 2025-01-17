import { Link } from 'react-router-dom';

import legendaryWeapon from '../assets/legendary_sword.jpg';
import game64Screenshot from '../assets/game_64.png';
import inventoryIcon from '../assets/inventory_item.png';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Welcome to the{' '}
            <span className="text-game-accent">Fantasy Game Store</span>
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Discover legendary items, earn coins, and build your inventory in this
            unique gaming marketplace.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/login"
              className="bg-game-accent hover:bg-yellow-500 text-gray-900 font-bold py-3 px-8 rounded-lg transition duration-300"
            >
              Login
              </Link>
            <Link
              to="/register"
              className="bg-game-secondary hover:bg-red-500 text-white font-bold py-3 px-8 rounded-lg transition duration-300"
            >
              Register
              </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="h-48 mb-4 bg-gray-900 rounded-lg overflow-hidden">
              <img 
                src={legendaryWeapon}
                alt="Legendary Sword" 
                className="w-full h-full object-contain"
              />
            </div>
            <h3 className="text-xl font-bold mb-4 text-game-accent">Epic Items</h3>
            <p className="text-gray-400">
              Browse through our collection of legendary weapons, armor, and magical artifacts.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="h-48 mb-4 bg-gray-900 rounded-lg overflow-hidden">
              <img 
                src={game64Screenshot}
                alt="Game 64" 
                className="w-full h-full object-contain"
              />
            </div>
            <h3 className="text-xl font-bold mb-4 text-game-accent">Mini Games</h3>
            <p className="text-gray-400">
              Complete exciting challenges and earn coins to unlock special items.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="h-48 mb-4 bg-gray-900 rounded-lg overflow-hidden">
              <img 
                src={inventoryIcon}
                alt="Inventory System" 
                className="w-full h-full object-contain"
              />
            </div>
            <h3 className="text-xl font-bold mb-4 text-game-accent">Inventory System</h3>
            <p className="text-gray-400">
              Manage your collection with our advanced inventory system. Equip, unequip, and watch your stats grow with ease.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
