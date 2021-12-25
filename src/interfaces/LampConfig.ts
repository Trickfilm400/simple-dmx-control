export interface LampConfig {
    firstChannel: number;
    channelCount: number;
    displayName?: string
}

export interface LampConvict {
    [uid: string]: LampConfig;
}
