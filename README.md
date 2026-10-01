# WAR: FRONTEIRAS — Multiplayer

Protótipo jogável de um jogo de estratégia para PC inspirado nas mecânicas que você descreveu.

## O que já funciona

- Criar sala e gerar código.
- Amigos entram pelo código.
- Até 8 jogadores.
- Lobby com botão "Estou pronto".
- Distribuição aleatória de territórios.
- Cartas de território.
- Missões secretas individuais.
- Distribuição inicial de tropas.
- Turnos sincronizados pelo servidor.
- Reforços por quantidade de territórios.
- Bônus por continente.
- Ataque entre territórios vizinhos.
- Dados de ataque e defesa.
- Conquista de território.
- Recebimento de carta ao conquistar.
- Troca automática de 3 cartas por 5 tropas.
- Movimentação de tropas entre territórios aliados vizinhos.
- Exércitos, aviões e frotas.
- Ataque aéreo.
- Apoio naval.
- Sistema de alianças.
- Rompimento de alianças / traição.
- Eliminação de jogador.
- Vitória por missão.
- Log de acontecimentos.
- Servidor autoritativo: as jogadas importantes são validadas no servidor.

## Como executar

1. Instale Node.js.
2. Abra o terminal nesta pasta.
3. Rode:

npm install

4. Depois:

npm start

5. Abra no PC:

http://localhost:3000

Para jogar na mesma rede, os outros PCs podem acessar o IP local do computador que está rodando o servidor, por exemplo:

http://192.168.0.10:3000

Para jogar pela internet, o servidor precisa ser publicado em uma hospedagem que aceite Node.js/WebSocket.

## Observação

O mapa é uma versão original simplificada para o protótipo. As regras podem ser ajustadas no `server.js`.
