// server.js
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import http from 'http';
import path from "path";

import { connectDB } from '../config/db.js';
import authRoutes from '../routes/auth.routes.js';
import messageRoutes from '../routes/message.routes.js';

import { initSocket } from '../config/socket.js'; // 🚀 new import

dotenv.config();
const app = express();
const server = http.createServer(app);
initSocket(server); // 💥 This replaces io/server logic in socket.js

const PORT = process.env.PORT;
const __dirname = path.resolve();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use('/auth', authRoutes);
app.use('/message', messageRoutes);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client', 'dist', 'index.html'));
  });
}

server.listen(PORT, () => {
  connectDB();
});
