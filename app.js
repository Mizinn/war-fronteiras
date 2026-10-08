
const COLORS=["#20d47a","#ff4b4b","#ffd23f","#39a9ff","#d65cff","#ff8c3a"];
const TERRITORIES=[
{name:'Alasca', pts:'38,221 165,219 208,270 177,325 79,329 39,286', continent:'América do Norte'},
{name:'Mackenzie', pts:'164,218 301,226 352,275 319,326 207,326 177,280', continent:'América do Norte'},
{name:'Vancouver', pts:'207,326 319,326 335,386 282,433 199,423 177,363', continent:'América do Norte'},
{name:'Ottawa', pts:'319,326 393,302 438,349 418,410 335,386', continent:'América do Norte'},
{name:'Califórnia', pts:'199,423 282,433 323,491 276,531 211,510 180,469', continent:'América do Norte'},
{name:'Nova York', pts:'323,423 418,410 442,468 397,501 330,490', continent:'América do Norte'},
{name:'México', pts:'277,530 332,491 397,501 367,555 311,578', continent:'América do Norte'},
{name:'Labrador', pts:'394,301 455,249 512,276 500,337 438,349', continent:'América do Norte'},
{name:'Groenlândia', pts:'447,105 594,103 622,190 565,265 489,258 448,211', continent:'América do Norte'},
{name:'Islândia', pts:'574,278 618,267 646,295 616,316 577,308', continent:'Europa'},
{name:'Inglaterra', pts:'621,310 651,292 673,323 648,350 621,341', continent:'Europa'},
{name:'França', pts:'646,350 705,340 723,378 686,409 646,390', continent:'Europa'},
{name:'Alemanha', pts:'705,337 758,333 776,374 738,405 706,380', continent:'Europa'},
{name:'Polônia', pts:'758,331 821,326 839,368 803,400 764,378', continent:'Europa'},
{name:'Suécia', pts:'737,235 786,220 817,278 785,330 742,303', continent:'Europa'},
{name:'Moscou', pts:'785,278 875,251 902,311 867,361 811,345', continent:'Europa'},
{name:'Omsk', pts:'873,259 953,236 989,285 953,333 884,321', continent:'Ásia'},
{name:'Udminka', pts:'945,183 1057,166 1094,224 1061,277 972,267', continent:'Ásia'},
{name:'Sibéria', pts:'1055,128 1270,130 1360,205 1302,275 1094,225', continent:'Ásia'},
{name:'Vladivostok', pts:'1267,198 1432,235 1408,316 1301,337 1278,281', continent:'Ásia'},
{name:'Tchita', pts:'1062,276 1172,266 1212,324 1170,378 1080,347', continent:'Ásia'},
{name:'Aral', pts:'933,330 1016,309 1060,349 1025,397 956,390', continent:'Ásia'},
{name:'Mongólia', pts:'1100,344 1208,326 1261,370 1215,423 1117,416', continent:'Ásia'},
{name:'China', pts:'1125,413 1264,372 1284,454 1234,514 1137,500', continent:'Ásia'},
{name:'Índia', pts:'1017,401 1116,412 1137,500 1087,541 1027,496', continent:'Ásia'},
{name:'Vietnã', pts:'1128,497 1208,495 1225,558 1162,570 1127,537', continent:'Ásia'},
{name:'Japão', pts:'1298,405 1355,389 1380,443 1325,461', continent:'Ásia'},
{name:'Oriente Médio', pts:'888,421 1018,398 1055,450 1023,506 947,511 902,474', continent:'Ásia'},
{name:'Egito', pts:'813,479 892,470 929,526 898,574 820,558', continent:'África'},
{name:'Argélia', pts:'620,475 812,469 827,548 765,599 645,583 600,527', continent:'África'},
{name:'Sudão', pts:'829,558 930,525 1000,565 967,651 879,666 817,603', continent:'África'},
{name:'Congo', pts:'773,598 881,640 880,718 814,748 752,697', continent:'África'},
{name:'África do Sul', pts:'753,700 879,708 878,799 806,852 742,789', continent:'África'},
{name:'Madagascar', pts:'907,662 947,650 964,724 934,756 902,722', continent:'África'},
{name:'Venezuela', pts:'354,573 451,558 494,620 444,666 363,634', continent:'América do Sul'},
{name:'Brasil', pts:'449,631 567,613 623,680 580,774 510,823 438,752', continent:'América do Sul'},
{name:'Peru', pts:'366,637 442,656 475,733 438,791 384,751', continent:'América do Sul'},
{name:'Argentina', pts:'438,752 510,822 487,947 430,1018 395,899', continent:'América do Sul'},
{name:'Chile', pts:'383,750 426,782 407,933 379,881', continent:'América do Sul'},
{name:'Sumatra', pts:'1067,694 1115,670 1149,735 1112,768 1070,742', continent:'Oceania'},
{name:'Bornéu', pts:'1152,676 1202,663 1230,718 1193,749 1158,728', continent:'Oceania'},
{name:'Nova Guiné', pts:'1250,668 1373,641 1405,697 1330,729 1266,709', continent:'Oceania'},
{name:'Austrália', pts:'1168,750 1328,720 1405,793 1378,895 1267,950 1177,898', continent:'Oceania'}
];
const ADJ={
 "Alasca":["Mackenzie","Vancouver"],"Mackenzie":["Alasca","Vancouver","Ottawa","Labrador"],
 "Vancouver":["Mackenzie","Alasca","Ottawa","Califórnia"],"Ottawa":["Mackenzie","Vancouver","Nova York","Labrador"],
 "Califórnia":["Vancouver","Nova York","México"],"Nova York":["Ottawa","Califórnia","México","Labrador"],
 "México":["Califórnia","Nova York","Venezuela"],"Labrador":["Mackenzie","Ottawa","Groenlândia"],
 "Groenlândia":["Labrador","Islândia"],"Islândia":["Groenlândia","Inglaterra"],
 "Inglaterra":["Islândia","França","Suécia"],"França":["Inglaterra","Alemanha","Argélia"],
 "Alemanha":["França","Polônia","Suécia","Moscou"],"Polônia":["Alemanha","Moscou","Europa Norte"],
 "Suécia":["Inglaterra","Alemanha","Europa Norte"],"Moscou":["Alemanha","Polônia","Omsk","Oriente Médio"],
 "Europa Norte":["Suécia","Polônia","Moscou","Udminka"],"Omsk":["Moscou","Udminka","Tchita","Aral"],
 "Udminka":["Europa Norte","Omsk","Sibéria"],"Sibéria":["Udminka","Tchita","Vladivostok"],
 "Vladivostok":["Sibéria","Tchita","China","Japão"],"Tchita":["Sibéria","Omsk","Mongólia","Vladivostok"],
 "Aral":["Omsk","Mongólia","Índia","Oriente Médio"],"Mongólia":["Tchita","Aral","China"],
 "China":["Mongólia","Vladivostok","Índia","Vietnã"],"Índia":["China","Aral","Vietnã","Oriente Médio"],
 "Vietnã":["China","Índia","Japão"],"Japão":["Vietnã","Vladivostok"],
 "Oriente Médio":["Moscou","Aral","Índia","Egito"],"Egito":["Oriente Médio","Argélia","Sudão"],
 "Argélia":["França","Egito","Brasil"],"Sudão":["Egito","Congo","África do Sul"],
 "Congo":["Sudão","África do Sul"],"África do Sul":["Congo","Sudão","Madagascar","Argentina"],
 "Madagascar":["África do Sul"],"Venezuela":["México","Brasil"],"Brasil":["Venezuela","Peru","Argentina","Argélia"],
 "Peru":["Brasil","Chile"],"Argentina":["Brasil","Chile","África do Sul"],"Chile":["Peru","Argentina"],
 "Sumatra":["Austrália"],"Bornéu":["Austrália","Nova Guiné"],"Nova Guiné":["Bornéu","Austrália"],
 "Austrália":["Sumatra","Bornéu","Nova Guiné"]
};

