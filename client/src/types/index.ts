export interface User {
  id: string;
  username: string;
  email: string;
  points: number;
  level: number;
  inventory: InventoryItem[];
  equippedItems: {
    weapon: Item | null;
    helmet: Item | null;
    chestpiece: Item | null;
    boots: Item | null;
    potion: Item | null;
  };
  stats: {
    damage: number;
    defense: number;
    speed: number;
    health: number;
  };
  achievements: Achievement[];
  gameStats: GameStats;
}

export interface InventoryItem {
  item: Item;
  quantity: number;
  acquiredAt: Date;
}

export interface Item {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: 'weapon' | 'helmet' | 'chestpiece' | 'boots' | 'potion' | 'mount';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  attributes: {
    damage?: number;
    defense?: number;
    magic?: number;
    speed?: number;
    health?: number;
  };
  level: number;
  imageUrl: string;
  stock: number;
  reviews: Review[];
  averageRating: number;
}

export interface Review {
  user: {
    _id: string;
    username: string;
  };
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface Achievement {
  name: string;
  description: string;
  unlockedAt: Date;
}

export interface GameStats {
  gamesPlayed: number;
  questsCompleted: number;
  totalTimePlayed: number;
}
