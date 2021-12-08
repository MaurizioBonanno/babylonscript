import express from "express"
import path from "path"
import http from "http"
import socketIO from 'socket.io';

const port: any = process.env.port || 3000;

class App {
    private server: http.Server
    private port: number
    io: any;

    constructor(port: number) {
        this.port = port
        const app = express()
        app.use(express.static(path.join(__dirname, '../client')));
        app.use(express.static(path.join(__dirname, '../client/assets')))

        app.get('/',(req,res)=>{
            res.sendFile(__dirname+'../client/index.html');
        })
        app.get('/login',(req,res)=>{
            res.send('pagina di login');
        })

        this.server = new http.Server(app);
        this.io = new socketIO.Server(this.server);

        this.io.sockets.on('connection',(socket)=>{

            console.log(`socket connesso ${socket.id}`);

            socket.on('disconnect',()=>{
                console.log(`socket disconnesso id: ${socket.id}`);
                socket.broadcast.emit('deletePlayer',{ id: socket.id });
            })
        })

        //mainLoop
       
    }

    public Start() {
        this.server.listen(this.port, () => {
            console.log(`Server listening on port ${this.port}.`)
        })
    }
}

new App(port).Start()