let S={name:"Você",turn:true,attack:false,source:null,data:{},pieces:[]};

function start(){
 S.name=document.getElementById("name").value.trim()||"Você";
 document.getElementById("menu").classList.add("hidden");
 document.getElementById("game").classList.remove("hidden");
 init();
}
function init(){
 S.data={};
 TERRITORIES.forEach((t,i)=>S.data[t.name]={owner:i%6,troops:2+Math.floor(Math.random()*4)});
 // Dar ao jogador uma área inicial bem visível e suficiente para testar.
 ["Alasca","Mackenzie","Vancouver","Ottawa","Nova York","Califórnia","México","Brasil","Venezuela","Argentina"].forEach(n=>S.data[n].owner=0);
 S.data["Alasca"].troops=5;S.data["Mackenzie"].troops=4;S.data["Brasil"].troops=5;
 draw();update();log("Partida iniciada no mapa mundial.");log("Contornos coloridos mostram o dono de cada território.");
}
function draw(){
 const svg=document.getElementById("svg"),pieces=document.getElementById("pieces");
 svg.innerHTML="";pieces.innerHTML="";
 TERRITORIES.forEach(t=>{
   const d=S.data[t.name],p=document.createElementNS("http://www.w3.org/2000/svg","polygon");
   p.setAttribute("points",t.pts);p.setAttribute("class","zone "+(S.source===t.name?"attackSource":""));
   p.setAttribute("stroke",COLORS[d.owner]);
   p.onclick=()=>select(t.name);svg.appendChild(p);
 });
 // rótulos discretos apenas onde a imagem não tem nome claro; os nomes originais continuam visíveis.
 TERRITORIES.forEach(t=>{
   const d=S.data[t.name],coords=t.pts.split(" ").map(x=>x.split(",").map(Number));
   const cx=coords.reduce((a,p)=>a+p[0],0)/coords.length,cy=coords.reduce((a,p)=>a+p[1],0)/coords.length;
   const tx=document.createElementNS("http://www.w3.org/2000/svg","text");
   tx.setAttribute("x",cx);tx.setAttribute("y",cy);tx.setAttribute("class","label");tx.textContent=d.troops;
   tx.onclick=()=>select(t.name);svg.appendChild(tx);
 });
 // peças: uma peça por tropa visualmente agrupada no centro de cada território.
 TERRITORIES.forEach(t=>{
   const d=S.data[t.name],coords=t.pts.split(" ").map(x=>x.split(",").map(Number));
   const cx=coords.reduce((a,p)=>a+p[0],0)/coords.length,cy=coords.reduce((a,p)=>a+p[1],0)/coords.length;
   const p=document.createElement("div");p.className="piece";p.style.background=COLORS[d.owner];
   p.style.left=`calc(${cx/1500*100}% - 12px)`;p.style.top=`calc(${cy/1125*100}% - 12px)`;
   p.textContent=d.troops;p.draggable=d.owner===0;
   p.title=t.name;
   p.ondragstart=e=>{if(!S.turn||S.attack)return e.preventDefault();e.dataTransfer.setData("text/plain",t.name);p.classList.add("dragging")};
   p.ondragend=()=>p.classList.remove("dragging");
   p.ondragover=e=>{if(!S.attack)e.preventDefault()};
   p.ondrop=e=>{e.preventDefault();move(e.dataTransfer.getData("text/plain"),t.name)};
   pieces.appendChild(p);
 });
}
function select(n){
 if(!S.turn)return;
 if(S.attack){
   if(!S.source){
     if(S.data[n].owner!==0){log("Escolha um território seu como origem.");return}
     S.source=n;document.getElementById("selection").innerHTML=`Origem: <b>${n}</b>. Agora clique no território inimigo que deseja atacar.`;draw();return;
   }
   if(n===S.source)return;
   if(S.data[n].owner===0){S.source=n;document.getElementById("selection").innerHTML=`Origem: <b>${n}</b>. Agora escolha um inimigo.`;draw();return}
   if(!ADJ[S.source]?.includes(n)){log("Esse ataque não é permitido: os territórios não são conectados.");return}
   battle(S.source,n);return;
 }
 document.getElementById("selection").innerHTML=`Território selecionado: <b>${n}</b> — ${S.data[n].troops} tropas.`;
}
function attackMode(){
 S.attack=true;S.source=null;
 document.getElementById("selection").innerHTML="MODO ATAQUE: clique no seu território de origem e depois no território inimigo.";
 draw();
}
function move(from,to){
 if(!from||from===to||S.attack)return;
 if(S.data[from].owner!==0||S.data[to].owner!==0){log("Movimentação somente entre territórios seus.");return}
 if(!ADJ[from]?.includes(to)){log("Os territórios não são adjacentes.");return}
 if(S.data[from].troops<=1){log("Deixe pelo menos 1 tropa na origem.");return}
 S.data[from].troops--;S.data[to].troops++;
 log(`1 tropa foi movida de ${from} para ${to}.`);
 draw();update();
}
function battle(from,to){
 if(S.data[from].troops<2){log("Você precisa de pelo menos 2 tropas para atacar.");return}
 const na=Math.min(3,S.data[from].troops-1),nd=Math.min(2,S.data[to].troops);
 animateDice(na,nd,from,to);
}
function animateDice(na,nd,from,to){
 const m=document.getElementById("modal"),box=document.getElementById("dice");
 m.classList.remove("hidden");box.innerHTML="";
 for(let i=0;i<na;i++){let d=document.createElement("span");d.className="die roll";d.textContent="⚄";box.appendChild(d)}
 box.append(" VS ");
 for(let i=0;i<nd;i++){let d=document.createElement("span");d.className="die roll";d.textContent="⚄";box.appendChild(d)}
 let count=0;let timer=setInterval(()=>{
   box.querySelectorAll(".die").forEach(d=>d.textContent=1+Math.floor(Math.random()*6));
   if(++count>=16){clearInterval(timer);resolveBattle(na,nd,from,to)}
 },90);
}
function resolveBattle(na,nd,from,to){
 const a=S.data[from],d=S.data[to];
 const ad=Array.from({length:na},()=>1+Math.floor(Math.random()*6)).sort((x,y)=>y-x);
 const dd=Array.from({length:nd},()=>1+Math.floor(Math.random()*6)).sort((x,y)=>y-x);
 let al=0,dl=0;
 for(let i=0;i<Math.min(na,nd);i++) ad[i]>dd[i]?dl++:al++;
 a.troops-=al;d.troops-=dl;
 document.getElementById("dice").innerHTML=ad.map(x=>`<span class="die">${x}</span>`).join("")+" VS "+dd.map(x=>`<span class="die">${x}</span>`).join("");
 if(d.troops<=0){
   d.owner=0;d.troops=Math.max(1,na-al);
   a.troops=Math.max(1,a.troops-(na-al));
   document.getElementById("combatResult").textContent=`VOCÊ CONQUISTOU ${to}!`;
   log(`🏆 ${from} conquistou ${to}.`);
 }else document.getElementById("combatResult").textContent=`Perdas — você: ${al} | defensor: ${dl}`;
 log(`${from} atacou ${to}. Perdas: ${al} contra ${dl}.`);
 S.attack=false;S.source=null;draw();update();
}
function closeModal(){document.getElementById("modal").classList.add("hidden");}
function update(){
 document.getElementById("troops").textContent=TERRITORIES.filter(t=>S.data[t.name].owner===0).reduce((a,t)=>a+S.data[t.name].troops,0);
 document.getElementById("territories").textContent=TERRITORIES.filter(t=>S.data[t.name].owner===0).length;
 document.getElementById("turn").textContent=S.turn?"Seu turno":"Turno da CPU";
 const c=document.getElementById("colors");
 c.innerHTML=COLORS.map((x,i)=>`<span><i class="dot" style="background:${x}"></i>${i===0?S.name:"Jogador "+(i+1)}</span>`).join(" ");
}
function log(t){const l=document.getElementById("log"),d=document.createElement("div");d.textContent="• "+t;l.appendChild(d);l.scrollTop=l.scrollHeight;}

