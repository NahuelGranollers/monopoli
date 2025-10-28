
import React, { useState } from 'react';
import { PLAYER_TOKENS } from '../constants';

interface GameSetupProps {
  onStartGame: (playerNames: string[]) => void;
}

const GameSetup: React.FC<GameSetupProps> = ({ onStartGame }) => {
  const [numPlayers, setNumPlayers] = useState(2);
  const [playerNames, setPlayerNames] = useState<string[]>(Array(6).fill(''));

  const handleNameChange = (index: number, name: string) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
  };

  const handleStart = () => {
    onStartGame(playerNames.slice(0, numPlayers));
  };

  return (
    <div className="min-h-screen bg-monopoly-bg flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
        <h1 className="text-4xl font-display text-center text-monopoly-bg bg-red-600 p-2 rounded-lg shadow-lg mb-6">CONFIGURACIÓN DE MONOPOLY</h1>
        
        <div className="mb-6">
          <label htmlFor="numPlayers" className="block text-lg font-medium text-gray-700 mb-2">Número de Jugadores</label>
          <select
            id="numPlayers"
            value={numPlayers}
            onChange={(e) => setNumPlayers(Number(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            {[2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        
        <div className="space-y-4 mb-8">
          {Array.from({ length: numPlayers }).map((_, index) => (
            <div key={index} className="flex items-center space-x-3">
              <span className="text-2xl">{PLAYER_TOKENS[index].charAt(0).toUpperCase()}</span>
              <input
                type="text"
                placeholder={`Nombre del Jugador ${index + 1}`}
                value={playerNames[index]}
                onChange={(e) => handleNameChange(index, e.target.value)}
                className="flex-grow p-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
          ))}
        </div>
        
        <button
          onClick={handleStart}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold text-xl py-3 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105"
        >
          Comenzar Juego
        </button>
      </div>
    </div>
  );
};

export default GameSetup;
