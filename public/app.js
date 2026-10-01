const socket=io({
  transports:["polling","websocket"],
  reconnection:true,
  reconnectionAttempts:Infinity,
  reconnectionDelay:1000,
  reconnectionDelayMax:5000
});
let state=null, selected=null, deploySelected=null;

function setConnectionStatus(online,text){
  const box=el("connectionStatus");
  if(!box)return;
  box.textContent=text;
  box.classList.toggle("online",online);
  box.classList.toggle("offline",!online);
}

socket.on("connect",()=>setConnectionStatus(true,"ONLINE"));
socket.on("disconnect",()=>setConnectionStatus(false,"CONEXÃO PERDIDA — TENTANDO RECONECTAR..."));
socket.io.on("reconnect_attempt",()=>setConnectionStatus(false,"RECONECTANDO..."));

const POS={
 norte:[42,45],nordeste:[200,35],oeste:[45,190],centro:[190,175],leste:[350,155],
 sudoeste:[55,335],sul:[210,330],sudeste:[360,305],pacifico:[505,320],antartico:[350,480],
 europa:[500,45],escandinavia:[625,30],norteafrica:[500,170],africaocidental:[590,235],
 africaoriental:[690,185],sulafrica:[650,340],asiaocidental:[665,105],asia:[760,75],
 india:[780,185],siberia:[760,0],oceania:[760,330],ilha:[625,465],cordilheira:[330,420],
 planicie:[355,65]
};

function el(id){return document.getElementById(id)}
function show(id){["menu","lobby","deployScreen","gameScreen"].forEach(x=>el(x).classList.add("hidden"));el(id).classList.remove("hidden")}
function toast(t){el("toast").textContent=t;el("toast").classList.add("show");setTimeout(()=>el("toast").classList.remove("show"),2800)}
function name(){return el("playerName").value.trim()||"Jogador"}
function createRoom(){socket.emit("createRoom",{name:name()})}
function joinRoom(){socket.emit("joinRoom",{name:name(),code:el("roomCode").value.trim()})}
function readyUp(){socket.emit("ready")}
function copyCode(){navigator.clipboard?.writeText(el("codeDisplay").textContent);toast("Código copiado!")}
function startBattle(){socket.emit("startBattle")}
function closeModal(){el("modal").classList.add("hidden")}
function togglePanel(x){if(x==="rules"){el("modalContent").innerHTML=`<h2>Regras rápidas</h2><p>Receba reforços no começo do turno. Ataque territórios vizinhos com até 3 dados. Empates favorecem a defesa. Ao conquistar, mova tropas e receba uma carta. No final, passe a vez.</p><p>Você pode movimentar tropas entre territórios aliados vizinhos. Aviões fazem ataques rápidos e frotas dão suporte. Alianças são diplomáticas e podem ser quebradas.</p>`;el("modal").classList.remove("hidden")}}
function renderPlayers(target){el(target).innerHTML=state.players.map(p=>`<div class="playerline"><span><i class="dot" style="background:${p.color};display:inline-block;margin-right:6px"></i>${esc(p.name)}</span><b>${p.territories}</b></div>`).join("")}
function esc(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}

