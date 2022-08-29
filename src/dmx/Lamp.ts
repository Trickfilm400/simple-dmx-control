import {ChannelController} from "./ChannelController";
import {FlagValues, LampType, LampTypeFlags} from "../interfaces/LampType";
import {singleLampValue} from "../interfaces/SocketEvents";

export class Lamp {
    public get flagValues(): FlagValues {
        return this._flagValues;
    }

    public set flagValues(value: FlagValues) {
        this._flagValues = {};
        this.channelController.pendingUpdate = true;
    }
    public get value(): number[] {
        return this._value;
    }

    public set value(value: number[]) {
        //if the value count does not match the supported channel count
        if (value.length !== this.type.channel.length) {
            //if more values than by lamp are supported, remove the last elements
            if (value.length > this.type.channel.length) {
                value = value.slice(this.type.channel.length, value.length);
            }
            //if values are missing, only change the start of the array and leave existing values
            this._value.splice(0, value.length, ...value);
        } else this._value = value;
        this.channelController.pendingUpdate = true;
    }

    public setValue(value: singleLampValue) {
        if (!this._flagValues[value?.type]) throw new Error("type is not existwer")
        if (!this._flagValues[value.type][value.index]) throw new Error("idnex is not existwer")
        if (typeof this._flagValues[value.type][value.index] !== typeof value.value) throw new Error("no same type")
        if (typeof this._flagValues[value.type][value.index] === "object" &&
        //@ts-ignore todo
            this._flagValues[value.type][value.index].length !== value.value.length) throw new Error("no same length")
        this._flagValues[value.type][value.index] = value.value;
    }

    public type: LampType;
    private _value: number[];
    private _flagValues: FlagValues = {
        dimmer: [2, 5, 6],
        //rgb: [56,56,56],
        rgb: [[56,56,56], [9, 9, 9]]
    }
    public getValues(): number[] {
        //map values to one array
        let values: number[] = [];
        this.type.channel.forEach((channelName) => {
            let [channel, number] = channelName.split("-");
            let index = parseInt(number) - 1 || 0;
            switch (channel) {
                case "red":
                    values.push(this._flagValues[LampTypeFlags.RGB][index][0]);
                    break;
                case "green":
                    values.push(this._flagValues[LampTypeFlags.RGB][index][1]);
                    break;
                case "blue":
                    values.push(this._flagValues[LampTypeFlags.RGB][index][2]);
                    break;
                case "dimmer":
                    values.push(this._flagValues[LampTypeFlags.DIMMER][index]);
                    break;
            }
        })
        return values;
    }
    public readonly firstChannel;
    private channelController: ChannelController;
    public readonly uid;
    public readonly displayName;

    constructor(firstChannel: number, uid: string, channelController: ChannelController, type: LampType, displayName?: string) {
        this.channelController = channelController;
        this._value = new Array(type.channel.length).fill(0);
        this.firstChannel = firstChannel;
        this.uid = uid;
        this.displayName = displayName || uid;
        this.type = type;
    }
}
