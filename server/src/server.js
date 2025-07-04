import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import path from "path";
import { connectDB } from '../config/db.js'

import authRoutes from '../routes/auth.routes.js'
import messageRoutes from '../routes/message.routes.js'

import {app,server,io} from '../config/socket.js'
import { log } from 'console';

dotenv.config();
const PORT = process.env.PORT;
const __dirname = path.resolve();

app.use(express.json({limit: '50mb'}));
app.use(cookieParser());



app.use(express.urlencoded({ limit: '50mb', extended: true })) // Middleware to parse URL-encoded bodies
console.log("---error1---");

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true, 
})

);
console.log("---error2---");
app.use(express.urlencoded({ extended: true }));
console.log("---error3---");
app.use('/auth', authRoutes);
console.log("---error4---");
app.use('/message', messageRoutes);
console.log("---error5---");

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

