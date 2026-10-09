/* =====================================================================
   REDE (PeerJS / WebRTC), SALAS, VOZ, CHAT E ALIANÇAS
   - O CÓDIGO DA SALA é o ID do anfitrião no PeerJS (prefixo "warcmd-").
   - Quem entra pelo código abre uma conexão direta com o anfitrião, que comanda a partida.
   - A voz é WebRTC direto entre os navegadores (cada um liga para quem está ouvindo).
   ===================================================================== */
const PEER_PREFIX="warcmd-";
const PEER_LIBS=["https://cdn.jsdelivr.net/npm/peerjs@1.5.4/dist/peerjs.min.js","https://unpkg.com/peerjs@1.5.4/dist/peerjs.min.js"];
const NET={mode:"solo",peer:null,conns:{},hostConn:null,code:null,members:[],started:false,cfg:null};
const VOICE={stream:null,muted:false,deaf:false,calls:{},audios:{},levels:{},analysers:{},ctx:null,timer:null};

function loadPeerLib(){
 return new Promise((res,rej)=>{
  if(typeof Peer!=="undefined")return res();
  let i=0;
  const next=()=>{
   if(i>=PEER_LIBS.length)return rej(new Error("peerjs"));
   const s=document.createElement("script");s.src=PEER_LIBS[i++];
   s.onload=()=>typeof Peer!=="undefined"?res():next();
   s.onerror=next;document.head.appendChild(s);
  };
  next();
 });
}
// Servidor de sinalização: por padrão o público do PeerJS. Para usar o seu: ?peerhost=meu.servidor&peerport=443&peersecure=1
function peerOptions(){
 const q=new URLSearchParams(location.search);
 const o={debug:0,config:{iceServers:[{urls:"stun:stun.l.google.com:19302"},{urls:"stun:global.stun.twilio.com:3478"}]}};
 if(q.get("peerhost")){o.host=q.get("peerhost");o.port=Number(q.get("peerport")||443);o.path=q.get("peerpath")||"/";o.secure=q.get("peersecure")!=="0"&&location.protocol==="https:"||q.get("peersecure")==="1"}
 if(window.WAR_PEER_OPTIONS)Object.assign(o,window.WAR_PEER_OPTIONS);
 return o;
}

// ---------- envio (usado pelo motor do anfitrião) ----------
function send(seat,msg){
 if(seat===U.me&&NET.mode!=="client"){queueMicrotask(()=>onMsg(JSON.parse(JSON.stringify(msg))));return}
 const c=NET.conns[seat];
 if(c&&c.open)c.send(msg);
}

// ---------- menu ----------
function readMenu(){
 return {
  name:($("name").value.trim()||"COMMANDER").slice(0,18),
  players:Number($("v4Players").value),color:Number($("v4Color").value),time:$("v4Time").value,
  ai:$("v4AI").checked,alliance:$("v4Alliance").checked,mission:$("v4Mission").checked,voice:$("v4Voice").checked
 };
}
function roomCode(){
 const A="ABCDEFGHJKLMNPQRSTUVWXYZ23456789";let s="";
 for(let i=0;i<6;i++)s+=A[Math.floor(Math.random()*A.length)];
 return s;
}
function roomInfo(t){$("v4RoomInfo").textContent=t}
function showGameUI(){
 $("menu").classList.add("hidden");$("game").classList.remove("hidden");
 U.attack=false;U.source=null;U.busy=false;U.pending=null;U.sel=[];U.showObj=false;U.endShown=false;U.elimShown=false;U.chat=[];U.unread=0;
 $("log").innerHTML="";$("chatList").innerHTML="";
 $("roomTag").textContent=NET.mode==="solo"?"Solo":"Sala "+NET.code;
 $("roomTag").dataset.code=NET.code||"";
 $("selection").innerHTML="Arraste as peças da caixa para os seus territórios.<br><br>Depois use <b>ATACAR</b>, <b>REMANEJAR</b> e <b>ENCERRAR TURNO</b>.";
 setTab("game");
}

// solo: você contra CPUs, sem rede
function v4StartSolo(){startSolo(false)}
function startSolo(again){
 const c=again&&NET.cfg?NET.cfg:readMenu();NET.cfg=c;
 NET.mode="solo";NET.code=null;NET.conns={};NET.started=true;
 const n=Math.min(6,Math.max(2,c.players));
 const rest=[0,1,2,3,4,5].filter(i=>i!==c.color);
 U.me=0;showGameUI();
 initGame({names:[c.name,...Array.from({length:n-1},(_,i)=>"CPU "+(i+1))],pc:[c.color,...rest.slice(0,n-1)],
  human:Array.from({length:n},(_,i)=>i===0),cfg:{alliance:c.alliance,mission:c.mission,voice:false},peers:[]});
}

