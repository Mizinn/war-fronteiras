const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const crypto = require("crypto");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  // O frontend e o servidor ficam no mesmo domínio quando hospedados online.
  // Em desenvolvimento, também aceitamos conexões locais.
  cors: { origin: true, credentials: true },
  transports: ["polling", "websocket"]
});
app.use(express.json());
app.use(express.static("public", { extensions: ["html"] }));

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    game: "WAR: Fronteiras",
    rooms: rooms.size,
    uptime: Math.round(process.uptime())
  });
});

const PORT = Number(process.env.PORT) || 3000;
const rooms = new Map();

const TERRITORIES = {
  norte: {name:"Norte", continent:"Aurora", neighbors:["nordeste","oeste","centro"]},
  nordeste: {name:"Nordeste", continent:"Aurora", neighbors:["norte","leste","centro"]},
  oeste: {name:"Oeste", continent:"Aurora", neighbors:["norte","centro","sudoeste"]},
  centro: {name:"Centro", continent:"Aurora", neighbors:["norte","nordeste","oeste","leste","sul","sudoeste","sudeste"]},
  leste: {name:"Leste", continent:"Aurora", neighbors:["nordeste","centro","sudeste"]},
  sudoeste: {name:"Sudoeste", continent:"Atlantica", neighbors:["oeste","centro","sul","pacifico"]},
  sul: {name:"Sul", continent:"Atlantica", neighbors:["sudoeste","centro","sudeste","antartico"]},
  sudeste: {name:"Sudeste", continent:"Atlantica", neighbors:["centro","leste","sul","pacifico"]},
  pacifico: {name:"Pacifico", continent:"Atlantica", neighbors:["sudoeste","sudeste","oceania"]},
  antartico: {name:"Antartico", continent:"Atlantica", neighbors:["sul","oceania"]},
  europa: {name:"Europa", continent:"Europa", neighbors:["norteafrica","asiaocidental","asia","escandinavia"]},
  escandinavia: {name:"Escandinavia", continent:"Europa", neighbors:["europa","asia"]},
  norteafrica: {name:"Norte da Africa", continent:"Africa", neighbors:["europa","africaocidental","africaoriental","sulafrica"]},
  africaocidental: {name:"Africa Ocidental", continent:"Africa", neighbors:["norteafrica","africaoriental","sulafrica"]},
  africaoriental: {name:"Africa Oriental", continent:"Africa", neighbors:["norteafrica","africaocidental","sulafrica","asiaocidental"]},
  sulafrica: {name:"Sul da Africa", continent:"Africa", neighbors:["norteafrica","africaocidental","africaoriental","oceania"]},
  asiaocidental: {name:"Asia Ocidental", continent:"Asia", neighbors:["europa","asia","africaoriental","india"]},
  asia: {name:"Asia", continent:"Asia", neighbors:["europa","escandinavia","asiaocidental","india","siberia"]},
  india: {name:"India", continent:"Asia", neighbors:["asiaocidental","asia","siberia","oceania"]},
  siberia: {name:"Siberia", continent:"Asia", neighbors:["escandinavia","asia","india","oceania"]},
  oceania: {name:"Oceania", continent:"Oceania", neighbors:["pacifico","antartico","sulafrica","india","siberia"]},
  ilha: {name:"Ilha", continent:"Oceania", neighbors:["oceania"]},
  cordilheira: {name:"Cordilheira", continent:"Atlantica", neighbors:["pacifico","sudoeste","norte"]},
  planicie: {name:"Planicie", continent:"Aurora", neighbors:["norte","centro","sul"]}
};

const CONTINENT_BONUS = {Aurora:4, Atlantica:4, Europa:5, Africa:3, Asia:6, Oceania:2};
const COLORS = ["#e63946","#3a86ff","#2a9d8f","#f4a261","#9b5de5","#ff006e","#06d6a0","#ffb703"];
const UNIT_TYPES = ["land","air","navy"];

