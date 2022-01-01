import * as io from "socket.io";
import {Server, Socket} from "socket.io";
import {DefaultEventsMap} from "socket.io/dist/typed-events";
import {ChannelController} from "./dmx/ChannelController";
import {TinkerforgeClass} from "./tinkerforge";
import * as http from "http";
import {LampGroup} from "./dmx/LampGroup";

type eventCallbackOverload = {
    (action: "singleLamp", values: { uid: string, values: number[] }): void;
    (action: "lampGroup", values: { uid: string, values: number[] }): void;
    (action: "blackout", values: boolean): void;
    (action: "master", values: number): void;
}

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

    connectionListener = (socket: Socket<DefaultEventsMap, DefaultEventsMap>) => {
        console.log("New Socket.io Connection");
        //send all config information to the client
        socket.emit("setup", Array.from(this.channelController.lampMap.values()), Array.from(LampGroup.LampGroupMap.values()));
        //listen to "dmx" messages
        socket.on('dmx', this.socketListenerDMX);
    };

    socketListenerDMX: eventCallbackOverload = (action, values) => {
        switch (action) {
            case "blackout":
                this.channelController.blackout = values;
                break;
            case "master":
                this.channelController.updateMaster(values);
                break;
            case "singleLamp":
                let lamp = this.channelController.getLampByUID(values.uid);
                if (lamp) lamp.value = values.values;
                break;
            case "lampGroup":
                let group = LampGroup.LampGroupMap.get(values.uid);
                if (group) group.setValue(values.values);
                break;
        }
        console.log(action, values, typeof action);
        this.server.sockets.emit("broadcast", action, values);
    };

    listen(port: number) {
        this.server.listen(port);
    }
}
