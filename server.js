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

// Servir frontend compilado
app.use(express.static(path.join(__dirname, "dist")));
app.get("*", (req, res) => res.sendFile(path.join(__dirname, "dist", "index.html")));

class GameRoom {
  constructor(id, maxPlayers = 6) {
    this.id = id;
    this.players = [];
    this.maxPlayers = maxPlayers;
    this.host = null;
    this.state = null;
  }
  addPlayer(socketId, name) {
    if (this.players.some(p => p.id === socketId)) return false;
    if (this.players.length >= this.maxPlayers) return false;
    const player = { id: socketId, name, ready: false, pos: 0, money: 1500 };
    this.players.push(player);
    if (!this.host) this.host = socketId;
    return player;
  }
  removePlayer(socketId) {
    this.players = this.players.filter(p => p.id !== socketId);
    if (this.host === socketId && this.players.length)
      this.host = this.players[0].id;
  }
  markReady(socketId, ready) {
    const player = this.players.find(p => p.id === socketId);
    if (player) player.ready = ready;
  }
  isAllReady() { return this.players.length > 1 && this.players.every(p => p.ready); }
  getInfo() {
    return {
      id: this.id,
      players: this.players.map(p => ({ id: p.id, name: p.name, ready: p.ready })),
      maxPlayers: this.maxPlayers,
      host: this.host
    };
  }
  startGame() {
    // Inicializa el estado de partida real
    this.state = {
      players: this.players.map(p=>({ id:p.id, name:p.name, money:p.money, pos:0 })),
      turn: 0,
      lastRoll: null
    };
  }
  applyRoll(value) {
    const player = this.state.players[this.state.turn];
    player.pos = (player.pos + value) % 20; // 20 casillas demo
    this.state.lastRoll = value;
    this.state.turn = (this.state.turn + 1) % this.state.players.length;
  }
  getGameState() { return this.state; }
}

const rooms = {};

function broadcastRooms() {
  io.emit("roomsUpdate", Object.values(rooms).map(r=>r.getInfo()));
}

io.on("connection", socket => {
  socket.on("createRoom", ({ name, maxPlayers }, cb) => {
    const roomId = Math.random().toString(36).slice(2, 8).toUpperCase();
    rooms[roomId] = new GameRoom(roomId, maxPlayers);
    rooms[roomId].addPlayer(socket.id, name);
    socket.join(roomId);
    cb(roomId, rooms[roomId].getInfo());
    io.to(roomId).emit("roomUpdate", rooms[roomId].getInfo());
    broadcastRooms();
  });

  socket.on("joinRoom", ({ roomId, name }, cb) => {
    let room = rooms[roomId];
    if (room && room.addPlayer(socket.id, name)) {
      socket.join(roomId);
      cb(true, room.getInfo());
      io.to(roomId).emit("roomUpdate", room.getInfo());
    } else cb(false);
    broadcastRooms();
  });

  socket.on("markReady", ({ roomId, ready }) => {
    let room = rooms[roomId];
    if (!room) return;
    room.markReady(socket.id, ready);
    io.to(roomId).emit("roomUpdate", room.getInfo());
    if (room.isAllReady()) {
      room.startGame();
      io.to(roomId).emit("gameStart", room.getGameState());
    }
  });

  socket.on("startGame", ({ roomId }) => {
    let room = rooms[roomId];
    if (!room) return;
    room.startGame();
    io.to(roomId).emit("gameStart", room.getGameState());
  });

  socket.on("syncAction", ({ roomId, action }) => {
    const room = rooms[roomId];
    // Lógica de dados y turno
    if (action.type === "roll") {
      room.applyRoll(action.value);
      io.to(roomId).emit("syncAction", { type: "roll", value: action.value });
      io.to(roomId).emit("gameStart", room.getGameState());
    }
    // Extiende: compra, pagos, tarjetas, jail, etc.
  });

  socket.on("leaveRoom", ({ roomId }) => {
    let room = rooms[roomId];
    if (!room) return;
    room.removePlayer(socket.id);
    socket.leave(roomId);
    if (room.players.length === 0) delete rooms[roomId];
    else io.to(roomId).emit("roomUpdate", room.getInfo());
    broadcastRooms();
  });

  socket.on("disconnect", () => {
    for (const roomId in rooms) {
      let room = rooms[roomId];
      room.removePlayer(socket.id);
      if (room.players.length === 0) delete rooms[roomId];
      else io.to(roomId).emit("roomUpdate", room.getInfo());
    }
    broadcastRooms();
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Monopoly Multiplayer server running on http://0.0.0.0:${PORT}`);
});
