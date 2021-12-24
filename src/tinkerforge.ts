import * as Tinkerforge from "tinkerforge";


export class TinkerforgeClass {
    private readonly host: string;
    private readonly port: number;
    private readonly secret: string;
    private readonly dmx: Tinkerforge.BrickletDMX;
    private readonly ipcon: Tinkerforge.IPConnection;
    public ready = false;

    constructor(host: string, port: number, secret: string) {
        this.host = host;
        this.port = port;
        this.secret = secret;
        this.ipcon = new Tinkerforge.IPConnection(); // Create IP connection
        this.dmx = new Tinkerforge.BrickletDMX("EGm", this.ipcon);
    }

    public connect() {
        this.ipcon.connect(this.host, this.port, console.error);
        this.ipcon.setAutoReconnect(false);
        //region callbacks
        // Register Connected Callback
        this.ipcon.on(Tinkerforge.IPConnection.CALLBACK_CONNECTED,  (connectReason) => {
            switch (connectReason) {
                case Tinkerforge.IPConnection.CONNECT_REASON_REQUEST:
                    console.log('Connected by request');
                    break;
                case Tinkerforge.IPConnection.CONNECT_REASON_AUTO_RECONNECT:
                    console.log('Auto-Reconnected');
                    break;
            }
            this.ipcon.authenticate(this.secret, () => {
                    console.log('Authentication succeeded');
                    // ...reenable auto reconnect mechanism, as described above...
                    this.ipcon.setAutoReconnect(true);
                    // ...then trigger Enumerate
                    this.ipcon.enumerate();
                    // Configure Bricklet as DMX master
                    this.dmx.setDMXMode(Tinkerforge.BrickletDMX.DMX_MODE_MASTER);

                    this.dmx.setFrameDuration(40, function (bla) {
                        console.log(bla);
                    }, function (rtt) {
                        console.log(rtt);
                    });
                    this.ready = true;

                },
                function (error) {
                    console.log('Could not authenticate: ' + error);
                }
            );

        });

        // Register Enumerate Callback
        this.ipcon.on(Tinkerforge.IPConnection.CALLBACK_ENUMERATE, function (uid, connectedUid, position, hardwareVersion, firmwareVersion, deviceIdentifier, enumerationType) {
            // Print incoming enumeration
            console.log('UID:               ' + uid);
            console.log('Enumeration Type:  ' + enumerationType);
            if (enumerationType === Tinkerforge.IPConnection.ENUMERATION_TYPE_DISCONNECTED) {
                console.log('');
                return;
            }
            console.log('Connected UID:     ' + connectedUid);
            console.log('Position:          ' + position);
            console.log('Hardware Version:  ' + hardwareVersion);
            console.log('Firmware Version:  ' + firmwareVersion);
            console.log('Device Identifier: ' + deviceIdentifier + '\n\n\n');
        });
        //endregion
    }
    public disconnect() {
        return this.ipcon.disconnect();
    };
    public write(frame: number[]) {
        if (this.ready)
            return this.dmx.writeFrame(frame);
    }
}
