import {ChannelController} from "./ChannelController";
import {LampType} from "../interfaces/LampType";

export class Lamp {
    public get value(): number[] {
        return this._value;
    }

    public set value(value: number[]) {
        this._value = value;
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
