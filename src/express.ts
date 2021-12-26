import * as express from "express";
import * as http from "http";
import {config} from "./convict";
import * as cors from "cors";

export class WebServer {
    public httpServer: http.Server;
    private readonly app: express.Express;
    constructor() {
        this.app = express();
        this.httpServer = http.createServer(this.app);
        this.app.use(cors());
        this.app.use(express.static(__dirname + "/../"))
    }
    public listen() {
        this.httpServer.listen(config.get("port"))
    }
}
