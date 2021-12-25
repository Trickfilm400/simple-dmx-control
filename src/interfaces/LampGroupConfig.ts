export interface LampGroupConfig {
    lamps: string[];
    displayName?: string
}

export interface LampGroupConvict {
    [groupName: string]: LampGroupConfig;
}
