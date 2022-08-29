export interface LampType {
    title: string,
    flags: LampTypeFlags[],
    channel: string[]
}

export enum LampTypeFlags {
    DIMMER = "dimmer",
    RGB = "rgb"
}

export interface FlagValues {
    [LampTypeFlags.DIMMER]?: number[]
    [LampTypeFlags.RGB]?: [number, number, number][]
}
