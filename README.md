# WAR — Estratégia Global

Versão web experimental feita em HTML, CSS e JavaScript.

## Como publicar no GitHub Pages
1. Crie/suba estes 3 arquivos no repositório: `index.html`, `style.css`, `app.js`.
2. No GitHub: Settings → Pages → Deploy from a branch → escolha a branch principal e `/root`.
3. Abra o endereço do GitHub Pages.
4. Um jogador cria a sala e compartilha o código.
5. Os demais colocam o mesmo código e entram.

## Importante
GitHub Pages hospeda os arquivos estáticos. A comunicação desta versão usa PeerJS/WebRTC para conectar os navegadores, portanto não há um servidor próprio de jogo dentro do GitHub.

## Estrutura
- index.html: telas, lobby, mapa e interface.
- style.css: visual responsivo.
- app.js: regras, mapa, estado da partida, salas P2P, chat e voz.

## Próximas melhorias
- mapa vetorial mais detalhado e linhas de conexão;
- distribuição de cartas e objetivos mais completa;
- sistema completo de cartas de território;
- IA para partida solo;
- animações de batalha mais elaboradas;
- validação de host e reconexão;
- sistema de aliança com confirmação bilateral;
- balanceamento definitivo das unidades especiais.
