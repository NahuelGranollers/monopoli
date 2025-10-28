
import React from 'react';
import { GameSpace, Player, SpaceType, PropertySpace, RailroadSpace, UtilitySpace, TaxSpace } from '../types';

interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  space: GameSpace | undefined;
  player: Player;
  owner?: Player;
  onAction: (action: 'buy' | 'pay' | 'ok') => void;
  dice: [number, number];
}

const ActionModal: React.FC<ActionModalProps> = ({ isOpen, onClose, space, player, owner, onAction, dice }) => {
  if (!isOpen || !space) return null;

  const renderContent = () => {
    switch (space.type) {
      case SpaceType.Property:
      case SpaceType.Railroad:
      case SpaceType.Utility:
        if (space.ownerId === undefined) {
          return (
            <>
              <h3 className="text-xl font-bold">¿Comprar {space.name}?</h3>
              <p className="my-4">El precio es ${space.price}. Tienes ${player.money}.</p>
              <div className="flex justify-end space-x-4">
                <button onClick={() => onAction('ok')} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Pasar</button>
                <button 
                  onClick={() => onAction('buy')} 
                  disabled={player.money < space.price}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
                >
                  Comprar
                </button>
              </div>
            </>
          );
        } else if (space.ownerId !== player.id) {
          let rent = 0;
            if (space.type === SpaceType.Property) rent = (space as PropertySpace).rent[0];
            else if (space.type === SpaceType.Railroad) rent = 25; // Simplified
            else if (space.type === SpaceType.Utility) rent = (dice[0] + dice[1]) * 4; // Simplified
          return (
            <>
              <h3 className="text-xl font-bold">Pagar Alquiler</h3>
              <p className="my-4">Esta propiedad pertenece a {owner?.name}. Paga ${rent} de alquiler.</p>
              <div className="flex justify-end">
                <button onClick={() => onAction('pay')} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Pagar Alquiler</button>
              </div>
            </>
          );
        } else {
            return (
                <>
                    <h3 className="text-xl font-bold">Tu Propiedad</h3>
                    <p className="my-4">Caíste en tu propia propiedad: {space.name}.</p>
                    <div className="flex justify-end">
                        <button onClick={() => onAction('ok')} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">OK</button>
                    </div>
                </>
            );
        }
      case SpaceType.Tax:
        return (
            <>
              <h3 className="text-xl font-bold">{space.name}</h3>
              <p className="my-4">Paga ${(space as TaxSpace).amount}.</p>
               <div className="flex justify-end">
                  <button onClick={() => onAction('pay')} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Pagar Impuesto</button>
               </div>
            </>
          );
      case SpaceType.GoToJail:
         return (
            <>
              <h3 className="text-xl font-bold">¡Vaya a la Cárcel!</h3>
              <p className="my-4">Debes ir directamente a la cárcel. No pases por SALIDA, no cobres $200.</p>
               <div className="flex justify-end">
                  <button onClick={() => onAction('ok')} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">OK</button>
               </div>
            </>
          );
      default:
        return (
            <>
              <h3 className="text-xl font-bold">{space.name}</h3>
              <p className="my-4">Caíste en {space.name}.</p>
               <div className="flex justify-end">
                  <button onClick={() => onAction('ok')} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">OK</button>
               </div>
            </>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
        {renderContent()}
      </div>
    </div>
  );
};

export default ActionModal;
