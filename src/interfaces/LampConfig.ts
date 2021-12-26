export interface LampConfig {
    firstChannel: number;
    displayName?: string;
    type: string;
}

export interface LampConvict {
    [uid: string]: LampConfig;
}
