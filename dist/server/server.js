"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = __importDefault(require("socket.io"));
const port = process.env.port || 3000;
class App {
    constructor(port) {
        this.port = port;
        const app = (0, express_1.default)();
        app.use(express_1.default.static(path_1.default.join(__dirname, '../client')));
        app.use(express_1.default.static(path_1.default.join(__dirname, '../client/assets')));
        app.get('/', (req, res) => {
            res.sendFile(__dirname + '../client/index.html');
        });
        app.get('/login', (req, res) => {
            res.send('pagina di login');
        });
        this.server = new http_1.default.Server(app);
        this.io = new socket_io_1.default.Server(this.server);
        this.io.sockets.on('connection', (socket) => {
            console.log(`socket connesso ${socket.id}`);
            socket.on('disconnect', () => {
                console.log(`socket disconnesso id: ${socket.id}`);
                socket.broadcast.emit('deletePlayer', { id: socket.id });
            });
        });
        //mainLoop
    }
    Start() {
        this.server.listen(this.port, () => {
            console.log(`Server listening on port ${this.port}.`);
        });
    }
}
new App(port).Start();
//# sourceMappingURL=server.js.map