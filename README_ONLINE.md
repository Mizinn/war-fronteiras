# WAR: Fronteiras — versão pronta para hospedagem online

## Como publicar no Render

1. Crie um repositório no GitHub e envie **todos os arquivos desta pasta**.
2. No Render, crie um **Web Service** conectado ao repositório.
3. Use:
   - Runtime: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Health Check Path: `/health`
4. Publique o serviço. O Render fornecerá uma URL `https://...`.
5. Abra essa URL. O jogo e o servidor multiplayer ficam no mesmo endereço, então não é preciso configurar outra URL de Socket.IO.
6. Crie uma sala e envie o código para seus amigos.

## Importante

- O projeto usa Express + Socket.IO e precisa de um serviço Node.js, não de hospedagem apenas estática.
- A aplicação lê a porta da variável `PORT` e escuta em `0.0.0.0`, como os hosts cloud exigem.
- `/health` existe para o monitoramento da hospedagem.
- O estado das salas fica em memória. Se o servidor reiniciar, as salas abertas são encerradas e precisam ser recriadas.
- Em planos gratuitos, o serviço pode ficar inativo quando não há acesso; o primeiro acesso pode demorar um pouco para acordá-lo.

## Railway

O mesmo projeto também pode ser publicado em um serviço Node.js da Railway. O comando de produção continua sendo `npm start`; a Railway fornece a porta por `PORT`.
