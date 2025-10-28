import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Lobby from './Lobby';

const socket = io();

function AppMultiplayer() {
  const [room, setRoom] = useState(null);

  useEffect(() => {
    socket.on('gameStart', (state) => {
      // iniciar el juego con el estado recibido
    });

    socket.on('syncAction', (action) => {
      // aplica acción de otro jugador al estado del juego
    });

    return () => {
      socket.off('gameStart');
      socket.off('syncAction');
    };
  }, []);

  const syncDispatch = (action) => {
    socket.emit('syncAction', { roomId: room.id, action });
    // además de aplicarla localmente
  };

  if (!room) return <Lobby setGameRoom={setRoom} />;
  // Si room existe, mostrar el juego y usar syncDispatch para acciones

  return (
    <div>
      {/* Renderiza tu juego aquí, usando syncDispatch */}
    </div>
  );
}

export default AppMultiplayer;
