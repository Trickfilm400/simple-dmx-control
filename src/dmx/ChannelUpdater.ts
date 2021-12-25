import {ChannelController} from "./ChannelController";
import {config} from "../convict";
import {TinkerforgeClass} from "../tinkerforge";

export class ChannelUpdater {
    private channelController: ChannelController;
    private interval;
    //in fps
    private readonly dmxFrameRate: number;
    //in seconds
    private readonly dmxPassiveUpdate: number;
    //internal interval counter
    private intervalCounter = 0;
    private tinkerForge: TinkerforgeClass;

    constructor(channelController: ChannelController, tinkerForge: TinkerforgeClass) {
        this.channelController = channelController;
        this.tinkerForge = tinkerForge;
        this.dmxFrameRate = config.get("dmx.framerate");
        this.dmxPassiveUpdate = config.get("dmx.passiveUpdate");
    }

    public startInterval() {
        this.interval = setInterval(this.intervalFn, 1 / this.dmxFrameRate*1000);
    }

    private intervalFn = () => {
        if (this.channelController.pendingUpdate || (this.intervalCounter %= (this.dmxFrameRate * this.dmxPassiveUpdate)) == 0) {
            let channelValues = this.channelController.generateChannelValues(true);
            //let x = ChannelUpdater.array_equals();
            this.tinkerForge.write(channelValues);
            this.intervalCounter = 0;
            this.channelController.pendingUpdate = false;
        }
        this.intervalCounter++;
    }

    static array_equals = (a, b) => a.every((v, i) => v === b[i]);
}
