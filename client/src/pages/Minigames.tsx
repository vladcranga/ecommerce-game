import { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Game48 from '../components/minigames/Game48';
import game64Screenshot from '../assets/game_64.png';

const Minigames = () => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  const games = [
    {
      id: 'game48',
      name: '64',
      description: 'Combine numbers to reach 64! A simpler version of 2048.',
      reward: 'Earn up to 50 coins per win!',
      screenshot: game64Screenshot,
      component: Game48,
    },
    // More games can be added here
  ];

  const GameComponent = selectedGame
    ? games.find((game) => game.id === selectedGame)?.component
    : null;

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-white">Minigames</h1>

        {!selectedGame ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game) => (
              <div
                key={game.id}
                className="bg-gray-800 rounded-lg p-6 cursor-pointer hover:bg-gray-700 transition-colors flex flex-col"
                onClick={() => setSelectedGame(game.id)}
              >
                <div className="relative w-full aspect-video mb-4 overflow-hidden rounded-lg">
                  <img
                    src={game.screenshot}
                    alt={`${game.name} screenshot`}
                    className="w-full h-full object-contain hover:scale-110 transition-transform duration-200"
                  />
                </div>
                <h2 className="text-xl font-bold text-game-accent mb-2">{game.name}</h2>
                <p className="text-gray-300 mb-4 flex-grow">{game.description}</p>
                <p className="text-sm text-game-accent">{game.reward}</p>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <button
              onClick={() => setSelectedGame(null)}
              className="mb-6 text-gray-300 hover:text-white flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Back to Games
            </button>
            {GameComponent && (
              <div className="bg-gray-800 rounded-lg p-6">
                <GameComponent />
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Minigames;
