# WAR COMMAND

Jogo de War no navegador (solo contra CPUs ou online com amigos). Funciona no GitHub Pages, sem servidor próprio.

Arquivos (todos na mesma pasta do repositório):

- index.html
- style.css
- app.js  (mapa, regras e motor da partida)
- net.js  (salas por código, voz, chat e alianças)
- war-map.png

Ative o GitHub Pages na branch principal, pasta `/ (root)`. Use sempre o endereço **https** do Pages (o microfone só funciona em https).

## Jogar online
1. Um jogador clica em **CRIAR SALA ONLINE**: aparece o **código da sala** (6 letras/números) e a lista de quem entrou.
2. Os amigos abrem o site, clicam em **ENTRAR EM UMA SALA POR CÓDIGO**, digitam o código e entram no lobby.
3. O anfitrião clica em **COMEÇAR PARTIDA**. Vagas sem humano viram CPU (se "IA para preencher vagas" estiver ligada). Quem sair no meio da partida é substituído por uma CPU.
4. Aba **SOCIAL**: voz, alianças secretas e chat (público ou privado por jogador).

Como funciona: conexão direta entre navegadores (WebRTC) usando o PeerJS; o anfitrião é quem comanda a partida e valida as jogadas (feche a aba dele e a sala acaba). O PeerJS é carregado do CDN (jsDelivr/unpkg) e usa o servidor público gratuito dele só para os jogadores se encontrarem. Para usar o seu próprio servidor de sinalização: `index.html?peerhost=meu.servidor.com&peerport=443`.
Conectividade entre redes: a configuração inclui STUN e um TURN público de teste (Open Relay) para tentar permitir conexões quando a ligação direta falha. Serviços públicos podem ficar indisponíveis ou impor limites; para partidas confiáveis, configure um serviço TURN próprio com credenciais apropriadas. As mensagens privadas passam pelo navegador do anfitrião (quem hospeda tecnicamente poderia lê-las se alterasse o código).

## Voz, chat e alianças
- **Voz:** botão "ENTRAR NA VOZ" liga seu microfone para todos da sala; "mutar" e "silenciar todos" disponíveis; o jogador que está falando acende na lista.
- **Chat:** escolha "Todos" ou um jogador; mensagem privada só chega ao destinatário. CPUs respondem.
- **Alianças secretas:** proponha a um jogador; só vocês dois ficam sabendo. Aliados não podem se atacar até um romper (o outro é avisado em privado). Uma aliança por jogador. CPUs aceitam/recusam e também propõem e rompem.

## Regras implementadas
- **Preparação:** 42 territórios sorteados igualmente (1 exército cada), objetivo secreto por jogador, escolha da cor (verde, vermelho, amarelo, azul, preto, branco) e 20 exércitos extras para posicionar antes da 1ª rodada.
- **Turno:** 1) trocar cartas e posicionar • 2) atacar • 3) remanejar • 4) encerrar (se conquistou, compra 1 carta).
- **Reforços:** territórios ÷ 2 (mínimo 3) + bônus de continente (Oceania/América do Sul +2, África +3, Europa/América do Norte +5, Ásia +7). O bônus de continente só pode ser posto dentro do próprio continente.
- **Combate:** origem com 2+ tropas; atacante escolhe 1 a 3 dados, defensor usa até 3. Maior×maior, 2º×2º, 3º×3º; empate favorece a defesa. Na conquista, movem-se tantos exércitos quanto dados usados (sempre deixando 1).
- **Remanejamento:** arraste uma peça sua para outro território seu conectado por territórios seus.
- **Cartas:** 42 de território (■ ● ▲) + 2 coringas. Troca: 3 iguais, 3 diferentes ou 2 + coringa. Valores: 4, 6, 8, 10, 12, 15, 20, 25… e +2 exércitos em cada território da carta que você controla.
- **Objetivos:** 6 de continentes, 24 territórios e 6 de destruir uma cor (vira "24 territórios" se a cor for a sua, não estiver em jogo ou for eliminada por outro). O jogo acaba assim que alguém cumpre o objetivo.

## Contornos dos territórios
Os contornos em `app.js` (`TERRITORIES[].d`) foram extraídos da própria `war-map.png` (coordenadas 1500×1125), então acompanham a costa e as divisas do mapa. Se trocar a imagem, os contornos precisam ser refeitos.

Observação: o código de sala usa o ID PeerJS do anfitrião e o servidor público de sinalização PeerJS. Para testar conexões que precisem de retransmissão TURN, use `?forceTurn=1` no fim do endereço do site; isso força o uso de TURN e ajuda a diagnosticar a conexão, mas pode falhar se o serviço público estiver indisponível. O jogo continua dependendo de o anfitrião manter a página aberta.


## Teste entre casas diferentes
1. Substitua os arquivos no repositório do GitHub pelos arquivos atualizados e aguarde a publicação do Pages.
2. Abra o site publicado usando `https://`.
3. Faça primeiro um teste normal entre duas casas. Se não conectar, tente acrescentar `?forceTurn=1` ao endereço do site em ambos os computadores (se o endereço já tiver `?`, use `&forceTurn=1`).
4. Se ainda falhar, o TURN público pode estar indisponível ou limitado. Configure um provedor TURN com credenciais válidas; os parâmetros aceitos são `turn`, `turnuser` e `turnpass`. Exemplo: `?turn=turn%3Aseu-servidor%3A3478&turnuser=USUARIO&turnpass=SENHA&forceTurn=1`.

Importante: credenciais colocadas na URL de um site público ficam visíveis aos visitantes. Não use credenciais permanentes/privadas dessa forma; para produção, gere credenciais temporárias em um backend. O Open Relay incluído é apenas uma tentativa de compatibilidade e não oferece garantia de disponibilidade.
