const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const COLORS=["#25d9ff","#ff5d73","#ffd34d","#6ee7a3","#b98cff","#ff9c4b"];
const territories=[
["Alasca","na",8,18,["Noroeste Canadá","Kamchatka"]],["Noroeste Canadá","na",15,22,["Alasca","Groenlândia","Ontário","Alberta"]],["Groenlândia","na",27,12,["Noroeste Canadá","Quebec","Islândia"]],["Alberta","na",17,31,["Noroeste Canadá","Ontário"]],["Ontário","na",23,32,["Alberta","Noroeste Canadá","Quebec","Estados Unidos"]],["Quebec","na",30,31,["Ontário","Groenlândia","Estados Unidos"]],["Estados Unidos","na",23,43,["Ontário","Quebec","América Central"]],["América Central","na",25,55,["Estados Unidos","Venezuela"]],["Venezuela","sa",28,65,["América Central","Brasil","Peru"]],["Brasil","sa",35,72,["Venezuela","Peru","Argentina","Norte da África"]],["Peru","sa",28,77,["Venezuela","Brasil","Argentina"]],["Argentina","sa",31,88,["Peru","Brasil","Chile"]],["Chile","sa",26,88,["Argentina"]],

["Islândia","eu",43,22,["Groenlândia","Grã-Bretanha"]],["Grã-Bretanha","eu",44,32,["Islândia","Escandinávia","Europa Ocidental"]],["Escandinávia","eu",50,26,["Grã-Bretanha","Europa Ocidental","Europa Oriental","Rússia"]],["Europa Ocidental","eu",47,39,["Grã-Bretanha","Escandinávia","Europa Oriental","Norte da África"]],["Europa Oriental","eu",57,39,["Escandinávia","Europa Ocidental","Rússia","Oriente Médio"]],["Rússia","eu",64,27,["Escandinávia","Europa Oriental","Afeganistão","Urais"]],["Urais","as",72,30,["Rússia","Sibéria","Afeganistão","China"]],["Sibéria","as",78,25,["Urais","Yakutsk","Irkutsk","Mongólia"]],["Yakutsk","as",86,22,["Sibéria","Kamchatka","Irkutsk"]],["Kamchatka","as",92,18,["Yakutsk","Irkutsk","Japão","Alasca"]],["Irkutsk","as",85,32,["Sibéria","Yakutsk","Kamchatka","Mongólia"]],["Mongólia","as",82,43,["Sibéria","Irkutsk","China","Japão"]],["Japão","as",91,47,["Kamchatka","Mongólia"]],["China","as",77,51,["Urais","Mongólia","Sibéria","Índia","Sudeste Asiático"]],["Afeganistão","as",69,48,["Rússia","Urais","Oriente Médio","Índia"]],["Oriente Médio","as",62,57,["Europa Oriental","Afeganistão","Índia","Egito"]],["Índia","as",70,64,["Afeganistão","Oriente Médio","China","Sudeste Asiático"]],["Sudeste Asiático","as",79,70,["China","Índia","Indonésia"]],["Indonésia","oc",84,82,["Sudeste Asiático","Austrália"]],["Austrália","oc",88,91,["Indonésia"]],

["Norte da África","af",49,55,["Brasil","Europa Ocidental","Egito","África Central"]],["Egito","af",57,61,["Norte da África","Oriente Médio","África Central","África Oriental"]],["África Central","af",51,71,["Norte da África","Egito","África Oriental","África do Sul"]],["África Oriental","af",59,77,["Egito","África Central","África do Sul"]],["África do Sul","af",53,88,["África Central","África Oriental"]],

["Europa Ocidental","eu",47,39,["Grã-Bretanha","Escandinávia","Europa Oriental","Norte da África"]]
];
// remove duplicate name safely
const unique=[]; const seen=new Set(); for(const t of territories){if(!seen.has(t[0])){seen.add(t[0]);unique.push(t)}}; territories.length=0; territories.push(...unique);

