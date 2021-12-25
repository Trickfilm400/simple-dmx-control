import {SocketServer} from "./socket";
import {TinkerforgeClass} from "./tinkerforge";
import {ChannelController} from "./dmx/ChannelController";
import {config} from "./convict";
import {Init} from "./init";
import {ChannelUpdater} from "./dmx/ChannelUpdater";

const channelController = new ChannelController();

const init = new Init(channelController);
init.setupLamps();
init.setupLampGroups();

const tinkerForge = new TinkerforgeClass(config.get("tinkerforge.host"), config.get("tinkerforge.port"), config.get("tinkerforge.secret"));
const channelUpdater = new ChannelUpdater(channelController, tinkerForge);
const socket = new SocketServer(channelController, tinkerForge);

tinkerForge.connect();
socket.listen(4224);
channelUpdater.startInterval();
let z = channelController.getLampByUID("uid1").value = [9]
socket.socketListenerDMX("singleLamp", {uid: "uid1", values: z});

process.on('SIGINT', () => {
    console.log("Ending...");
    tinkerForge.disconnect();
    process.exit(0);
});
