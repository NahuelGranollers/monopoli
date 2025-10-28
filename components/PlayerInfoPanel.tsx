
import React from 'react';
import { Player, GameSpace, SpaceType, PropertySpace } from '../types';
import PlayerToken from './PlayerToken';

interface PlayerInfoPanelProps {
  player: Player;
  isCurrent: boolean;
  board: GameSpace[];
}

const PlayerInfoPanel: React.FC<PlayerInfoPanelProps> = ({ player, isCurrent, board }) => {
  const ownedPropertyColors: { [key: string]: number } = {};
  player.properties.forEach(pos => {
    const space = board[pos];
    if (space.type === SpaceType.Property) {
      const color = (space as PropertySpace).color;
      ownedPropertyColors[color] = (ownedPropertyColors[color] || 0) + 1;
    }
  });

  return (
    <div className={`p-2 rounded-lg shadow-md transition-all duration-300 ${isCurrent ? 'bg-yellow-200 ring-2 ring-yellow-500' : 'bg-gray-100'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
            <PlayerToken token={player.token} color={player.color}/>
            <h3 className="font-bold text-sm truncate">{player.name}</h3>
        </div>
        <p className="text-sm font-semibold">${player.money}</p>
      </div>
      <div className="mt-2 flex flex-wrap gap-1">
        {Object.entries(ownedPropertyColors).map(([color, count]) => (
          <div key={color} className={`w-4 h-4 rounded-sm border border-black`} style={{backgroundColor: `var(--tw-color-property-${color})`}}></div>
        ))}
      </div>
    </div>
  );
};

export default PlayerInfoPanel;