const state={name:"",room:"",peer:null,isHost:false,conns:new Map(),players:[],selfId:"",game:null,selected:null,target:null,unit:"soldier",chatMode:"public",privateTarget:null,localStream:null,calls:new Map()};
const unitPower={soldier:0,tank:2,plane:2,ship:2};

function show(id){$$(".screen").forEach(x=>x.classList.remove("active"));$("#"+id).classList.add("active")}
function toast(s){const e=$("#toast");e.textContent=s;e.style.display="block";setTimeout(()=>e.style.display="none",2200)}
function randCode(){return Math.random().toString(36).slice(2,8).toUpperCase()}
function sendAll(msg){state.conns.forEach(c=>{try{c.send(msg)}catch{}})}
function broadcast(){if(state.isHost){sendAll({type:"state",game:state.game,players:state.players})}}

$("#createBtn").onclick=()=>{state.name=($("#nameInput").value||"Jogador").trim();state.room=randCode();startPeer(true)}
$("#joinBtn").onclick=()=>$("#joinBox").classList.toggle("hidden");
$("#joinConfirm").onclick=()=>{state.name=($("#nameInput").value||"Jogador").trim();state.room=($("#roomInput").value||"").trim().toUpperCase();if(state.room.length<4)return toast("Digite o código da sala.");startPeer(false)}
$("#copyRoom").onclick=()=>navigator.clipboard?.writeText(state.room).then(()=>toast("Código copiado!"));
$("#leaveBtn").onclick=()=>location.reload();

function startPeer(host){
 state.isHost=host; state.selfId=host?`war-${state.room}`:`war-${state.room}-${Math.random().toString(36).slice(2,7)}`;
 state.peer=new Peer(state.selfId);
 state.peer.on("open",()=>{state.peerId=state.peer.id; if(host){state.players=[{id:state.peerId,name:state.name,host:true,color:0}];renderLobby();}else{const c=state.peer.connect(`war-${state.room}`,{reliable:true});bindConn(c);}});
 state.peer.on("connection",c=>{bindConn(c)});
 state.peer.on("call",call=>{if(state.localStream)call.answer(state.localStream);else call.answer();call.on("stream",s=>addAudio(call.peer,s))});
 state.peer.on("error",e=>{$("#networkStatus").textContent="Erro de conexão: "+e.type;toast("Não foi possível conectar à sala.")});
 show("lobby");$("#roomCodeLabel").textContent=state.room;
}
function bindConn(c){
 c.on("open",()=>{state.conns.set(c.peer,c);c.send({type:"hello",name:state.name,id:state.peerId,host:state.isHost});$("#networkStatus").textContent="Conectado. Aguardando jogadores.";});
 c.on("data",msg=>handleNet(msg,c));
 c.on("close",()=>{state.conns.delete(c.peer);if(state.isHost){state.players=state.players.filter(p=>p.id!==c.peer);renderLobby();broadcast()}});
}
function handleNet(m,c){
 if(m.type==="hello"&&state.isHost){if(!state.players.some(p=>p.id===m.id)){state.players.push({id:m.id,name:m.name,host:false,color:state.players.length%COLORS.length});renderLobby();c.send({type:"lobby",players:state.players,game:state.game});}}
 if(m.type==="lobby"){state.players=m.players;renderLobby();if(m.game){state.game=m.game;show("game");renderGame()}}
 if(m.type==="start"&&!state.isHost){state.players=m.players;state.game=m.game;show("game");renderGame()}
 if(m.type==="state"&&!state.isHost){state.players=m.players;state.game=m.game;renderGame()}
 if(m.type==="chat"){addMessage(m.from,m.text,m.private?true:false)}
 if(m.type==="private"){if(m.to===state.peerId)addMessage(m.from,m.text,true)}
 if(m.type==="alliance"&&m.to===state.peerId)showAlliance(m)}
