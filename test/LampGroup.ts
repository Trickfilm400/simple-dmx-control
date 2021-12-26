import {Init} from "../src/init";
import {ChannelController} from "../src/dmx/ChannelController";
import {Lamp} from "../src/dmx/Lamp";
import {LampGroup} from "../src/dmx/LampGroup";
import * as assert from "assert";


describe('LampGroups', () => {
    let init: Init;
    let cc: ChannelController;
    let l1: Lamp;
    let l2: Lamp;
    let d1: Lamp;
    beforeEach(() => {
        cc = new ChannelController();
        init = new Init(cc);
        init.loadLampTypes();
        l1 = new Lamp(1, "l1", cc, init.lampTypes.get("genericRGB"));
        l2 = new Lamp(4, "l2", cc, init.lampTypes.get("genericDimmer"));

        d1 = new Lamp(5, "d1", cc, init.lampTypes.get("genericDimmer"));
        cc.addLamp(l1)
        cc.addLamp(l2)
        cc.addLamp(d1)
        LampGroup.LampGroupMap.clear();
        new LampGroup("g1", {lamps: ["l1", "l2", "lampNotExists"], displayName: "dpName"}, cc);
    });
    it("should update all lamps in group", () => {
        LampGroup.LampGroupMap.get("g1").setValue([255]);
        assert.deepStrictEqual(cc.generateChannelValues(), [255, 0, 0, 255, 0])
    });
    it("should update all lamps in group 2", () => {
        LampGroup.LampGroupMap.get("g1").setValue([255, 254]);
        assert.deepStrictEqual(cc.generateChannelValues(), [255, 254, 0, 254, 0])
    });

});
