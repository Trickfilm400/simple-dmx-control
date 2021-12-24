export class Lamp {
    public value;
    public readonly firstChannel;
    public readonly channelCount;
    public readonly uid;
    public readonly displayName;
    constructor(firstChannel: number, uid: string, channelCount = 1, displayName?: string) {
        this.value = 0;
        this.firstChannel = firstChannel;
        this.channelCount = channelCount;
        this.uid = uid;
        this.displayName = displayName || uid;
    }
}