function renderLobby(){
 $("#roomCodeLabel").textContent=state.room;
 $("#playerList").innerHTML=state.players.map(p=>`<div class="player-item"><span><i class="dot" style="background:${COLORS[p.color%COLORS.length]}"></i> ${esc(p.name)}</span><small>${p.host?"HOST":"PRONTO"}</small></div>`).join("");
 $("#startBtn").style.display=state.isHost?"block":"none";
}
function esc(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}

function initGame(){
 const count=state.players.length;
 const names=state.players.map(p=>p.name);
 const owners={}; const army={}; const unit={};
 const shuffled=[...territories].sort(()=>Math.random()-.5);
 shuffled.forEach((t,i)=>{owners[t[0]]=i%count;army[t[0]]=3;unit[t[0]]={soldier:3,tank:0,plane:0,ship:0}});
 state.game={turn:0,phase:"reinforce",reinforcements:5,owners,army,unit,objectives:makeObjectives(names),logs:[],alliances:[],cards:{},started:true};
}
function makeObjectives(names){
 return state.players.map((p,i)=>({player:p.id,text:["Conquiste 18 territórios.","Conquiste pelo menos 2 continentes.","Elimine o exército de um jogador específico.","Conquiste territórios em 3 continentes."][i%4],target:i}));
}
$("#startBtn").onclick=()=>{if(state.players.length<2)return toast("Entre com pelo menos 2 jogadores.");initGame();show("game");renderGame();sendAll({type:"start",players:state.players,game:state.game})};

function myPlayer(){return state.players.find(p=>p.id===state.peerId)||state.players.find(p=>p.name===state.name)}
function renderGame(){
 if(!state.game)return;
 $("#turnText").textContent=`Turno de ${state.players[state.game.turn]?.name||"?"}`;
 $("#phaseText").textContent=state.game.phase==="reinforce"?"REFORÇOS":state.game.phase==="attack"?"ATAQUE":"REMANEJO";
 const me=myPlayer(), mi=me?state.players.findIndex(p=>p.id===me.id):0;
 const myTs=territories.filter(t=>state.game.owners[t[0]]===mi);
 $("#myTerritories").textContent=myTs.length;
 $("#myArmies").textContent=myTs.reduce((a,t)=>a+state.game.army[t[0]],0);
 $("#myReinforcements").textContent=state.game.reinforcements;
 $("#playersGame").innerHTML=state.players.map((p,i)=>`<div class="player-game"><i class="dot" style="background:${COLORS[i%COLORS.length]}"></i><span>${esc(p.name)}${p.id===state.peerId?" ★":""}</span><small>${territories.filter(t=>state.game.owners[t[0]]===i).length}</small></div>`).join("");
 renderMap();renderLogs();
}
function renderMap(){
 const map=$("#map");map.querySelectorAll(".territory,.continent").forEach(x=>x.remove());
 const conts=[["AMÉRICA",20,40],["EUROPA",48,25],["ÁSIA",75,38],["ÁFRICA",52,72],["OCEANIA",87,86]];
 conts.forEach(c=>{const e=document.createElement("div");e.className="continent";e.textContent=c[0];e.style.left=c[1]+"%";e.style.top=c[2]+"%";map.appendChild(e)});
 territories.forEach(t=>{
   const [name,cont,x,y]=t,p=document.createElement("div");p.className="territory";
   const owner=state.game.owners[name], me=myPlayer(), mi=state.players.findIndex(q=>q.id===me?.id);
   if(owner===mi)p.style.borderColor=COLORS[mi%COLORS.length];
   if(state.selected===name)p.classList.add("selected"); if(state.target===name)p.classList.add("target");
   if(state.game.alliances.some(a=>(a.a===mi&&a.b===owner)||(a.b===mi&&a.a===owner)))p.classList.add("ally");
   p.style.left=x+"%";p.style.top=y+"%";p.dataset.name=name;
   const u=state.game.unit[name];
   p.innerHTML=`<div class="territory-name">${esc(name)}</div><div class="troops">${state.game.army[name]}</div><div class="unit-icons">${u.tank?"▰"+u.tank+" ":""}${u.plane?"✦"+u.plane+" ":""}${u.ship?"◆"+u.ship:""}</div>`;
   p.addEventListener("click",()=>selectTerritory(name));
   p.addEventListener("pointerdown",e=>dragStart(e,name));
   map.appendChild(p);
 })
}
let dragInfo=null;
function dragStart(e,name){const owner=state.game.owners[name],me=state.players.findIndex(p=>p.id===state.peerId);if(owner!==me)return;dragInfo={name,x:e.clientX,y:e.clientY};}
document.addEventListener("pointerup",e=>{if(!dragInfo)return;const a=dragInfo.name;const el=document.elementFromPoint(e.clientX,e.clientY)?.closest(".territory");dragInfo=null;if(el&&el.dataset.name&&el.dataset.name!==a){const b=el.dataset.name;const dx=e.clientX-el.getBoundingClientRect().left,dy=e.clientY-el.getBoundingClientRect().top;selectTerritory(a);toast("Território selecionado: "+a);selectTerritory(b,true)}});