function makeMap(id,deployMode=false){
  const map=el(id);map.innerHTML="";
  const seen=new Set();
  Object.entries(POS).forEach(([tid,pos])=>{
    const [x,y]=pos;
    const t=state.territories[tid]; if(!t)return;
    const owner=state.players.find(p=>p.id===t.owner);
    const d=document.createElement("div");d.className="territory";d.dataset.id=tid;
    d.style.left=x+"px";d.style.top=y+"px";
    d.style.borderColor=owner?.color||"#405b75";
    d.style.background=`linear-gradient(135deg, ${owner?.color||"#102337"}33, #102337)`;
    d.innerHTML=`<div class="name">${esc(t.name)}</div><div class="troops">${t.troops}</div><div class="owner">${esc(owner?.name||"Ninguém")}</div><div class="units">⚔ ${t.units.land} &nbsp;✈ ${t.units.air} &nbsp;⚓ ${t.units.navy}</div>`;
    d.onclick=()=>deployMode?selectDeploy(tid):selectTerritory(tid);
    map.appendChild(d);
  });
  Object.entries(POS).forEach(([a,[x1,y1]])=>{
    const ta=state.territories[a];if(!ta)return;
    const neighbors=getNeighbors(a);
    neighbors.forEach(b=>{
      const key=[a,b].sort().join("-");
      if(seen.has(key)||!POS[b])return;seen.add(key);
      const [x2,y2]=POS[b];const dx=x2-x1+50,dy=y2-y1+30,len=Math.hypot(dx,dy),ang=Math.atan2(dy,dx)*180/Math.PI;
      const edge=document.createElement("div");edge.className="edge";edge.style.left=(x1+58)+"px";edge.style.top=(y1+35)+"px";edge.style.width=len+"px";edge.style.transform=`rotate(${ang}deg)`;map.appendChild(edge);
    });
  });
}
function getNeighbors(t){const local={norte:["nordeste","oeste","centro","planicie"],nordeste:["norte","leste","centro"],oeste:["norte","centro","sudoeste","cordilheira"],centro:["norte","nordeste","oeste","leste","sul","sudoeste","sudeste","planicie"],leste:["nordeste","centro","sudeste"],sudoeste:["oeste","centro","sul","pacifico","cordilheira"],sul:["sudoeste","centro","sudeste","antartico","planicie"],sudeste:["centro","leste","sul","pacifico"],pacifico:["sudoeste","sudeste","oceania","cordilheira"],antartico:["sul","oceania"],europa:["norteafrica","asiaocidental","asia","escandinavia"],escandinavia:["europa","asia"],norteafrica:["europa","africaocidental","africaoriental","sulafrica"],africaocidental:["norteafrica","africaoriental","sulafrica"],africaoriental:["norteafrica","africaocidental","sulafrica","asiaocidental"],sulafrica:["norteafrica","africaocidental","africaoriental","oceania"],asiaocidental:["europa","asia","africaoriental","india"],asia:["europa","escandinavia","asiaocidental","india","siberia"],india:["asiaocidental","asia","siberia","oceania"],siberia:["escandinavia","asia","india","oceania"],oceania:["pacifico","antartico","sulafrica","india","siberia","ilha"],ilha:["oceania"],cordilheira:["pacifico","sudoeste","norte"],planicie:["norte","centro","sul"]};return local[t]||[]}

function selectDeploy(tid){
  const t=state.territories[tid];if(t.owner!==state.me.id)return toast("Escolha um território seu.");
  deploySelected=tid;el("selectedDeploy").innerHTML=`<b>${t.name}</b><br>Tropas atuais: ${t.troops}<br>Reforços restantes: ${state.me.deployLeft}`;
  document.querySelectorAll(".territory").forEach(x=>x.classList.toggle("selected",x.dataset.id===tid));
}
function deploy(type,n){if(!deploySelected)return toast("Selecione um território.");socket.emit("deploy",{territory:deploySelected,amount:n,type})}

function selectTerritory(tid){
  selected=tid;const t=state.territories[tid],owner=state.players.find(p=>p.id===t.owner);
  document.querySelectorAll(".territory").forEach(x=>x.classList.toggle("selected",x.dataset.id===tid));
  el("selectedTitle").textContent=t.name;
  el("territoryInfo").innerHTML=`<b>${esc(owner?.name)}</b><br>${t.troops} tropas<br>⚔ ${t.units.land} • ✈ ${t.units.air} • ⚓ ${t.units.navy}`;
  const ns=getNeighbors(tid);
  const moveTargets=ns.filter(x=>state.territories[x]?.owner===state.me.id);
  const attackTargets=ns.filter(x=>state.territories[x]?.owner!==state.me.id);
  el("moveTarget").innerHTML=moveTargets.map(x=>`<option value="${x}">${state.territories[x].name}</option>`).join("")||"<option>Nenhum</option>";
  el("attackTarget").innerHTML=attackTargets.map(x=>`<option value="${x}">${state.territories[x].name}</option>`).join("")||"<option>Nenhum</option>";
}
function moveTroops(){if(!selected)return toast("Selecione o território de origem.");socket.emit("move",{from:selected,to:el("moveTarget").value,amount:Number(el("moveAmount").value),type:el("unitType").value})}
function attack(){if(!selected)return toast("Selecione seu território atacante.");socket.emit("attack",{from:selected,to:el("attackTarget").value,dice:Number(el("attackDice").value)})}
function airStrike(){if(!selected)return toast("Selecione o território de onde sairá o avião.");socket.emit("airStrike",{from:selected,to:el("attackTarget").value})}
function endTurn(){socket.emit("endTurn")}

