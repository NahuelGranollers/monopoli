
import React, { useState, useReducer, useCallback } from 'react';
import { GameState, GamePhase, GameAction, Player, SpaceType, PropertySpace, RailroadSpace, UtilitySpace, TaxSpace, GameSpace } from './types';
import { BOARD_SPACES, PLAYER_TOKENS, PLAYER_COLORS } from './constants';
import Board from './components/Board';
import PlayerInfoPanel from './components/PlayerInfoPanel';
import ActionModal from './components/ActionModal';
import GameLog from './components/GameLog';
import GameSetup from './components/GameSetup';
import { produce } from 'immer';

const initialGameState: GameState = {
  players: [],
  board: JSON.parse(JSON.stringify(BOARD_SPACES)), // Deep copy
  currentPlayerIndex: 0,
  phase: GamePhase.Setup,
  dice: [0, 0],
  gameLog: ['¡Bienvenido a Monopoly!'],
};

const gameReducer = produce((draft: GameState, action: GameAction) => {
  switch (action.type) {
    case 'START_GAME':
        draft.players = action.playerNames.map((name, index) => ({
            id: index,
            name: name || `Jugador ${index + 1}`,
            money: 1500,
            position: 0,
            properties: [],
            inJail: false,
            jailTurns: 0,
            token: PLAYER_TOKENS[index],
            color: PLAYER_COLORS[index],
        }));
        draft.phase = GamePhase.PlayerTurn;
        draft.gameLog.push(`¡Comenzó el juego! ${draft.players[0].name}, es tu turno.`);
        break;

    case 'ROLL_DICE': {
        draft.dice = action.dice;
        draft.phase = GamePhase.DiceRoll;
        const currentPlayer = draft.players[draft.currentPlayerIndex];
        draft.gameLog.push(`${currentPlayer.name} sacó un ${action.dice[0]} y un ${action.dice[1]}.`);
        break;
    }
    
    case 'MOVE_PLAYER': {
        const currentPlayer = draft.players[draft.currentPlayerIndex];
        const move = draft.dice[0] + draft.dice[1];
        const oldPosition = currentPlayer.position;
        const newPosition = (oldPosition + move) % 40;
        currentPlayer.position = newPosition;
        draft.gameLog.push(`${currentPlayer.name} se movió a ${draft.board[newPosition].name}.`);
        if (newPosition < oldPosition) {
            currentPlayer.money += 200;
            draft.gameLog.push(`${currentPlayer.name} pasó por SALIDA y cobró $200.`);
        }
        draft.phase = GamePhase.LandedOnSpace;
        break;
    }

    case 'BUY_PROPERTY': {
        const currentPlayer = draft.players[draft.currentPlayerIndex];
        const space = draft.board[currentPlayer.position] as PropertySpace | RailroadSpace | UtilitySpace;
        if (currentPlayer.money >= space.price) {
            currentPlayer.money -= space.price;
            space.ownerId = currentPlayer.id;
            currentPlayer.properties.push(currentPlayer.position);
            draft.gameLog.push(`${currentPlayer.name} compró ${space.name} por $${space.price}.`);
        }
        draft.phase = GamePhase.EndTurn;
        break;
    }

    case 'PAY_RENT': {
        const currentPlayer = draft.players[draft.currentPlayerIndex];
        const space = draft.board[currentPlayer.position] as PropertySpace | RailroadSpace | UtilitySpace;
        const owner = draft.players.find(p => p.id === space.ownerId);

        if (owner) {
            let rent = 0;
            if (space.type === SpaceType.Property) {
                rent = (space as PropertySpace).rent[0]; // Simplified rent logic
            } else if (space.type === SpaceType.Railroad) {
                const ownedRailroads = draft.players[owner.id].properties.filter(p => (draft.board[p] as GameSpace).type === SpaceType.Railroad).length;
                rent = 25 * Math.pow(2, ownedRailroads - 1);
            } else if (space.type === SpaceType.Utility) {
                const ownedUtilities = draft.players[owner.id].properties.filter(p => (draft.board[p] as GameSpace).type === SpaceType.Utility).length;
                const multiplier = ownedUtilities === 1 ? 4 : 10;
                rent = (draft.dice[0] + draft.dice[1]) * multiplier;
            }
            
            currentPlayer.money -= rent;
            owner.money += rent;
            draft.gameLog.push(`${currentPlayer.name} pagó $${rent} de alquiler a ${owner.name}.`);
        }
        draft.phase = GamePhase.EndTurn;
        break;
    }

    case 'NO_ACTION': {
        draft.phase = GamePhase.EndTurn;
        break;
    }
    
    case 'END_TURN': {
        const nextPlayerIndex = (draft.currentPlayerIndex + 1) % draft.players.length;
        draft.currentPlayerIndex = nextPlayerIndex;
        draft.phase = GamePhase.PlayerTurn;
        draft.dice = [0, 0];
        draft.gameLog.push(`Es el turno de ${draft.players[nextPlayerIndex].name}.`);
        break;
    }
  }
});


