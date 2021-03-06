import {ChannelController} from "./dmx/ChannelController";
import {config} from "./convict";
import {LampConvict} from "./interfaces/LampConfig";
import {Lamp} from "./dmx/Lamp";
import {LampGroupConvict} from "./interfaces/LampGroupConfig";
import * as fs from "fs";
import * as path from "path";
import {LampType} from "./interfaces/LampType";
import {LampGroup} from "./dmx/LampGroup";

/**
 * @author Trickfilm400
 */
export class Init {
    private readonly lampConfig: LampConvict;
    private readonly lampGroupConfig: LampGroupConvict;
    private channelController: ChannelController;
    public lampTypes: Map<string, LampType>;

    constructor(channelController: ChannelController) {
        this.channelController = channelController;
        this.lampConfig = config.get("lamps");
        this.lampGroupConfig = config.get("lampGroups");
        this.loadLampTypes();
    }

    /**
     * Import Lamps from user specified config file
     * @return void
     * @version 1.0.0
     * @since 0.0.1
     */
    public setupLamps() {
        for (let lampUID in this.lampConfig) {
            let lampConfig = this.lampConfig[lampUID];
            let lamp = new Lamp(lampConfig.firstChannel, lampUID, this.channelController, this.lampTypes.get(lampConfig.type), lampConfig.displayName);
            this.channelController.addLamp(lamp);
        }
    }

    /**
     * Import LampGroups from user specified config file
     * @return void
     * @version 1.0.0
     * @since 0.0.1
     */
    public setupLampGroups() {
        for (let groupName in this.lampGroupConfig) {
            let groupConfig = this.lampGroupConfig[groupName];
            new LampGroup(groupName, groupConfig, this.channelController);
        }
    }

    /**
     * Import LampTypes from lampTypes folder
     * @return lampTypes
     * @version 1.0.0
     * @since 0.0.1
     */
    public loadLampTypes() {
        let files = fs.readdirSync(path.join(__dirname, "..", "lampTypes"));
        let lampTypes: Map<string, LampType> = new Map<string, LampType>();
        files.forEach(fileName => {
            let content = fs.readFileSync(path.join(__dirname, "..", "lampTypes", fileName)).toString();
            try {
                let json = JSON.parse(content);
                //split => only the filename before the dot
                lampTypes.set(fileName.split(".")[0], json);
            } catch (e) {
                console.error(e);
            }
        });
        //console.log(lampTypes);
        this.lampTypes = lampTypes;
        return lampTypes;
    }
}
