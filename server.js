import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const socket = io();
const lobbyDiv = document.getElementById('lobby');
const waitingRoomDiv = document.getElementById('waitingRoom');
const playerList = document.getElementById('playerList');
const currentRoomSpan = document.getElementById('currentRoom');
const readyBtn = document.getElementById('readyBtn');
const readyIndicator = document.getElementById('readyIndicator');
const startBtn = document.getElementById('startBtn');
// ... resto igual...

document.getElementById('joinBtn').onclick = () => {
  myName = document.getElementById('playerName').value.trim();
  myRoom = document.getElementById('roomCode').value.trim().toUpperCase();
  if (!myName || !myRoom) {
    alert("Debes poner tu nombre y código de sala.");
    return;
  }
  // Cambio inmediato (antes del backend)
  lobbyDiv.classList.add('hidden');
  waitingRoomDiv.classList.remove('hidden');
  currentRoomSpan.textContent = myRoom;
  playerList.innerHTML = `<li>${myName} (esperando…)</li>`;

  // Emitir joinRoom
  socket.emit('joinRoom', { roomId: myRoom, name: myName }, (ok, roomInfo) => {
    if (ok) showWaitingRoom(roomInfo);
    else {
      lobbyDiv.classList.remove('hidden');
      waitingRoomDiv.classList.add('hidden');
      alert("No fue posible unirse/crear sala.");
    }
  });
};

socket.on('roomUpdate', showWaitingRoom);

function showWaitingRoom(roomInfo) {
  waitingRoomDiv.classList.remove('hidden');
  currentRoomSpan.textContent = roomInfo.id;
  playerList.innerHTML = "";
  roomInfo.players.forEach(p => {
    playerList.innerHTML += `<li>${p.name}${roomInfo.host===p.id ? ' <span class="text-purple-400">(Host)</span>':''}${p.ready ? ' ✔️':''}</li>`;
  });
  // resto igual...
}

app.use(express.static(path.join(__dirname, "public")));
app.get("*", (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));

class GameRoom {
  constructor(id) {
    this.id = id;
    this.players = [];
    this.host = null;
    this.state = null;
  }
  add(socketId, name) {
    if (this.players.some(p => p.id === socketId)) return false;
    const player = { id: socketId, name, ready: false, pos: 0, money: 1500 };
    this.players.push(player);
    if (!this.host) this.host = socketId;
    return player;
  }
  remove(socketId) {
    this.players = this.players.filter(p => p.id !== socketId);
    if (this.host === socketId && this.players.length)
      this.host = this.players[0].id;
  }
  markReady(socketId, ready) {
    const p = this.players.find(p => p.id === socketId);
    if (p) p.ready = ready;
  }
  allReady() { return this.players.length > 1 && this.players.every(p => p.ready); }
  getInfo() {
    return {
      id: this.id,
      players: this.players.map(p => ({ id: p.id, name: p.name, ready: p.ready })),
      host: this.host
    };
  }
  startGame() {
    this.state = {
      players: this.players.map(p => ({ id: p.id, name: p.name, money: p.money, pos: 0 })),
      turn: 0,
      lastRoll: null
    };
    this.players.forEach(p => p.ready = false);
  }
  applyRoll(dice) {
    const pl = this.state.players[this.state.turn];
    pl.pos = (pl.pos + dice) % 20;
    this.state.lastRoll = dice;
    this.state.turn = (this.state.turn + 1) % this.state.players.length;
  }
  getGameState() { return this.state; }
}

const rooms = {};

io.on("connection", socket => {
  socket.on("join", ({ roomId, name }) => {
    let room = rooms[roomId] ||= new GameRoom(roomId);
    room.add(socket.id, name);
    socket.join(roomId);
    io.to(roomId).emit("room", room.getInfo());
  });

  socket.on("ready", roomId => {
    let room = rooms[roomId];
    if (!room) return;
    room.markReady(socket.id, true);
    io.to(roomId).emit("room", room.getInfo());
    if (room.allReady()) {
      room.startGame();
      io.to(roomId).emit("start", room.getGameState());
    }
  });

  socket.on("start", roomId => {
    let room = rooms[roomId];
    if (!room) return;
    room.startGame();
    io.to(roomId).emit("start", room.getGameState());
  });

  socket.on("roll", roomId => {
    let room = rooms[roomId];
    if (!room || !room.state) return;
    let dice = Math.floor(Math.random()*6+1) + Math.floor(Math.random()*6+1);
    room.applyRoll(dice);
    io.to(roomId).emit("moved", { dice, state: room.getGameState() });
  });

  socket.on("disconnect", () => {
    for (const k in rooms) {
      let room = rooms[k];
      room.remove(socket.id);
      if (room.players.length === 0) delete rooms[k];
      else io.to(k).emit("room", room.getInfo());
    }
  });
});
document.getElementById('joinBtn').onclick = () => {
  myName = document.getElementById('playerName').value.trim();
  myRoom = document.getElementById('roomCode').value.trim().toUpperCase();
  if (!myName || !myRoom) {
    alert("Debes poner tu nombre y código de sala.");
    return;
  }
  // --- CAMBIO DE PANTALLA INMEDIATO ---
  lobbyDiv.classList.add('hidden');
  waitingRoomDiv.classList.remove('hidden');
  currentRoomSpan.textContent = myRoom;
  playerList.innerHTML = `<li>${myName} (esperando…)</li>`;

  // --- Ahora intenta realmente unirse/crear sala ---
  socket.emit('joinRoom', { roomId: myRoom, name: myName }, (ok, roomInfo) => {
    if (ok) showWaitingRoom(roomInfo);
    else {
      // Si falla, volver al lobby y mostrar error
      lobbyDiv.classList.remove('hidden');
      waitingRoomDiv.classList.add('hidden');
      alert('No se pudo unirse o crear sala. Inténtalo de nuevo.');
    }
  });
};

server.listen(3000, () => console.log("http://localhost:3000"));
