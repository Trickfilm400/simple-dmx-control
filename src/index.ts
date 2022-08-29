import {SocketServer} from "./socket";
import {TinkerforgeClass} from "./tinkerforge";
import {ChannelController} from "./dmx/ChannelController";
import {config} from "./convict";
import {Init} from "./init";
import {ChannelUpdater} from "./dmx/ChannelUpdater";
import {WebServer} from "./express";

//create channelController
const channelController = new ChannelController();

//create the init Class and call the init function which load the setup data from the config files
const init = new Init(channelController);
init.setupLamps();
init.setupLampGroups();

//create the http WebServer for express and socket.io
const webServer = new WebServer();
webServer.listen();

//tinkerForge DMX Bricklet adapter
const tinkerForge = new TinkerforgeClass(config.get("tinkerforge.host"), config.get("tinkerforge.port"), config.get("tinkerforge.secret"));
//class which updates the DMX values of the DMX adapter
const channelUpdater = new ChannelUpdater(channelController, tinkerForge);
//socket.io Server
const socket = new SocketServer(channelController, tinkerForge, webServer.httpServer);

//start connections
tinkerForge.connect();
socket.listen(4224);
channelUpdater.startInterval();

//DEBUG ONLY
let z = channelController.getLampByUID("uid1").value = [9]
socket.socketListenerDMX("singleLamp", {uid: "uid1", values: {value: [9], type: "rgb", index: 1}});

process.on('SIGINT', () => {
    console.log("Ending...");
    tinkerForge.disconnect();
    process.exit(0);
});
