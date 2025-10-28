
import React from 'react';
import { GameSpace, Player, SpaceType, PropertySpace } from '../types';
import PlayerToken from './PlayerToken';

interface BoardProps {
  board: GameSpace[];
  players: Player[];
}

const getGridPosition = (index: number) => {
  if (index >= 0 && index <= 10) return { gridRow: '11', gridColumn: `${11 - index}` };
  if (index >= 11 && index <= 20) return { gridRow: `${11 - (index - 10)}`, gridColumn: '1' };
  if (index >= 21 && index <= 30) return { gridRow: '1', gridColumn: `${1 + (index - 20)}` };
  if (index >= 31 && index <= 39) return { gridRow: `${1 + (index - 30)}`, gridColumn: '11' };
  return {};
};

const Space: React.FC<{ space: GameSpace, index: number, children: React.ReactNode }> = ({ space, index, children }) => {
    const isCorner = index % 10 === 0;
    const isBottomRow = index > 0 && index < 10;
    const isTopRow = index > 20 && index < 30;

    const baseClasses = 'border border-gray-400 flex flex-col justify-between items-center relative text-center p-1';
    const cornerClasses = 'w-24 h-24 sm:w-28 sm:h-28';
    const horizontalClasses = 'w-16 h-24 sm:w-20 sm:h-28';
    const verticalClasses = 'w-24 h-16 sm:w-28 sm:h-20';

    let sizeClasses = '';
    if(isCorner) sizeClasses = cornerClasses;
    else if (isBottomRow || isTopRow) sizeClasses = horizontalClasses;
    else sizeClasses = verticalClasses;

    const nameClasses = `text-[8px] sm:text-xs font-bold ${isBottomRow ? 'order-last' : 'order-first'}`;

    return (
        <div style={getGridPosition(index)} className={`bg-monopoly-tile ${baseClasses} ${sizeClasses}`}>
            {space.type === SpaceType.Property && (
                <div 
                  className={`w-full h-5 sm:h-6 ${isBottomRow ? 'order-first' : 'order-last'} border-b border-gray-400`}
                  style={{backgroundColor: `var(--tw-color-property-${(space as PropertySpace).color})`}}
                ></div>
            )}
            <div className={nameClasses}>{space.name}</div>
            {space.type === SpaceType.Property && <div className="text-[7px] sm:text-[10px]">${(space as PropertySpace).price}</div>}
             <div className="absolute inset-0 flex flex-wrap items-center justify-center p-1 gap-1">
                {children}
            </div>
        </div>
    )
}

const Board: React.FC<BoardProps> = ({ board, players }) => {
  return (
    <div className="relative aspect-square w-full max-w-[90vh] lg:max-w-[80vh] bg-monopoly-board p-2 sm:p-4 shadow-2xl rounded-lg">
      <div className="grid grid-cols-11 grid-rows-11 w-full h-full">
        {board.map((space, index) => (
          <Space key={index} space={space} index={index}>
             {players
                .filter(p => p.position === index)
                .map(p => <PlayerToken key={p.id} token={p.token} color={p.color} />)}
          </Space>
        ))}
        <div className="col-start-2 col-span-9 row-start-2 row-span-9 bg-monopoly-board flex justify-center items-center">
            <div className="text-6xl font-display text-red-600 -rotate-45">MONOPOLY</div>
        </div>
      </div>
    </div>
  );
};

export default Board;