function neighbors(name){return territories.find(t=>t[0]===name)?.[4]||[]}
function selectTerritory(name,target=false){
 const me=state.players.findIndex(p=>p.id===state.peerId);
 if(state.game.owners[name]===me&&!target){state.selected=name;state.target=null;$("#selectionHint").textContent=name+" selecionado — escolha uma ação.";renderMap();return}
 if(target&&state.selected){state.target=name;renderMap();$("#selectionHint").textContent=`${state.selected} → ${name}`;return}
 if(state.selected&&state.game.owners[name]!==me&&neighbors(state.selected).includes(name)){state.target=name;renderMap();$("#selectionHint").textContent=`${state.selected} → ${name}`;return}
}

$$(".unit").forEach(b=>b.onclick=()=>{$$(".unit").forEach(x=>x.classList.remove("active"));b.classList.add("active");state.unit=b.dataset.unit;toast("Unidade: "+b.querySelector("span").textContent)});
$("#reinforceBtn").onclick=()=>reinforce();
$("#attackBtn").onclick=()=>attack();
$("#moveBtn").onclick=()=>moveTroops();
$("#endPhaseBtn").onclick=()=>endPhase();

function myTurn(){return state.players[state.game.turn]?.id===state.peerId}
function reinforce(){
 if(!myTurn())return toast("Não é seu turno."); if(state.game.phase!=="reinforce")return toast("A fase de reforços já terminou.");
 if(!state.selected)return toast("Selecione seu território.");
 if(state.game.owners[state.selected]!==state.players.findIndex(p=>p.id===state.peerId))return;
 if(state.game.reinforcements<=0)return toast("Sem reforços.");
 state.game.army[state.selected]++;state.game.unit[state.selected][state.unit]++;state.game.reinforcements--;log(`${state.name} reforçou ${state.selected}.`);sync();
 if(state.game.reinforcements===0){state.game.phase="attack";sync()}
}
function attack(){
 if(!myTurn()||state.game.phase!=="attack")return toast("Você só pode atacar na fase de ataque.");
 const a=state.selected,b=state.target;if(!a||!b)return toast("Selecione atacante e defensor.");
 const me=state.players.findIndex(p=>p.id===state.peerId),def=state.game.owners[b];
 if(state.game.owners[a]!==me||def===me)return toast("Territórios inválidos.");
 if(!neighbors(a).includes(b))return toast("Esses territórios não têm conexão.");
 if(state.game.army[a]<2)return toast("Você precisa deixar pelo menos 1 exército.");
 const n=Math.min(3,state.game.army[a]-1), d=Math.min(3,state.game.army[b]);
 const atk=Array.from({length:n},()=>1+Math.floor(Math.random()*6)).sort((x,y)=>y-x);
 const de=Array.from({length:d},()=>1+Math.floor(Math.random()*6)).sort((x,y)=>y-x);
 let lossesA=0,lossesD=0;for(let i=0;i<Math.min(atk.length,de.length);i++){if(atk[i]>de[i])lossesD++;else lossesA++}
 state.game.army[a]-=lossesA;state.game.army[b]-=lossesD;
 if(state.game.army[b]<=0){
   state.game.owners[b]=me;state.game.army[b]=Math.max(1,Math.min(n,state.game.army[a]-1));state.game.army[a]-=state.game.army[b];
   log(`${state.name} conquistou ${b}! 🎯`);
 }else log(`${a} → ${b} | Ataque ${atk.join(",")} x Defesa ${de.join(",")} | -${lossesA}/-${lossesD}`);
 animateDice(atk,de);checkWin();sync();
}
function moveTroops(){
 if(!myTurn()||state.game.phase!=="move")return toast("O remanejo acontece após os ataques.");
 const a=state.selected,b=state.target;if(!a||!b)return toast("Selecione origem e destino.");
 const me=state.players.findIndex(p=>p.id===state.peerId);
 if(state.game.owners[a]!==me||state.game.owners[b]!==me||!neighbors(a).includes(b))return toast("O remanejo precisa ligar territórios seus.");
 if(state.game.army[a]<2)return toast("Deixe pelo menos 1 exército.");
 state.game.army[a]--;state.game.army[b]++;log(`${state.name} remanejou tropas.`);sync();
}
function endPhase(){
 if(!myTurn())return toast("Aguarde seu turno.");
 if(state.game.phase==="reinforce"){state.game.phase="attack";state.game.reinforcements=0}
 else if(state.game.phase==="attack"){state.game.phase="move"}
 else {nextTurn()}
 sync();
}
function nextTurn(){
 state.game.turn=(state.game.turn+1)%state.players.length;state.game.phase="reinforce";
 const me=state.players[state.game.turn],idx=state.game.turn;
 const count=territories.filter(t=>state.game.owners[t[0]]===idx).length;
 state.game.reinforcements=Math.max(3,Math.floor(count/2));
 log(`Turno de ${me.name}. Reforços: ${state.game.reinforcements}.`);
}
function checkWin(){
 const mi=state.game.turn;
 const obj=state.game.objectives[mi]; const owned=territories.filter(t=>state.game.owners[t[0]]===mi).length;
 if(obj?.text.startsWith("Conquiste 18")&&owned>=18)showWin(state.players[mi].name);
}
function showWin(n){modal(`<h2>🏆 Vitória</h2><p>${esc(n)} completou uma condição de vitória!</p><button class="primary wide" onclick="location.reload()">NOVA PARTIDA</button>`)}
function animateDice(a,d){toast(`🎲 ${a.join(" • ")}  VS  ${d.join(" • ")}`)}
function log(s){state.game.logs.unshift(s);state.game.logs=state.game.logs.slice(0,8);renderLogs()}
function renderLogs(){$("#battleLog").innerHTML=(state.game.logs||[]).map(x=>`<div class="log-line">${esc(x)}</div>`).join("")}
function sync(){renderGame();if(state.isHost)broadcast();else{const host=[...state.conns.values()][0];host?.send({type:"requestState",game:state.game})}}