// ---------- criar sala (anfitrião) ----------
async function v4CreateRoom(){
 NET.cfg=readMenu();
 roomInfo("Conectando ao servidor de salas…");
 try{await loadPeerLib()}catch(e){roomInfo("Não consegui carregar a biblioteca de rede (PeerJS). Verifique a internet ou use INICIAR OPERAÇÃO (solo).");return}
 openRoom(0);
}
function openRoom(attempt){
 const code=roomCode();
 const peer=new Peer(PEER_PREFIX+code,peerOptions());
 let opened=false;
 peer.on("open",id=>{
  opened=true;NET.peer=peer;NET.code=code;NET.mode="host";NET.started=false;
  NET.members=[{name:NET.cfg.name,color:NET.cfg.color,id,conn:null,host:true}];
  $("v4Code").textContent=code;
  $("v4Create").style.display="none";
  renderLobby();broadcastLobby();
 });
 peer.on("connection",conn=>{
  conn.on("data",m=>onHostData(conn,m));
  conn.on("close",()=>onHostClose(conn));
  conn.on("error",()=>onHostClose(conn));
 });
 peer.on("call",onIncomingCall);
 peer.on("disconnected",()=>{try{peer.reconnect()}catch(e){}});
 peer.on("error",e=>{
  if(e.type==="unavailable-id"&&attempt<5&&!opened){try{peer.destroy()}catch(_){}return openRoom(attempt+1)}
  if(!opened)roomInfo("Erro ao criar a sala ("+e.type+"). Tente de novo ou jogue solo.");
 });
}
function lobbyMembers(){return NET.members.map(m=>({name:m.name,color:m.color,host:!!m.host}))}
function broadcastLobby(){
 const msg={k:"lobby",code:NET.code,members:lobbyMembers()};
 NET.members.forEach(m=>{if(m.conn&&m.conn.open)m.conn.send(msg)});
 renderLobby();
}
function renderLobby(msg){
 const members=msg?msg.members:lobbyMembers();
 const box=$("v4Lobby");
 box.innerHTML=members.map(m=>`<div class="lobby-row"><i class="dot" style="background:${PCOLORS[m.color]?.hex||"#888"}"></i>${esc(m.name)}${m.host?" <small>anfitrião</small>":""}</div>`).join("");
 if(NET.mode==="host"){
  const cpu=NET.cfg.ai?Math.max(0,NET.cfg.players-members.length):0;
  roomInfo(`Sala aberta. Passe o código para seus amigos. ${members.length} jogador(es) humano(s)${cpu?` + ${cpu} CPU`:""}.`);
  $("v4Start").style.display="";
 }else if(NET.mode==="client")roomInfo("Você entrou na sala! Aguardando o anfitrião começar a partida…");
}
function onHostData(conn,m){
 if(!m||typeof m!=="object")return;
 if(m.k==="join"){
  if(NET.started){conn.send({k:"reject",why:"A partida já começou."});setTimeout(()=>conn.close(),300);return}
  if(NET.members.length>=6){conn.send({k:"reject",why:"A sala está cheia (máx. 6)."});setTimeout(()=>conn.close(),300);return}
  if(NET.members.some(x=>x.conn===conn))return;
  NET.members.push({name:String(m.name||"Jogador").slice(0,18),color:Number(m.color)||0,id:conn.peer,conn});
  broadcastLobby();return;
 }
 const seat=Object.keys(NET.conns).find(s=>NET.conns[s]===conn);
 if(seat===undefined||!S)return;
 if(m.k==="cmd")execCmd(Number(seat),m.cmd||{});
 else if(m.k==="chat")handleChat(Number(seat),m);
}
function onHostClose(conn){
 if(!NET.started){
  const i=NET.members.findIndex(x=>x.conn===conn);
  if(i>0){NET.members.splice(i,1);broadcastLobby()}
  return;
 }
 const seat=Object.keys(NET.conns).find(s=>NET.conns[s]===conn);
 if(seat!==undefined){delete NET.conns[seat];dropSeat(Number(seat))}
}
function hostStart(){
 const c=NET.cfg,hs=NET.members;
 const n=Math.min(6,c.ai?Math.max(c.players,hs.length):hs.length);
 if(n<2){roomInfo("Com “IA para preencher vagas” desligada, são necessários 2 ou mais jogadores humanos na sala.");return}
 const all=[0,1,2,3,4,5],used=new Set(),pc=[];
 hs.forEach(m=>{let x=m.color;if(used.has(x)||!all.includes(x))x=all.find(y=>!used.has(y));used.add(x);pc.push(x)});
 while(pc.length<n){const x=all.find(y=>!used.has(y));used.add(x);pc.push(x)}
 const names=[];
 hs.forEach(m=>{let nm=m.name,k=2;while(names.includes(nm))nm=m.name+" "+k++;names.push(nm)});
 for(let i=hs.length;i<n;i++)names.push("CPU "+(i-hs.length+1));
 NET.started=true;NET.conns={};
 hs.forEach((m,i)=>{if(i>0)NET.conns[i]=m.conn});
 U.me=0;showGameUI();
 hs.forEach((m,i)=>{if(i>0)m.conn.send({k:"start",me:i})});
 initGame({names,pc,human:Array.from({length:n},(_,i)=>i<hs.length),peers:hs.map(m=>m.id),
  cfg:{alliance:c.alliance,mission:c.mission,voice:c.voice}});
}

