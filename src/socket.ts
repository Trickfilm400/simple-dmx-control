import * as io from "socket.io";
import {Server, Socket} from "socket.io";
import {DefaultEventsMap} from "socket.io/dist/typed-events";
import {ChannelController} from "./dmx/ChannelController";
import {TinkerforgeClass} from "./tinkerforge";
import * as http from "http";
/**
const _io = require('socket.io')(undefined, {
    cors: {
        origin: '*'
    }
});

//////////////////////////////////7777
_io.on('connection', function (socket) {
    console.log("New Connection");
    //socket.emit("init", channelvalues, master_raw, blackout);

    socket.on('dmx', function (action, values) {
        console.log(action, values, typeof action);
        _io.sockets.emit("broadcast", action, values);
        //handler(action, values);
    });
    //if (ready) {
    //    WRITE(channelvalues);
    //}

});
**/

export class SocketServer {
    private server: Server<DefaultEventsMap, DefaultEventsMap>;
    private channelController: ChannelController;
    private tinkerforge: TinkerforgeClass;

    constructor(channelController: ChannelController, tinkerforge: TinkerforgeClass, webServer: http.Server) {
        this.channelController = channelController;
        this.tinkerforge = tinkerforge;
        this.server = new io.Server(webServer);
        this.server.on("connection", this.connectionListener);
    }

    connectionListener(socket: Socket<DefaultEventsMap, DefaultEventsMap>) {
        console.log("New Connection");
        //socket.emit("init", channelvalues, master_raw, blackout);

        socket.on('dmx', this.socketListenerDMX);
        //if (ready) {
        //    WRITE(channelvalues);
        //}
    }

    socketListenerDMX(action: "singleLamp" | "lampGroup" | "blackout" | "master", values: any) {
        switch (action) {
            case "blackout":
                this.channelController.blackout = values;
                break;
            case "master":
                this.channelController.updateMaster(values);
                break;
            case "singleLamp":
                let lamp = this.channelController.getLampByUID(values.uid);
                //todo update channel values
                if (lamp) lamp.value = values.values;
                //only write if blackout is disabled because it is pointless otherwise
                //if (!this.channelController.blackout)
                //    this.tinkerforge.write(this.channelController.getOriginalChannelArray());
                break;
            case "lampGroup":
                break;
        }
        console.log(action, values, typeof action);
        this.server.sockets.emit("broadcast", action, values);
        //handler(action, values);
    }

    listen(port: number) {
        this.server.listen(port);
    }
}
