import 'dotenv/config';
import app from './src/app.js';
import connectDB from './src/config/database.js'
import { initSocket } from './src/sockets/server.socket.js';
import http from "http"

const httpServer=http.createServer(app)

initSocket(httpServer)

async function startServer() {
    try {
        await connectDB();
        httpServer.listen(3000, () => {
            console.log('Server is running on port 3000');
        });
        
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();