function uid() { return crypto.randomBytes(4).toString("hex"); }
function roomCode() { return crypto.randomBytes(3).toString("hex").toUpperCase(); }
function shuffle(a) { return [...a].sort(() => Math.random() - 0.5); }
function clamp(n,a,b){return Math.max(a,Math.min(b,n));}

function missionPool(playerIds) {
  const missions = [];
  for (const p of playerIds) {
    const others = playerIds.filter(x=>x!==p);
    missions.push({type:"territories", amount: Math.min(9, 5 + playerIds.length), text:`Conquiste ${Math.min(9,5+playerIds.length)} territorios.`});
    missions.push({type:"continent", continent: shuffle(Object.keys(CONTINENT_BONUS))[0], text:"Controle completamente um continente."});
    if (others.length) {
      const target = others[Math.floor(Math.random()*others.length)];
      missions.push({type:"eliminate", target, text:"Elimine o exército de um jogador específico."});
    }
  }
  return shuffle(missions).slice(0, playerIds.length);
}

function newRoom(hostId, name) {
  const code = roomCode();
  const room = {
    code, hostId, phase:"lobby", turn:0, activePlayer:null, created:Date.now(),
    players:{}, territories:{}, territoryDeck:[], objectiveDeck:[],
    alliances:[], log:[]
  };
  room.players[hostId] = {
    id:hostId,name:name||"Jogador",color:COLORS[0],ready:false,
    territories:[],troops:0,deployLeft:0,hasConquered:false,
    cards:[],mission:null,units:{land:0,air:0,navy:0}
  };
  rooms.set(code,room);
  return room;
}

function addPlayer(room,id,name){
  if(Object.keys(room.players).length>=8) return false;
  const idx=Object.keys(room.players).length;
  room.players[id]={id,name:name||`Jogador ${idx+1}`,color:COLORS[idx],ready:false,
    territories:[],troops:0,deployLeft:0,hasConquered:false,cards:[],mission:null,
    units:{land:0,air:0,navy:0}};
  return true;
}

function distribute(room){
  const ids=Object.keys(room.players);
  const terrIds=shuffle(Object.keys(TERRITORIES));
  ids.forEach(id=>room.players[id].territories=[]);
  terrIds.forEach((t,i)=>{
    const pid=ids[i%ids.length];
    room.territories[t]={owner:pid,troops:1,units:{land:1,air:0,navy:0}};
    room.players[pid].territories.push(t);
  });
  room.territoryDeck=shuffle(terrIds);
  const missions=missionPool(ids);
  ids.forEach((id,i)=>{
    room.players[id].mission=missions[i];
    room.players[id].troops=0;
    room.players[id].deployLeft=0;
    room.players[id].cards=[];
    room.players[id].units={land:0,air:0,navy:0};
  });
  room.phase="deployment";
  room.turn=1;
  room.activePlayer=ids[0];
  room.log.push("Os territórios, cartas e missões foram distribuídos.");
  ids.forEach(id=>io.to(id).emit("privateMission",room.players[id].mission));
}

function reinforcement(room,p){
  const base=Math.max(3,Math.floor(p.territories.length/3));
  let bonus=0;
  for(const [c,b] of Object.entries(CONTINENT_BONUS)){
    const owned=p.territories.filter(t=>TERRITORIES[t].continent===c).length;
    const total=Object.values(TERRITORIES).filter(x=>x.continent===c).length;
    if(owned===total) bonus+=b;
  }
  return base+bonus;
}