// ---------- entrar por código (convidado) ----------
function v4ShowJoin(){$("v4Join").style.display="block"}
async function v4JoinRoom(){
 const code=$("v4JoinCode").value.trim().toUpperCase().replace(/[^A-Z0-9]/g,"");
 if(code.length<4){alert("Digite o código da sala.");return}
 NET.cfg=readMenu();
 roomInfo("Procurando a sala "+code+"…");
 try{await loadPeerLib()}catch(e){roomInfo("Não consegui carregar a biblioteca de rede (PeerJS). Verifique a internet.");return}
 const peer=new Peer(peerOptions());
 let joined=false;
 peer.on("open",()=>{
  const conn=peer.connect(PEER_PREFIX+code,{reliable:true});
  NET.hostConn=conn;
  const timeout=setTimeout(()=>{if(!joined){roomInfo("Sala não encontrada ou sem resposta. Confira o código.");try{peer.destroy()}catch(e){}}},12000);
  conn.on("open",()=>{joined=true;clearTimeout(timeout);NET.peer=peer;NET.mode="client";NET.code=code;
   $("v4Code").textContent=code;$("v4Create").style.display="none";
   conn.send({k:"join",name:NET.cfg.name,color:NET.cfg.color});});
  conn.on("data",onClientData);
  conn.on("close",()=>{if(NET.mode==="client")hostLost()});
 });
 peer.on("call",onIncomingCall);
 peer.on("error",e=>{
  if(e.type==="peer-unavailable")roomInfo("Sala "+code+" não encontrada. Confira o código (o anfitrião precisa estar com a sala aberta).");
  else if(!joined)roomInfo("Erro de conexão ("+e.type+").");
 });
}
function onClientData(m){
 if(!m||typeof m!=="object")return;
 if(m.k==="lobby")renderLobby(m);
 else if(m.k==="reject"){roomInfo("Não foi possível entrar: "+m.why);NET.mode="solo"}
 else if(m.k==="start"){U.me=m.me;NET.started=true;showGameUI()}
 else onMsg(m);
}
function hostLost(){
 NET.mode="lost";
 showMsgModal("CONEXÃO PERDIDA","A conexão com o anfitrião da sala caiu. Recarregue a página para voltar ao menu.");
}
function copyCode(){
 const c=NET.code;if(!c)return;
 const done=()=>log("Código "+c+" copiado.");
 if(navigator.clipboard)navigator.clipboard.writeText(c).then(done,()=>prompt("Código da sala:",c));else prompt("Código da sala:",c);
}

// ---------- abas ----------
function setTab(t){
 U.tab=t;
 $("paneGame").style.display=t==="game"?"":"none";
 $("paneSocial").style.display=t==="social"?"":"none";
 $("tabGame").classList.toggle("on",t==="game");$("tabSocial").classList.toggle("on",t==="social");
 if(t==="social"){U.unread=0;const l=$("chatList");l.scrollTop=l.scrollHeight}
 updateBadge();
}
function updateBadge(){const b=$("socialBadge");b.textContent=U.unread||"";b.style.display=U.unread?"":"none"}