export default function App() {
  const [gameState, dispatch] = useReducer(gameReducer, initialGameState);
  const [modalOpen, setModalOpen] = useState(false);

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const currentSpace = gameState.board[currentPlayer?.position];
  
  const handleStartGame = (playerNames: string[]) => {
    dispatch({ type: 'START_GAME', playerNames });
  };
  
  const handleRollDice = () => {
    if (gameState.phase !== GamePhase.PlayerTurn) return;
    const d1 = Math.floor(Math.random() * 6) + 1;
    const d2 = Math.floor(Math.random() * 6) + 1;
    dispatch({ type: 'ROLL_DICE', dice: [d1, d2] });
    
    setTimeout(() => {
        dispatch({ type: 'MOVE_PLAYER' });
        setTimeout(() => setModalOpen(true), 1000);
    }, 1000);
  };
  
  const handleModalAction = useCallback((action: 'buy' | 'pay' | 'ok') => {
    setModalOpen(false);
    if(action === 'buy') dispatch({ type: 'BUY_PROPERTY' });
    else if (action === 'pay') dispatch({ type: 'PAY_RENT' });
    else dispatch({ type: 'NO_ACTION'});
  }, []);

  const handleEndTurn = () => {
    dispatch({type: 'END_TURN'});
  }

  if (gameState.phase === GamePhase.Setup) {
    return <GameSetup onStartGame={handleStartGame} />;
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen font-sans text-gray-800 p-2 sm:p-4">
        <ActionModal 
            isOpen={modalOpen && gameState.phase === GamePhase.LandedOnSpace}
            onClose={() => setModalOpen(false)}
            space={currentSpace}
            player={currentPlayer}
            owner={currentSpace && 'ownerId' in currentSpace && currentSpace.ownerId !== undefined ? gameState.players.find(p => p.id === currentSpace.ownerId) : undefined}
            onAction={handleModalAction}
            dice={gameState.dice}
        />

        <div className="w-full lg:w-1/4 lg:pr-4 flex flex-col space-y-4 mb-4 lg:mb-0">
            <h1 className="text-4xl font-display text-center text-monopoly-bg bg-red-600 p-2 rounded-lg shadow-lg">MONOPOLY</h1>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2">
                {gameState.players.map((player) => (
                    <PlayerInfoPanel key={player.id} player={player} isCurrent={player.id === currentPlayer.id} board={gameState.board}/>
                ))}
            </div>
             <GameLog messages={gameState.gameLog} />
        </div>

        <div className="flex-grow flex flex-col items-center justify-center relative">
            <Board board={gameState.board} players={gameState.players} />
        </div>

        <div className="w-full lg:w-1/6 flex flex-col items-center justify-center lg:pl-4 mt-4 lg:mt-0">
            <div className="bg-monopoly-bg p-4 rounded-lg shadow-lg w-full text-center">
                 <h2 className="text-xl font-bold mb-2 font-display">Turno de {currentPlayer.name}</h2>
                 <div className="flex justify-center my-4 space-x-2">
                     <div className="w-12 h-12 bg-white flex items-center justify-center text-3xl font-bold rounded shadow-inner">{gameState.dice[0] || '?'}</div>
                     <div className="w-12 h-12 bg-white flex items-center justify-center text-3xl font-bold rounded shadow-inner">{gameState.dice[1] || '?'}</div>
                 </div>
                 {gameState.phase === GamePhase.PlayerTurn && <button onClick={handleRollDice} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full w-full transition-colors duration-200">Lanzar Dados</button>}
                 {gameState.phase === GamePhase.EndTurn && <button onClick={handleEndTurn} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full w-full transition-colors duration-200">Terminar Turno</button>}
            </div>
        </div>
    </div>
  );
}