function publicState(room,viewer){
  const players=Object.values(room.players).map(p=>({
    id:p.id,name:p.name,color:p.color,territories:p.territories.length,
    ready:p.ready,units:p.units,alive:p.territories.length>0
  }));
  const territories={};
  for(const [id,t] of Object.entries(room.territories)){
    territories[id]={owner:t.owner,troops:t.troops,units:t.units,name:TERRITORIES[id].name,continent:TERRITORIES[id].continent};
  }
  const me=room.players[viewer];
  return {
    code:room.code,phase:room.phase,turn:room.turn,activePlayer:room.activePlayer,
    players,territories,log:room.log.slice(-40),
    me:me?{id:me.id,name:me.name,color:me.color,territories:me.territories,
      troops:me.troops,deployLeft:me.deployLeft,cards:me.cards,hasConquered:me.hasConquered,
      units:me.units,mission:me.mission}:null,
    alliances:room.alliances
  };
}

function broadcast(room){
  for(const id of Object.keys(room.players)){
    io.to(id).emit("state",publicState(room,id));
  }
}

function sameAlliance(room,a,b){
  return room.alliances.some(x=>(x.a===a&&x.b===b)||(x.a===b&&x.b===a));
}

function rollDice(n){return Array.from({length:n},()=>1+Math.floor(Math.random()*6)).sort((a,b)=>b-a);}

function attack(room,playerId,from,to,dice){
  const p=room.players[playerId];
  const A=room.territories[from], D=room.territories[to];
  if(!A||!D || A.owner!==playerId || D.owner===playerId) return {error:"Território inválido."};
  if(!TERRITORIES[from].neighbors.includes(to)) return {error:"Os territórios não são vizinhos."};
  if(sameAlliance(room,playerId,D.owner)) return {error:"Você está aliado a esse jogador. Rompa a aliança para atacar."};
  if(A.troops<2) return {error:"Você precisa deixar pelo menos 1 tropa no território de origem."};
  const ad=clamp(Number(dice)||1,1,Math.min(3,A.troops-1));
  const dd=Math.min(3,D.troops);
  const ar=rollDice(ad), dr=rollDice(dd);
  let lossesA=0,lossesD=0;
  for(let i=0;i<Math.min(ar.length,dr.length);i++){
    if(ar[i]>dr[i]) lossesD++; else lossesA++;
  }
  A.troops-=lossesA; D.troops-=lossesD;
  room.log.push(`${p.name} atacou ${TERRITORIES[to].name}: ${ar.join(",")} x ${dr.join(",")} | perdas ${lossesA}/${lossesD}`);
  if(D.troops<=0){
    const old=D.owner;
    room.players[old].territories=room.players[old].territories.filter(x=>x!==to);
    D.owner=playerId;
    const move=Math.max(1,Math.min(A.troops-1,ad));
    A.troops-=move; D.troops=move;
    p.territories.push(to); p.hasConquered=true;
    p.cards.push(to);
    room.log.push(`${p.name} conquistou ${TERRITORIES[to].name}.`);
    if(room.players[old].territories.length===0){
      room.log.push(`${room.players[old].name} foi eliminado.`);
      room.alliances=room.alliances.filter(x=>x.a!==old&&x.b!==old);
    }
  }
  return {ok:true,ar,dr,lossesA,lossesD};
}

function checkWin(room,p){
  const m=p.mission;
  if(!m) return false;
  if(m.type==="territories") return p.territories.length>=m.amount;
  if(m.type==="eliminate") {
    const target=room.players[m.target];
    return !target || target.territories.length===0;
  }
  if(m.type==="continent"){
    const total=Object.values(TERRITORIES).filter(t=>t.continent===m.continent).length;
    return p.territories.filter(t=>TERRITORIES[t].continent===m.continent).length===total;
  }
  return false;
}