// ---------- chat público / privado ----------
function addChat(m){
 U.chat.push(m);if(U.chat.length>300)U.chat.shift();
 if(m.from!==U.me&&U.tab!=="social"){U.unread++;updateBadge()}
 drawChat();
}
function drawChat(){
 const l=$("chatList");
 l.innerHTML=U.chat.map(m=>{
  if(m.sys)return `<div class="msg sys">${esc(m.text)}</div>`;
  const mine=m.from===U.me;
  const color=V?col(m.from):"#fff";
  const who=`<b style="color:${color}">${mine?"Você":esc(m.fromName)}</b>`;
  if(m.to===null)return `<div class="msg"><span class="tag">todos</span> ${who}: ${esc(m.text)}</div>`;
  return `<div class="msg priv"><span class="tag">🔒 privada</span> ${who} → <b>${mine?esc(m.toName):"você"}</b>: ${esc(m.text)}</div>`;
 }).join("")||"<i class='muted'>Nenhuma mensagem ainda. Escolha “Todos” ou um jogador para mensagem privada.</i>";
 l.scrollTop=l.scrollHeight;
}
function sendChat(e){
 if(e)e.preventDefault();
 const inp=$("chatInput"),text=inp.value.trim();if(!text)return false;
 const to=$("chatTo").value==="all"?null:Number($("chatTo").value);
 U.chatTo=$("chatTo").value;
 if(NET.mode==="client"){if(NET.hostConn&&NET.hostConn.open)NET.hostConn.send({k:"chat",to,text})}
 else handleChat(U.me,{to,text});
 inp.value="";return false;
}
function chatWith(seat){setTab("social");$("chatTo").value=String(seat);U.chatTo=String(seat);$("chatInput").focus()}

// ---------- alianças secretas ----------
function allyCmd(t,seat){
 act(t==="propose"?{t:"propose",to:seat}:t==="answer1"?{t:"answer",from:seat,accept:true}:t==="answer0"?{t:"answer",from:seat,accept:false}:{t:"break",with:seat});
}

// ---------- voz ----------
async function toggleMic(){
 if(NET.mode!=="host"&&NET.mode!=="client"){log("A voz funciona em salas online (CRIAR SALA / ENTRAR).");return}
 if(!V||!V.cfg.voice){log("A comunicação por voz está desativada nesta sala.");return}
 if(!VOICE.stream){
  try{VOICE.stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true}})}
  catch(e){log("Não consegui acessar o microfone. Permita o microfone no navegador (e use https).");return}
  VOICE.muted=false;watchLevel("me",VOICE.stream);callAll();
  log("🎙 Microfone ligado: quem está na sala te ouve.");
 }else{
  VOICE.muted=!VOICE.muted;
  VOICE.stream.getAudioTracks().forEach(t=>t.enabled=!VOICE.muted);
  log(VOICE.muted?"🔇 Microfone mutado.":"🎙 Microfone ligado.");
 }
 renderVoice();
}
function toggleDeaf(){
 VOICE.deaf=!VOICE.deaf;
 Object.values(VOICE.audios).forEach(a=>a.muted=VOICE.deaf);
 renderVoice();
}
// Cada pessoa com microfone liga para todos os outros; quem recebe só ouve (sem devolver áudio).
function callAll(){
 if(!VOICE.stream||!NET.peer||!V)return;
 V.peers.forEach((id,seat)=>{
  if(!id||seat===U.me||!V.human[seat]||VOICE.calls[id])return;
  try{
   const call=NET.peer.call(id,VOICE.stream);
   if(!call)return;
   VOICE.calls[id]=call;
   call.on("close",()=>{delete VOICE.calls[id]});
   call.on("error",()=>{delete VOICE.calls[id]});
  }catch(e){}
 });
}
function onIncomingCall(call){
 call.answer();
 call.on("stream",st=>playRemote(call.peer,st));
 call.on("close",()=>stopRemote(call.peer));
}
function playRemote(peerId,st){
 let a=VOICE.audios[peerId];
 if(!a){a=document.createElement("audio");a.autoplay=true;a.playsInline=true;document.body.appendChild(a);VOICE.audios[peerId]=a}
 a.srcObject=st;a.muted=VOICE.deaf;
 const p=a.play&&a.play();if(p&&p.catch)p.catch(()=>{});
 watchLevel(peerId,st);renderVoice();
}
function stopRemote(peerId){
 const a=VOICE.audios[peerId];if(a){a.srcObject=null;a.remove();delete VOICE.audios[peerId]}
 delete VOICE.levels[peerId];delete VOICE.analysers[peerId];renderVoice();
}
function watchLevel(key,stream){
 try{
  VOICE.ctx=VOICE.ctx||new (window.AudioContext||window.webkitAudioContext)();
  if(VOICE.ctx.state==="suspended")VOICE.ctx.resume();
  const an=VOICE.ctx.createAnalyser();an.fftSize=512;
  VOICE.ctx.createMediaStreamSource(stream).connect(an);
  VOICE.analysers[key]=an;
  if(!VOICE.timer)VOICE.timer=setInterval(()=>{
   const buf=new Uint8Array(256);
   for(const k in VOICE.analysers){
    VOICE.analysers[k].getByteTimeDomainData(buf);
    let m=0;for(const v of buf)m=Math.max(m,Math.abs(v-128));
    VOICE.levels[k]=m/128;
   }
   document.querySelectorAll("[data-vseat]").forEach(el=>{
    const seat=Number(el.dataset.vseat),id=seat===U.me?"me":(V&&V.peers[seat]);
    el.classList.toggle("speaking",!!id&&(VOICE.levels[id]||0)>0.04&&!(seat===U.me&&VOICE.muted));
   });
  },150);
 }catch(e){}
}
function renderVoice(){
 if(!V)return;
 const on=NET.mode==="host"||NET.mode==="client";
 $("voiceCard").style.display=V.cfg.voice?"":"none";
 const mic=$("micBtn");
 mic.textContent=!VOICE.stream?"🎙 ENTRAR NA VOZ":VOICE.muted?"🔇 MUTADO (ligar)":"🎙 MICROFONE LIGADO";
 mic.classList.toggle("live",!!VOICE.stream&&!VOICE.muted);
 $("deafBtn").textContent=VOICE.deaf?"🔈 OUVIR TODOS":"🔕 SILENCIAR TODOS";
 $("voiceHelp").textContent=on?"Todos na sala com o microfone ligado se ouvem. Quem não liga o microfone só ouve.":"A voz só funciona em salas online (CRIAR SALA / ENTRAR).";
 mic.disabled=!on;$("deafBtn").disabled=!on;
 $("voiceList").innerHTML=V.names.map((n,i)=>V.human[i]?`<div class="voice-row" data-vseat="${i}"><i class="dot" style="background:${col(i)}"></i>${esc(n)}${i===U.me?" (você)":""} <span class="spk">🔊</span></div>`:"").join("");
}

