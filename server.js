import { WebSocketServer } from "ws";
import crypto from "node:crypto";

const PORT = process.env.PORT || 8080;
const rooms = new Map();

function code(){ return crypto.randomBytes(3).toString("hex").toUpperCase(); }

const wss = new WebSocketServer({port: PORT});
console.log(`WAR Command server listening on ${PORT}`);

wss.on("connection", ws => {
  ws.on("message", raw => {
    let msg;
    try { msg = JSON.parse(raw); } catch { return; }

    if(msg.type === "create"){
      let room = code();
      while(rooms.has(room)) room = code();
      rooms.set(room,{players:new Map(),state:{status:"lobby"}});
      ws.room=room; ws.playerId=msg.playerId;
      rooms.get(room).players.set(msg.playerId,ws);
      ws.send(JSON.stringify({type:"room-created",room}));
      return;
    }

    if(msg.type === "join"){
      const r=rooms.get(String(msg.room||"").toUpperCase());
      if(!r || r.players.size>=6){
        ws.send(JSON.stringify({type:"error",message:"Sala inválida ou cheia."})); return;
      }
      ws.room=String(msg.room).toUpperCase(); ws.playerId=msg.playerId;
      r.players.set(msg.playerId,ws);
      broadcast(ws.room,{type:"player-joined",playerId:msg.playerId});
      return;
    }

    if(!ws.room)return;
    broadcast(ws.room,{...msg,from:ws.playerId},ws);
  });

  ws.on("close",()=>{
    const r=rooms.get(ws.room);
    if(!r)return;
    r.players.delete(ws.playerId);
    broadcast(ws.room,{type:"player-left",playerId:ws.playerId});
    if(r.players.size===0)rooms.delete(ws.room);
  });
});

function broadcast(room,msg,except){
  const r=rooms.get(room); if(!r)return;
  const data=JSON.stringify(msg);
  for(const [id,socket] of r.players){
    if(socket!==except && socket.readyState===1)socket.send(data);
  }
}
