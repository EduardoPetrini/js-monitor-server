import http from 'http';
import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { logger } from './logger.js';
import { Monitor } from './monitor.js';

const PORT = process.env.MONITOR_PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const monitor = new Monitor();

const app = express();
app.use(cors());
app.use(express.static(join(__dirname, '..', 'public')));

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, '..', 'public', 'index.html'));
});

const httpServer = http.createServer(app);

const io = new Server(httpServer);

httpServer.listen(PORT, () => {
  logger.info('Server has started on ' + PORT);
});

io.on('connection', socket => {
  logger.info(`Client connected ${socket.id}`);

  socket.on('disconnect', () => {
    logger.info(`Client disconnected ${socket.id}`);
  });
});

monitor.startMonitor();
monitor.on('update', data => io.emit('update', data));