$("#objectiveBtn").onclick=()=>{const me=myPlayer(),i=state.players.findIndex(p=>p.id===me?.id),o=state.game.objectives[i];modal(`<h2>🎯 Objetivo secreto</h2><div class="objective"><strong>NÃO MOSTRE AOS OUTROS.</strong><p>${esc(o?.text||"Objetivo indisponível.")}</p></div>`)};
$("#rulesBtn").onclick=()=>modal(`<h2>Regras rápidas</h2><ul><li>Em cada turno: reforçar → atacar → remanejar.</li><li>O ataque usa até 3 dados de cada lado, respeitando o número de tropas disponível.</li><li>Você só ataca territórios conectados.</li><li>Você deve manter pelo menos 1 exército no território de origem.</li><li>Tanque, avião e barco dão +2 de força na implementação especial deste projeto.</li><li>Alianças são privadas e não aparecem no mapa para os demais.</li><li>O objetivo secreto decide a vitória quando cumprido.</li></ul>`);
$("#modalClose").onclick=()=>$("#modal").classList.add("hidden");
function modal(content){$("#modalContent").innerHTML=content;$("#modal").classList.remove("hidden")}

function addMessage(from,text,privateMsg=false){const d=document.createElement("div");d.className="msg"+(privateMsg?" private":"");d.innerHTML=`<b>${esc(from)}:</b> ${esc(text)}`;$("#chatMessages").appendChild(d);$("#chatMessages").scrollTop=99999}
function sendChat(){
 const text=$("#chatInput").value.trim();if(!text)return;$("#chatInput").value="";
 if(state.chatMode==="private"&&state.privateTarget){const p=state.players.find(x=>x.id===state.privateTarget);if(!p)return;addMessage("Você",text,true);state.conns.get(p.id)?.send({type:"private",from:state.name,text,to:p.id})}
 else{addMessage("Você",text);sendAll({type:"chat",from:state.name,text})}
}
$("#sendChat").onclick=sendChat;$("#chatInput").onkeydown=e=>{if(e.key==="Enter")sendChat()};
$$(".tab").forEach(t=>t.onclick=()=>{$$(".tab").forEach(x=>x.classList.remove("active"));t.classList.add("active");state.chatMode=t.dataset.chat});