io.on("connection",socket=>{
  socket.on("createRoom",({name})=>{
    const room=newRoom(socket.id,name);
    socket.join(room.code);
    socket.emit("roomCreated",{code:room.code});
    broadcast(room);
  });

  socket.on("joinRoom",({code,name})=>{
    const room=rooms.get(String(code||"").toUpperCase());
    if(!room) return socket.emit("errorMsg","Sala não encontrada.");
    if(room.phase!=="lobby") return socket.emit("errorMsg","A partida já começou.");
    if(!addPlayer(room,socket.id,name)) return socket.emit("errorMsg","Sala cheia.");
    socket.join(room.code);
    room.log.push(`${name||"Jogador"} entrou na sala.`);
    broadcast(room);
  });

  socket.on("ready",()=>{
    const room=[...rooms.values()].find(r=>r.players[socket.id]);
    if(!room||room.phase!=="lobby")return;
    room.players[socket.id].ready=true;
    const ids=Object.keys(room.players);
    if(ids.length>=2 && ids.every(id=>room.players[id].ready)) distribute(room);
    broadcast(room);
  });

  socket.on("deploy",({territory,amount,type="land"})=>{
    const room=[...rooms.values()].find(r=>r.players[socket.id]);
    if(!room||room.phase!=="deployment")return;
    const p=room.players[socket.id], t=room.territories[territory];
    if(!t||t.owner!==socket.id||p.deployLeft<=0)return;
    const n=clamp(Number(amount)||1,1,p.deployLeft);
    if(!UNIT_TYPES.includes(type))return;
    t.troops+=n; t.units[type]+=n; p.deployLeft-=n;
    broadcast(room);
  });

  socket.on("startBattle",()=>{
    const room=[...rooms.values()].find(r=>r.players[socket.id]);
    if(!room||room.phase!=="deployment")return;
    const p=room.players[socket.id];
    if(Object.values(room.players).some(x=>x.deployLeft>0)) return socket.emit("errorMsg","Todos precisam terminar a distribuição.");
    room.phase="playing";
    room.turn=1; room.activePlayer=Object.keys(room.players).find(id=>room.players[id].territories.length>0);
    const active=room.players[room.activePlayer];
    active.troops=reinforcement(room,active); active.deployLeft=active.troops;
    room.log.push("A batalha começou.");
    broadcast(room);
  });

  socket.on("attack",({from,to,dice})=>{
    const room=[...rooms.values()].find(r=>r.players[socket.id]);
    if(!room||room.phase!=="playing"||room.activePlayer!==socket.id)return;
    const result=attack(room,socket.id,from,to,dice);
    if(result.error) return socket.emit("errorMsg",result.error);
    if(checkWin(room,room.players[socket.id])){
      room.phase="finished"; room.log.push(`${room.players[socket.id].name} cumpriu sua missão!`);
      io.to(room.code).emit("winner",room.players[socket.id].name);
    }
    broadcast(room);
  });

  socket.on("move",({from,to,amount,type="land"})=>{
    const room=[...rooms.values()].find(r=>r.players[socket.id]);
    if(!room||room.phase!=="playing"||room.activePlayer!==socket.id)return;
    const p=room.players[socket.id], A=room.territories[from],D=room.territories[to];
    if(!A||!D||A.owner!==socket.id||D.owner!==socket.id)return socket.emit("errorMsg","Movimento permitido apenas entre seus territórios.");
    if(!TERRITORIES[from].neighbors.includes(to))return socket.emit("errorMsg","Os territórios precisam ser vizinhos.");
    const n=clamp(Number(amount)||1,1,A.troops-1);
    if(!UNIT_TYPES.includes(type)||A.units[type]<n)return socket.emit("errorMsg","Unidades insuficientes.");
    A.troops-=n; D.troops+=n; A.units[type]-=n; D.units[type]+=n;
    room.log.push(`${p.name} moveu ${n} ${type} de ${TERRITORIES[from].name} para ${TERRITORIES[to].name}.`);
    broadcast(room);
  });

  socket.on("airStrike",({from,to})=>{
    const room=[...rooms.values()].find(r=>r.players[socket.id]);
    if(!room||room.phase!=="playing"||room.activePlayer!==socket.id)return;
    const A=room.territories[from],D=room.territories[to],p=room.players[socket.id];
    if(!A||!D||A.owner!==socket.id||D.owner===socket.id)return socket.emit("errorMsg","Alvo inválido.");
    if(A.units.air<1)return socket.emit("errorMsg","Você não possui avião neste território.");
    A.units.air--; D.troops=Math.max(0,D.troops-1);
    room.log.push(`${p.name} lançou um ataque aéreo contra ${TERRITORIES[to].name}.`);
    broadcast(room);
  });

  socket.on("navalSupport",({from,to})=>{
    const room=[...rooms.values()].find(r=>r.players[socket.id]);
    if(!room||room.phase!=="playing"||room.activePlayer!==socket.id)return;
    const A=room.territories[from],D=room.territories[to],p=room.players[socket.id];
    if(!A||!D||A.owner!==socket.id||D.owner!==socket.id)return socket.emit("errorMsg","Suporte naval só pode apoiar seu território.");
    if(A.units.navy<1)return socket.emit("errorMsg","Você não possui frota naval.");
    A.units.navy--; D.troops++; D.units.navy++;
    room.log.push(`${p.name} enviou apoio naval para ${TERRITORIES[to].name}.`);
    broadcast(room);
  });

  socket.on("inviteAlliance",({target})=>{
    const room=[...rooms.values()].find(r=>r.players[socket.id]);
    if(!room||socket.id===target)return;
    if(!room.players[target])return;
    io.to(target).emit("allianceInvite",{from:socket.id,name:room.players[socket.id].name});
  });

  socket.on("answerAlliance",({from,accept})=>{
    const room=[...rooms.values()].find(r=>r.players[socket.id]);
    if(!room||!room.players[from])return;
    if(accept && !sameAlliance(room,socket.id,from)){
      room.alliances.push({a:socket.id,b:from});
      room.log.push(`${room.players[socket.id].name} e ${room.players[from].name} formaram uma aliança.`);
    }
    broadcast(room);
  });

  socket.on("breakAlliance",({target})=>{
    const room=[...rooms.values()].find(r=>r.players[socket.id]);
    if(!room)return;
    room.alliances=room.alliances.filter(x=>!((x.a===socket.id&&x.b===target)||(x.a===target&&x.b===socket.id)));
    room.log.push(`${room.players[socket.id].name} rompeu uma aliança.`);
    broadcast(room);
  });

  socket.on("endTurn",()=>{
    const room=[...rooms.values()].find(r=>r.players[socket.id]);
    if(!room||room.phase!=="playing"||room.activePlayer!==socket.id)return;
    const p=room.players[socket.id];
    if(p.hasConquered && p.cards.length>0) {
      // A carta conquistada fica com o jogador; 3 cartas podem ser trocadas automaticamente.
      if(p.cards.length>=3){
        p.cards.splice(0,3);
        p.troops+=5;
        room.log.push(`${p.name} trocou 3 cartas por 5 tropas.`);
      }
    }
    const ids=Object.keys(room.players).filter(id=>room.players[id].territories.length>0);
    let idx=ids.indexOf(socket.id);
    let next=ids[(idx+1)%ids.length];
    room.turn++;
    room.activePlayer=next;
    const np=room.players[next];
    np.troops=reinforcement(room,np); np.deployLeft=np.troops; np.hasConquered=false;
    room.log.push(`Turno de ${np.name}. Reforços: ${np.troops}.`);
    broadcast(room);
  });

  socket.on("skipTurn",()=>socket.emit("info","Use 'Passar turno' para encerrar seu turno."));

  socket.on("disconnect",()=>{
    for(const room of rooms.values()){
      if(!room.players[socket.id])continue;
      const name=room.players[socket.id].name;
      delete room.players[socket.id];
      room.alliances=room.alliances.filter(x=>x.a!==socket.id&&x.b!==socket.id);
      room.log.push(`${name} saiu da sala.`);
      if(room.hostId===socket.id){
        const next=Object.keys(room.players)[0];
        if(next) room.hostId=next;
      }
      if(Object.keys(room.players).length===0) rooms.delete(room.code);
      else broadcast(room);
    }
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`WAR: Fronteiras online na porta ${PORT}`);
});