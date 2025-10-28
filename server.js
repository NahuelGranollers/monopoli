<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Monopoly Dark Sala de Espera</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="/socket.io/socket.io.js"></script>
  <style>
    body{background:#181a1b;color:#eee;font-family:'Century Gothic',sans-serif;}
    .hidden {display: none;}
    .token{position:absolute;width:30px;height:30px;border-radius:50%;background:#06f;box-shadow:0 2px 6px #0004;
      color:#fff;text-align:center;line-height:30px;font-weight:bold;}
    .tile{position:absolute;width:60px;height:60px;border:1px solid #444;background:#232729;
      border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:0.85em;}
  </style>
</head>
<body>
  <!-- Lobby -->
  <div id="lobby">
    <h1>Monopoly Sala</h1>
    <input id="name" placeholder="Tu nombre">
    <input id="room" placeholder="Código">
    <button id="join">Entrar</button>
  </div>

  <!-- Espera -->
  <div id="waiting" class="hidden">
    <h2>Sala <span id="lab"></span></h2>
    <ul id="list"></ul>
    <button id="ready">¡Listo!</button>
    <button id="start" class="hidden">Empezar</button>
  </div>

  <!-- Juego -->
  <div id="game" class="hidden">
    <h3>Partida Sala <span id="glab"></span></h3>
    <div id="info"></div>
    <div id="tablero" style="width:400px;height:400px;position:relative;margin:auto;"></div>
    <button id="roll">Tirar dado</button>
    <div id="msg"></div>
  </div>
  <script>
  const socket = io(), $=v=>document.getElementById(v);
  const tiles = Array.from({length:20},(_,i)=>({x:[0,1,2,3,4,5,5,5,5,5,4,3,2,1,0,0,0,0,0,0][i],y:[0,0,0,0,0,0,1,2,3,4,5,5,5,5,5,4,3,2,1,1][i],name:"C"+i}));
  let mRoom, mName, mHost;

  $("join").onclick = ()=>{
    mRoom=$("room").value.trim().toUpperCase();
    mName=$("name").value.trim();
    if(!mRoom||!mName)return alert("Faltan datos");
    socket.emit("join",{roomId:mRoom,name:mName});
  };

  socket.on("room", info=>{
    $("lobby").classList.add("hidden");
    $("waiting").classList.remove("hidden");
    $("lab").textContent=info.id;
    $("list").innerHTML="";
    info.players.forEach(p=>{
      $("list").innerHTML+=`<li>${p.name} ${info.host===p.id?"(Host)":""} ${p.ready?"✔️":""}</li>`;
    });
    mHost=info.host;
    $("start").classList.toggle("hidden", !(info.host===socket.id && info.players.length>1 && info.players.every(p=>p.ready)));
  });
  $("ready").onclick = ()=>socket.emit("ready", mRoom);
  $("start").onclick=()=>socket.emit("start", mRoom);

  socket.on("start", state=>{
    $("waiting").classList.add("hidden");
    $("game").classList.remove("hidden");
    $("glab").textContent=mRoom;
    paintState(state);
  });
  $("roll").onclick=()=>socket.emit("roll",mRoom);

  socket.on("moved", ({dice,state})=>{
    $("msg").textContent=`Dado: ${dice}. Le toca a ${state.players[state.turn].name}`;
    paintState(state);
  });
  function paintState(state) {
    $("info").innerHTML=state.players.map((p,i)=>
      `<b>${p.name}</b>(\$${p.money})@${p.pos}${i===state.turn?" <b style='color:#f90'>👑</b>":""} `
    ).join("| ");
    $("tablero").innerHTML="";
    tiles.forEach((t,i)=>{
      let o=document.createElement("div");
      o.className="tile";o.style.left=(t.x*70)+"px";o.style.top=(t.y*70)+"px";
      o.textContent=t.name;
      $("tablero").appendChild(o);
    });
    state.players.forEach((p,i)=>{
      let c=document.createElement("div");
      c.className="token";c.style.left=(tiles[p.pos].x*70+10+i*8)+"px";c.style.top=(tiles[p.pos].y*70+10)+"px";
      c.textContent=p.name[0];
      $("tablero").appendChild(c);
    });
  }
  </script>
</body>
</html>
