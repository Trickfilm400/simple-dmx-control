import {LampConfig} from "../interfaces/LampConfig";
import {ChannelController} from "./ChannelController";

export class Lamp implements LampConfig {
    public get value(): number[] {
        return this._value;
    }
    public set value(value: number[]) {
        this._value = value;
        this.channelController.pendingUpdate = true;
    }
    private _value: number[];
    public readonly firstChannel;
    private channelController: ChannelController;
    public readonly channelCount;
    public readonly uid;
    public readonly displayName;
    constructor(firstChannel: number, uid: string, channelController: ChannelController, channelCount = 1, displayName?: string) {
        this.channelController = channelController;
        this._value = new Array(channelCount).fill(0);
        this.firstChannel = firstChannel;
        this.channelCount = channelCount;
        this.uid = uid;
        this.displayName = displayName || uid;
    }
}
