import {ChannelController} from "./dmx/ChannelController";
import {config} from "./convict";
import {LampConvict} from "./interfaces/LampConfig";
import {Lamp} from "./dmx/Lamp";
import {LampGroupConvict} from "./interfaces/LampGroupConfig";


export class Init {
    private readonly lampConfig: LampConvict;
    private readonly lampGroupConfig: LampGroupConvict;
    private channelController: ChannelController;

    constructor(channelController: ChannelController) {
        this.channelController = channelController;
        this.lampConfig = config.get("lamps");
        this.lampGroupConfig = config.get("lampGroups");
    }

    public setupLamps() {
        for (let lampUID in this.lampConfig) {
            let lampConfig = this.lampConfig[lampUID];
            let lamp = new Lamp(lampConfig.firstChannel, lampUID, lampConfig.channelCount, lampConfig.displayName);
            this.channelController.addLamp(lamp);
        }
        console.log(this.channelController);
    }

    public setupLampGroups() {
        for (let groupName in this.lampGroupConfig) {
        }
    }
}
