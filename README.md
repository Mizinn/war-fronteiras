# WAR Command

Estrutura profissional para um jogo de estratégia de navegador.

## Estrutura

- `client/` — interface publicada no GitHub Pages
- `client/css/` — estilos
- `client/js/` — lógica do navegador
- `client/assets/` — mapa e recursos
- `server/` — servidor WebSocket para salas e sincronização
- `shared/` — configurações compartilhadas

## GitHub Pages

O GitHub Pages deve apontar para a pasta `client/` (ou você pode copiar o conteúdo dela para a raiz do repositório).

## Multiplayer

O `server/` é separado porque GitHub Pages não executa Node.js. Para multiplayer real, publique o servidor WebSocket em um serviço que aceite Node.js e configure o cliente para conectar ao endereço `wss://...`.

## Rodar servidor local

```bash
cd server
npm install
npm start
```

O servidor abre por padrão na porta 8080.

## Próxima etapa

Conectar o cliente ao WebSocket e colocar o estado do jogo no servidor: turnos, territórios, tropas, ataques, missões, alianças privadas, chat e eventos de voz/WebRTC.
