export type dmxEvent = {
    (action: "singleLamp", values: { uid: string, values: number[] }): void;
    (action: "lampGroup", values: { uid: string, values: number[] }): void;
    (action: "blackout", values: boolean): void;
    (action: "master", values: number): void;
}

export interface LampSetup {
    uid: string ,
    displayName: string,
    type: string,
    values: {
        dimmer?: number,
        rgb: number[]
    }
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
    dmx: dmxEvent
}
