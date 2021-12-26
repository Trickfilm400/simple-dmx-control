import {ChannelController} from "../src/dmx/ChannelController";
import {Lamp} from "../src/dmx/Lamp";
import * as assert from "assert";
import {Init} from "../src/init";


describe('ChannelController', () => {
    let init: Init;
    let cc: ChannelController;
    let l1: Lamp;
    let l2: Lamp;
    let l3: Lamp;
    let l4: Lamp;
    let d1: Lamp;
    beforeEach(() => {
        cc = new ChannelController();
        init = new Init(cc);
        init.loadLampTypes();
        l1 = new Lamp(1, "l1", cc, init.lampTypes.get("genericDimmer"));
        l2 = new Lamp(2, "l2", cc, init.lampTypes.get("genericDimmer"));
        l3 = new Lamp(3, "l3", cc, init.lampTypes.get("genericRGB+Dimmer"));
        l4 = new Lamp(7, "l4", cc, init.lampTypes.get("genericRGB"));

        d1 = new Lamp(1, "d1", cc, init.lampTypes.get("genericRGB"));
    });
    it("should not allow duplicated first-channels", () => {
        cc.addLamp(l1);
        try {
            cc.addLamp(d1);
        } catch (e) {
            assert.deepStrictEqual(e, new Error("Lamp Channel already in use!"));
        }
    });
    describe("w/o lamps", () => {
        it("should return empty channel array w/o lamps w/o master", () => {
            let x = cc.generateChannelValues(false);
            assert.deepStrictEqual(x, []);
        });
        it("should return empty channel array w/o lamps w master", () => {
            let x = cc.generateChannelValues();
            assert.deepStrictEqual(x, []);
        });
        it("should return empty channel array w/o lamps w/0 master & w blackout", () => {
            cc.blackout = true;
            let x = cc.generateChannelValues(false);
            assert.deepStrictEqual(x, []);
        });
        it("should return empty channel array w/o lamps w master & w blackout", () => {
            cc.blackout = true;
            let x = cc.generateChannelValues();
            assert.deepStrictEqual(x, []);
        });
    });
    describe("w lamps", () => {
        beforeEach(() => {
            cc.addLamp(l1);
            cc.addLamp(l2);
            cc.addLamp(l3);
            cc.addLamp(l4);
        });
        it("should return empty channel array w lamps w/o master", () => {
            let x = cc.generateChannelValues(false);
            assert.deepStrictEqual(x, [0, 0, 0, 0, 0, 0, 0, 0, 0]);
        });
        it("should return empty channel array w lamps w master", () => {
            let x = cc.generateChannelValues(true);
            assert.deepStrictEqual(x, [0, 0, 0, 0, 0, 0, 0, 0, 0]);
        });
        it("should return empty channel array w lamps w/o master & w blackout", () => {
            cc.blackout = true;
            let x = cc.generateChannelValues(false);
            assert.deepStrictEqual(x, [0, 0, 0, 0, 0, 0, 0, 0, 0]);
        });
        it("should return empty channel array w lamps w master & w blackout", () => {
            cc.blackout = true;
            let x = cc.generateChannelValues(true);
            assert.deepStrictEqual(x, [0, 0, 0, 0, 0, 0, 0, 0, 0]);
        });
        describe("update lamps", () => {
            it("fetch lamp by uid", () => {
                assert.strictEqual(l1, cc.getLampByUID("l1"));
                assert.strictEqual(l2, cc.getLampByUID("l2"));
                assert.strictEqual(l3, cc.getLampByUID("l3"));
                assert.strictEqual(l4, cc.getLampByUID("l4"));
            });
            it("update single lamp channel", () => {
                l1.value = [255];
                let x = cc.generateChannelValues(true);
                assert.deepStrictEqual(x, [255, 0, 0, 0, 0, 0, 0, 0, 0]);
            });
            it("update lamp multi channel", () => {
                l4.value = [50, 50, 50];
                let x = cc.generateChannelValues(true);
                assert.deepStrictEqual(x, [0, 0, 0, 0, 0, 0, 50, 50, 50]);
            });
            it("update lamp multi channel in middle", () => {
                l3.value = [10, 20, 30, 40];
                let x = cc.generateChannelValues(true);
                assert.deepStrictEqual(x, [0, 0, 10, 20, 30, 40, 0, 0, 0]);
            });
            it("update master w/o lamps", () => {
                cc.updateMaster(100);
                let x = cc.generateChannelValues(true);
                assert.deepStrictEqual(x, [0, 0, 0, 0, 0, 0, 0, 0, 0]);
            });
            it("update master w lamps", () => {
                cc.updateMaster(100);
                l2.value = [200];
                let x = cc.generateChannelValues(true);
                assert.deepStrictEqual(x, [0, 78, 0, 0, 0, 0, 0, 0, 0]);
            });
        });
    });
});
