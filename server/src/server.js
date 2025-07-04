import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import path from "path";
import { connectDB } from '../config/db.js'

import authRoutes from '../routes/auth.routes.js'
import messageRoutes from '../routes/message.routes.js'

import {app,server,io} from '../config/socket.js'

dotenv.config();
const PORT = process.env.PORT;
const __dirname = path.resolve();

app.use(express.json({limit: '50mb'}));
app.use(cookieParser());



app.use(express.urlencoded({ limit: '50mb', extended: true })) // Middleware to parse URL-encoded bodies
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true, 
})
);
app.use(express.urlencoded({ extended: true }));

app.use('/auth', authRoutes);
app.use('/message', messageRoutes);

if(process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client','dist', 'index.html'));
    });
}

server.listen(PORT, () => {
    // console.log(`Server is running on http://localhost:${PORT}`)
    connectDB();
});

