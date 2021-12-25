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

    private masterMultiplicator = () => this.masterValue / 255;

    public addLamp(lamp: Lamp) {
        //check if dmx channel is already used
        if (this.channels[lamp.firstChannel] !== undefined) throw new Error("Lamp Channel already in use!");
        // values initially to zero
        this.channels.splice(lamp.firstChannel, lamp.channelCount, ...new Array(lamp.channelCount).fill(0)); //set dmx
        //save lamp in map
        this.lampMap.set(lamp.uid, lamp);
        //update blackout array so this array has not to be created every time new
        this.blackOutArray = new Array(this.channels.length).fill(0);
    }

    public setSingleLamp(lamp: Lamp) {
        //check if dmx channel exists
        if (this.channels[lamp.firstChannel] !== undefined) throw new Error("Lamp Channel not found!");
        this.channels.splice(lamp.firstChannel, lamp.channelCount, ...lamp.value); //set dmx value
    }

    public getLampByUID(uid: string) {
        return this.lampMap.get(uid);
    }

    public getOriginalChannelArray(): number[] {
        if (this.blackout)
            return this.blackOutArray;
        return this.channels;
    }

    public getPostMasterChannelArray(): number[] {
        if (this.blackout)
            return this.blackOutArray;
        return this.channelsWithMaster;
    }

    public updateMaster(val: number) {
        this.masterValue = val;
        this.channelsWithMaster = this.channels.map(a => a * this.masterMultiplicator());
    }
}