// ---------- painel social ----------
function renderSocial(){
 if(!V)return;
 // alianças
 $("allyCard").style.display=V.cfg.alliance?"":"none";
 const rows=[];
 V.names.forEach((n,i)=>{
  if(i===U.me)return;
  const alive=V.alive.includes(i);
  let st="";
  if(!alive)st=`<span class="muted">eliminado</span>`;
  else if(V.ally===i)st=`<span class="ok">🤝 aliado secreto</span> <button class="btn tiny danger" onclick="allyCmd('break',${i})">Romper</button>`;
  else if(V.propIn.includes(i))st=`<span class="warn">propõe aliança</span> <button class="btn tiny ok" onclick="allyCmd('answer1',${i})">Aceitar</button> <button class="btn tiny" onclick="allyCmd('answer0',${i})">Recusar</button>`;
  else if(V.propOut.includes(i))st=`<span class="muted">⏳ proposta enviada</span>`;
  else if(V.ally==null)st=`<button class="btn tiny" onclick="allyCmd('propose',${i})">Propor aliança</button>`;
  else st=`<span class="muted">—</span>`;
  rows.push(`<div class="ally-row"><i class="dot" style="background:${col(i)}"></i><span class="nm">${esc(n)}</span>${st}${alive?` <button class="btn tiny" title="Mensagem privada" onclick="chatWith(${i})">💬</button>`:""}</div>`);
 });
 $("allyList").innerHTML=rows.join("");
 $("allyNote").textContent=V.ally!=null?`Aliança secreta com ${V.names[V.ally]}: vocês não podem se atacar. Só vocês dois sabem.`:"Alianças são secretas: ninguém além de vocês dois vê. Aliados não podem se atacar até uma das partes romper.";
 // destinatário do chat
 const sel=$("chatTo"),cur=sel.value||U.chatTo||"all";
 sel.innerHTML=`<option value="all">📢 Todos (público)</option>`+V.names.map((n,i)=>i===U.me?"":`<option value="${i}">🔒 ${esc(n)}</option>`).join("");
 sel.value=[...sel.options].some(o=>o.value===cur)?cur:"all";
 renderVoice();
 if(VOICE.stream)callAll();
}
