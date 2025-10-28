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

app.use(express.static(path.join(__dirname, "dist")));
app.get("*", (req, res) => res.sendFile(path.join(__dirname, "dist", "index.html")));

class GameRoom {
  constructor(id, maxPlayers = 6) {
    this.id = id;
    this.players = [];
    this.maxPlayers = maxPlayers;
    this.host = null;
  }
  addPlayer(socketId, name) {
    if (this.players.some(p => p.id === socketId)) return false;
    if (this.players.length >= this.maxPlayers) return false;
    const player = { id: socketId, name, ready: false };
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
  getInfo() { return { id: this.id, players: this.players, maxPlayers: this.maxPlayers, host: this.host }; }
}

const rooms = {};

io.on("connection", socket => {
  socket.on("createRoom", ({ name, maxPlayers }, cb) => {
    const roomId = Math.random().toString(36).slice(2, 8).toUpperCase();
    rooms[roomId] = new GameRoom(roomId, maxPlayers);
    rooms[roomId].addPlayer(socket.id, name);
    socket.join(roomId);
    cb(roomId, rooms[roomId].getInfo());
    io.emit("roomsUpdate", Object.values(rooms).map(r => r.getInfo()));
  });
  socket.on("joinRoom", ({ roomId, name }, cb) => {
    const room = rooms[roomId];
    if (room && room.addPlayer(socket.id, name)) {
      socket.join(roomId);
      cb(true, room.getInfo());
      io.to(roomId).emit("roomUpdate", room.getInfo());
    } else cb(false);
    io.emit("roomsUpdate", Object.values(rooms).map(r => r.getInfo()));
  });
  socket.on("markReady", ({ roomId, ready }) => {
    const room = rooms[roomId];
    if (!room) return;
    room.markReady(socket.id, ready);
    io.to(roomId).emit("roomUpdate", room.getInfo());
    if (room.isAllReady()) {
      io.to(roomId).emit("gameStart", room.state);
    }
  });
  socket.on("syncAction", ({ roomId, action }) => {
    io.to(roomId).emit("syncAction", action);
  });
  socket.on("leaveRoom", ({ roomId }) => {
    const room = rooms[roomId];
    if (!room) return;
    room.removePlayer(socket.id);
    socket.leave(roomId);
    if (room.players.length === 0) delete rooms[roomId];
    else io.to(roomId).emit("roomUpdate", room.getInfo());
    io.emit("roomsUpdate", Object.values(rooms).map(r => r.getInfo()));
  });
  socket.on("disconnect", () => {
    for (const roomId in rooms) {
      const room = rooms[roomId];
      room.removePlayer(socket.id);
      if (room.players.length === 0) delete rooms[roomId];
      else io.to(roomId).emit("roomUpdate", room.getInfo());
    }
    io.emit("roomsUpdate", Object.values(rooms).map(r => r.getInfo()));
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Monopoly Multiplayer server running on http://0.0.0.0:${PORT}`);
});
