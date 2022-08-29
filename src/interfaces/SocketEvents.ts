import {FlagValues, LampType, LampTypeFlags} from "./LampType";

export interface singleLampValue {
    type: LampTypeFlags,
    index: number,
    value: any
}

export type dmxEvent = {
    (action: "singleLamp", values: { uid: string, values: singleLampValue }): void;
    (action: "lampGroup", values: { uid: string, values: number[] }): void;
    (action: "blackout", values: boolean): void;
    (action: "master", values: number): void;
}

export interface LampSetup {
    uid: string,
    displayName: string,
    //title for title and channel for the name of the channel, if there are up to 12 channel and so on
    type: Pick<LampType, "title" | "channel">,
    values: FlagValues;
    //values: {
    //    dimmer?: number,
    //    rgb: number[]
    //}
}

export interface LampGroups {
    lampUIDs: string[],
    displayName: string,
    groupMaster: number
}

/////////////////////////////////
export interface ServerToClientEvents {
    broadcast: dmxEvent;
    setup: (a: LampSetup[], b: LampGroups[]) => void;
}

export interface ClientToServerEvents {
    dmx: dmxEvent;
}
