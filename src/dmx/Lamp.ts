import {ChannelController} from "./ChannelController";
import {LampType} from "../interfaces/LampType";

export class Lamp {
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

    public type: LampType;
    private _value: number[];
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
