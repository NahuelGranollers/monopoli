import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io();

export default function Lobby({ setGameRoom }) {
  const [rooms, setRooms] = useState([]);
  const [playerName, setPlayerName] = useState('');
  const [maxPlayers, setMaxPlayers] = useState(4);

  useEffect(() => {
    socket.on('roomsUpdate', setRooms);
    return () => socket.off('roomsUpdate');
  }, []);

  const createRoom = () => {
    socket.emit('createRoom', { name: playerName, maxPlayers }, (roomId, info) => {
      setGameRoom(info);
    });
  };

  const joinRoom = (id) => {
    socket.emit('joinRoom', { roomId: id, name: playerName }, (ok, info) => {
      if (ok) setGameRoom(info);
      else alert("No se puede unir");
    });
  };

  return (
    <div>
      <h2>Lobby de Monopoly Online</h2>
      <input placeholder="Tu nombre" value={playerName} onChange={e => setPlayerName(e.target.value)} />
      <button onClick={createRoom}>Crear Sala</button>
      <h3>Salas activas</h3>
      <ul>
        {rooms.map(r => (
          <li key={r.id}>
            Sala {r.id} ({r.players.length}/{r.maxPlayers})
            <button onClick={() => joinRoom(r.id)}>Unirse</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