/* ===== WAR COMMAND bootstrap ===== */
(function(){
  const oldStart = window.start;
  window.v4CreateRoom = function(){
    const name = document.getElementById("name").value.trim() || "COMMANDER";
    const players = +document.getElementById("v4Players").value;
    const time = document.getElementById("v4Time").value;
    const ai = document.getElementById("v4AI").checked;
    const alliances = document.getElementById("v4Alliance").checked;
    const voice = document.getElementById("v4Voice").checked;
    const mission = document.getElementById("v4Mission").checked;
    const code = Math.random().toString(36).slice(2,8).toUpperCase();
    window.WAR_CONFIG={name,players,time,ai,alliances,voice,mission,code};
    const codeEl=document.getElementById("v4Code");
    if(codeEl)codeEl.textContent=code;
    const info=document.getElementById("v4RoomInfo");
    if(info)info.textContent="Código gerado. Compartilhe com seu esquadrão.";
    if(typeof oldStart==="function"){
      document.getElementById("name").value=name;
      oldStart();
    }else{
      document.getElementById("menu").classList.add("hidden");
      document.getElementById("game").classList.remove("hidden");
    }
  };
  window.v4ShowJoin=function(){
    const p=document.getElementById("v4Join");if(p)p.style.display="block";
  };
  window.v4JoinRoom=function(){
    const code=(document.getElementById("v4JoinCode").value||"").trim().toUpperCase();
    if(code.length<4){alert("Digite um código de sala válido.");return}
    const name=document.getElementById("name").value.trim()||"COMMANDER";
    window.WAR_CONFIG={name,code,players:+document.getElementById("v4Players").value};
    if(typeof oldStart==="function"){
      document.getElementById("name").value=name;oldStart();
    }
  };
})();