function openAlliance(){
  el("modalContent").innerHTML="<h2>🤝 Alianças</h2>"+state.players.filter(p=>p.id!==state.me.id&&p.alive).map(p=>`<div class="allyrow"><span>${esc(p.name)}</span><span>${state.alliances.some(a=>(a.a===state.me.id&&a.b===p.id)||(a.a===p.id&&a.b===state.me.id))?`<button onclick="breakAlly('${p.id}')">ROMPER</button>`:`<button onclick="invite('${p.id}')">CONVIDAR</button>`}</span></div>`).join("");
  el("modal").classList.remove("hidden")
}
function invite(id){socket.emit("inviteAlliance",{target:id});toast("Convite enviado.")}
function breakAlly(id){socket.emit("breakAlliance",{target:id});closeModal()}
function renderGame(){
  el("myName").textContent=state.me.name;el("myColor").style.background=state.me.color;
  el("mission").textContent=state.me.mission?.text||"—";
  el("reinforce").textContent=state.me.deployLeft;el("cards").textContent=state.me.cards.length;
  el("units").innerHTML=`⚔ Exércitos: ${state.me.units.land}<br>✈ Aviões: ${state.me.units.air}<br>⚓ Frotas: ${state.me.units.navy}`;
  el("turnLabel").textContent=state.activePlayer===state.me.id?"SEU TURNO":"TURNO DE "+(state.players.find(p=>p.id===state.activePlayer)?.name||"—");
  el("players").innerHTML=state.players.map(p=>`<div class="playerline"><span><i class="dot" style="background:${p.color};display:inline-block;margin-right:6px"></i>${esc(p.name)}</span><b>${p.territories}</b></div>`).join("");
  el("log").innerHTML=state.log.map(x=>`<div class="logline">› ${esc(x)}</div>`).join("");
  makeMap("map");
  if(selected&&state.territories[selected])selectTerritory(selected);
}
socket.on("roomCreated",({code})=>{el("codeDisplay").textContent=code;show("lobby")});
socket.on("state",s=>{
  state=s;
  if(s.phase==="lobby"){el("codeDisplay").textContent=s.code;renderPlayers("playerList");show("lobby")}
  else if(s.phase==="deployment"){show("deployScreen");el("myTroopsTop").textContent=s.me.deployLeft+" reforços";el("deployMission").textContent=s.me.mission?.text||"—";el("deployInfo").innerHTML=`Você recebeu ${s.me.territories.length} territórios.<br>Reforços: <b>${s.me.deployLeft}</b>`;renderPlayers("deployPlayers");makeMap("deployMap",true)}
  else {show("gameScreen");renderGame()}
});
socket.on("privateMission",m=>{if(state){state.me.mission=m;renderGame()}})
socket.on("errorMsg",toast);socket.on("info",toast);
socket.on("winner",name=>{el("modalContent").innerHTML=`<h1>🏆 ${esc(name)} VENCEU!</h1><p>Missão cumprida. A sala continuará aberta para vocês conferirem o resultado.</p>`;el("modal").classList.remove("hidden")});
socket.on("allianceInvite",({from,name})=>{
  el("modalContent").innerHTML=`<h2>🤝 Convite de aliança</h2><p><b>${esc(name)}</b> quer formar uma aliança com você.</p><button class="primary" style="padding:12px;width:100%" onclick="answerAlly('${from}',true)">ACEITAR</button><button style="padding:12px;width:100%;margin-top:8px" onclick="answerAlly('${from}',false)">RECUSAR</button>`;
  el("modal").classList.remove("hidden")
});
function answerAlly(id,accept){socket.emit("answerAlliance",{from:id,accept});closeModal()}
