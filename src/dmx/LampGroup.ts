import {ChannelController} from "./ChannelController";
import {Lamp} from "./Lamp";
import {LampGroupConfig} from "../interfaces/LampGroupConfig";
//todo group master
export class LampGroup {
    public lampUIDs: string[];
    private lamps: Lamp[] = [];
    private channelController: ChannelController;
    static LampGroupMap: Map<string, LampGroup> = new Map();
    public displayName: string;
    constructor(groupName: string, groupConfig: LampGroupConfig, channelController: ChannelController) {
        this.lampUIDs = groupConfig.lamps;
        this.displayName = groupConfig.displayName;
        this.channelController = channelController;
        this.lampUIDs.forEach(lampUID => {
            //check if lamp exists
            if (this.channelController.lampMap.get(lampUID))
                this.lamps.push(this.channelController.lampMap.get(lampUID));
        });
        LampGroup.LampGroupMap.set(groupName, this);
    }

    setValue(value: number[]) {
        this.lamps.forEach(lamp => {
            lamp.value = value;
        });
    }
}
