import {Lamp} from "./Lamp";

export class ChannelController {
    public blackout = false;
    //array of raw dmx values
    protected channels: number[] = [];
    protected channelsWithMaster: number[] = [];
    private blackOutArray: number[] = [];
    protected lampMap: Map<string, Lamp> = new Map();
    //master value like a master fader of which every channel is affected
    private masterValue = 255;
    //if true, a dmx value was changed and needs to be written to the DMX adapter
    public pendingUpdate = true;

    private masterMultiplicator = () => this.masterValue / 255;

    public addLamp(lamp: Lamp) {
        //check if dmx channel is already used
        if (this.channels[lamp.firstChannel] !== undefined) throw new Error("Lamp Channel already in use!");
        //save lamp in map
        this.lampMap.set(lamp.uid, lamp);
        //update blackout array so this array has not to be created every time new
        this.blackOutArray.concat(lamp.value);
        //pending Update
        this.pendingUpdate = true;
    }

    public setSingleLamp(lamp: Lamp) {
        //check if dmx channel exists
        if (this.channels[lamp.firstChannel] !== undefined) throw new Error("Lamp Channel not found!");
        this.pendingUpdate = true;
    }

    public getLampByUID(uid: string) {
        return this.lampMap.get(uid);
    }

    public updateMaster(val: number) {
        this.masterValue = val;
    }

    public generateChannelValues(withMasterValue = true) {
        //check if blackout is enabled and return black
        if (this.blackout) return this.blackOutArray;
        //generate channelArray
        let channelArray: number[] = [];
        this.lampMap.forEach((lamp) => {
            channelArray.splice(lamp.firstChannel, lamp.channelCount, ...lamp.value);
        });
        //if wanted, map the masterFader value to the channels
        if (withMasterValue) {
            channelArray = channelArray.map(x => x * this.masterMultiplicator());
        }
        return channelArray;
    }
}
