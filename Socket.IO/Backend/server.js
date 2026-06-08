import app from './src/app.js';
import {createServer} from 'http';
import {Server} from 'socket.io';

const httpServer=createServer(app);

const io =new Server(httpServer,{})
io.on("connection",(socket)=>{
    //...logic to handle the connection
    console.log('a user connected');
    socket.on("message",(message)=>{ //listen for the message event
        console.log("message received");//handle the message event
        console.log(message);//print the message
        io.emit("abc",message); //emit the message to all the connected clients using the abc event
    })
})
httpServer.listen(3000,()=>{
    console.log('Server is running on port 3000');
});

//socket.emit()->send message to the sender
//socket.broadcast.emit()->send message to all the connected clients except the sender
//io.emit()->send message to all the connected clients
