interface PlayerStatsProps {
  stats: {
    health: number;
    defense: number;
    damage: number;
    magic: number;
    speed: number;
  };
}

const StatBar = ({ label, value, max = 100 }: { label: string; value: number; max?: number }) => (
  <div className="mb-4">
    <div className="flex justify-between mb-1">
      <span className="text-gray-400">{label}</span>
      <span className="text-game-accent">{value}</span>
    </div>
    <div className="w-full bg-gray-700 rounded-full h-2.5">
      <div
        className="bg-game-accent rounded-full h-2.5"
        style={{ width: `${(value / max) * 100}%` }}
      ></div>
    </div>
  </div>
);

const PlayerStats = ({ stats }: PlayerStatsProps) => {
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Player Stats</h2>
      <div className="space-y-6">
        <StatBar label="Health" value={stats.health} max={500} />
        <StatBar label="Defense" value={stats.defense} />
        <StatBar label="Damage" value={stats.damage} />
        <StatBar label="Magic" value={stats.magic} />
        <StatBar label="Speed" value={stats.speed} />
      </div>
    </div>
  );
};

export default PlayerStats;