$("#allianceBtn").onclick=()=>{
 const choices=state.players.filter(p=>p.id!==state.peerId).map(p=>`<button class="wide" onclick="propose('${p.id}')">🤝 ${esc(p.name)}</button>`).join("");
 modal(`<h2>Aliança secreta</h2><p>Escolha um jogador. A proposta será enviada somente para ele.</p>${choices}`)
};
window.propose=id=>{state.conns.get(id)?.send({type:"alliance",from:state.name,to:id});modal(`<h2>Proposta enviada</h2><p>Aguarde a resposta.</p>`)};
function showAlliance(m){modal(`<h2>🤝 Proposta secreta</h2><p>${esc(m.from)} quer formar uma aliança com você.</p><div class="row"><button class="primary" onclick="acceptAlliance('${m.from}')">ACEITAR</button><button onclick="$('#modal').classList.add('hidden')">RECUSAR</button></div>`)};
window.acceptAlliance=from=>{const p=state.players.find(x=>x.name===from),me=state.players.findIndex(x=>x.id===state.peerId),oi=state.players.findIndex(x=>x.id===p?.id);if(p){state.game.alliances.push({a:me,b:oi});log("Uma aliança secreta foi formada.");sync()}$("#modal").classList.add("hidden")};

$("#micBtn").onclick=async()=>{
 if(state.localStream){state.localStream.getTracks().forEach(t=>t.stop());state.localStream=null;$("#micBtn").textContent="MIC OFF";return}
 try{state.localStream=await navigator.mediaDevices.getUserMedia({audio:true});$("#micBtn").textContent="MIC ON";state.conns.forEach(c=>{const call=state.peer.call(c.peer,state.localStream);call.on("stream",s=>addAudio(c.peer,s));state.calls.set(c.peer,call)});toast("Microfone ligado.")}catch(e){toast("Permissão de microfone recusada.")}};
function addAudio(id,stream){let a=document.getElementById("audio-"+id);if(!a){a=document.createElement("audio");a.id="audio-"+id;a.autoplay=true;a.controls=false;document.body.appendChild(a)}a.srcObject=stream}

setInterval(()=>{if(state.isHost&&state.game)broadcast()},1200);
