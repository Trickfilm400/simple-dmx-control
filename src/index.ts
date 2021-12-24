import {SocketServer} from "./socket";
import {TinkerforgeClass} from "./tinkerforge";
import {ChannelController} from "./dmx/ChannelController";
import {config} from "./convict";

const channelController = new ChannelController();
const tinkerForge = new TinkerforgeClass(config.get("tinkerforge.host"), config.get("tinkerforge.port"), config.get("tinkerforge.secret"));

const socket = new SocketServer(channelController, tinkerForge);

socket.listen(4224);

process.on('SIGINT', () => {
    console.log("Ending...");
    tinkerForge.disconnect();
    process.exit(0);
});
