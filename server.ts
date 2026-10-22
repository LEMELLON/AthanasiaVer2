import express, { Request, Response } from 'express';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { app, rooms, roomSockets } from './src/server/gameServer.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = http.createServer(app);
const PORT = Number(process.env.PORT) || 3000;

// Setup WebSocket Server for full-duplex persistent connections
const wss = new WebSocketServer({ server, path: '/ws' });

wss.on('connection', (ws: WebSocket, req: http.IncomingMessage) => {
  const urlParams = new URL(req.url || '', `http://${req.headers.host}`).searchParams;
  const roomCode = (urlParams.get('room') || '').toUpperCase();

  if (roomCode) {
    if (!roomSockets.has(roomCode)) {
      roomSockets.set(roomCode, new Set());
    }
    roomSockets.get(roomCode)!.add(ws);

    const room = rooms.get(roomCode);
    if (room) {
      ws.send(JSON.stringify({ type: 'ROOM_STATE_UPDATE', room }));
    }
  }

  ws.on('message', (message: string) => {
    try {
      const data = JSON.parse(message.toString());
      if (data.type === 'PING') {
        ws.send(JSON.stringify({ type: 'PONG' }));
      }
    } catch {}
  });

  ws.on('close', () => {
    if (roomCode && roomSockets.has(roomCode)) {
      roomSockets.get(roomCode)!.delete(ws);
    }
  });
});

// Vite Middleware for Dev Mode & Static Build Serving for Production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`[Athanasia Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('[Athanasia Server Error]', err);
});
