import * as io from "socket.io";
import {Server, Socket} from "socket.io";
import {ChannelController} from "./dmx/ChannelController";
import {TinkerforgeClass} from "./tinkerforge";
import * as http from "http";
import {LampGroup} from "./dmx/LampGroup";
import {ClientToServerEvents, dmxEvent, LampGroups, LampSetup, ServerToClientEvents} from "./interfaces/SocketEvents";

export class SocketServer {
    private server: Server<ClientToServerEvents, ServerToClientEvents>;
    private channelController: ChannelController;
    private tinkerforge: TinkerforgeClass;

    constructor(channelController: ChannelController, tinkerforge: TinkerforgeClass, webServer: http.Server) {
        this.channelController = channelController;
        this.tinkerforge = tinkerforge;
        this.server = new io.Server<ClientToServerEvents, ServerToClientEvents>(webServer, {cors: {origin: "*"}});
        this.server.on("connection", this.connectionListener);
    }

    private lampMapToWebArray() {
        let x: LampSetup[] = [];
        this.channelController.lampMap.forEach(lamp => {
            x.push({
                uid: lamp.uid,
                type: lamp.type.title,
                values: lamp.getValues(),
                displayName: lamp.displayName
            });
        });
        return x;
    }

    private lampGroupMapToWebArray() {
        let x: LampGroups[] = [];
        LampGroup.LampGroupMap.forEach(lampGroup => {
            x.push({
                lampUIDs: lampGroup.lampUIDs,
                groupMaster: 0,
                displayName: lampGroup.displayName
            });
        });
        return x;
    }

    connectionListener = (socket: Socket<ClientToServerEvents, ServerToClientEvents>) => {
        console.log("New Socket.io Connection");
        //send all config information to the client
        socket.emit("setup", this.lampMapToWebArray(), this.lampGroupMapToWebArray());
        //listen to "dmx" messages
        socket.on('dmx', this.socketListenerDMX);
    };

    socketListenerDMX: dmxEvent = (action, values) => {
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
