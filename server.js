const io = require('socket.io')(undefined,  {
  cors: {
    origin: '*',
  }
});
const Tinkerforge = require('tinkerforge');
let ready = false;

const HOST = '172.15.0.20';
const PORT = 4223;
const SECRET = "YkLnDCAgegPqszRH9DhqFCCbcXdZZ8TRgkWdwZmQNej5hfqjewMZufv3X6fa2AAE3brfFYnCDZJvLgPgLHTkMJfceSEzUVf7fv98e6KpKM84EGL9fRhCJ8ayxy5qN";

////////////////////////////////////////7
let channelvalues = [];
let master_multiplicator = 1;
let master_raw = 255;
let lampcount = 6;
let blackout = false;
const write_null_array = () => channelvalues = new Array(lampcount).fill(0);
write_null_array();
console.log(channelvalues);
function WRITE(x) {
    console.log(x);
    dmx.writeFrame(x);
}

//////////////////////////////////7777	
io.on('connection', function(socket) {
    console.log("New Connection");
    socket.emit("init", channelvalues, master_raw, blackout);

    socket.on('dmx', function(action, values) {
        console.log(action, values, typeof action);
        io.sockets.emit("broadcast", action, values);
			handler(action, values);
		});
        if (ready) {
            WRITE(channelvalues);
        }
    
});

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
function handler (lamp, value) {
	if (typeof lamp === "number") {
        if (!blackout) setlamp(lamp, value);
        else channelvalues[lamp] = value;
        //todo set lamp channel thing {}
    }
	else if (lamp=="blackout") 	{
        if (value) {
            WRITE(new Array(lampcount).fill(0));    
            blackout = true;
        } else {
             let temp_channel = [];
            channelvalues.forEach((e, i) => {
                temp_channel[i] = e * master_multiplicator;
            });
            WRITE(temp_channel);
            blackout = false;
        }
        
    } else if (lamp === "master") {
        let multiplicator = parseInt(value) / 255;
        master_raw = parseInt(value);
        master_multiplicator = multiplicator;
        let temp_channel = [];
        channelvalues.forEach((e, i) => {
            console.log("MASTER: ", e, master_multiplicator, e * master_multiplicator)
            temp_channel[i] = e * master_multiplicator;
        });
        if (!blackout) WRITE(temp_channel);    
    }
	
}

function setlamp(lamp, value) {
    
	channelvalues[lamp] = value;
    const z = [...channelvalues];
    z[lamp] = Math.floor(value * master_multiplicator);
    
	WRITE(z);
}
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////

let ipcon = new Tinkerforge.IPConnection(); // Create IP connection
let dmx = new Tinkerforge.BrickletDMX("EGm", ipcon);

// Connect to brickd
ipcon.connect(HOST, PORT,
    function (error) {
        console.log('Error: ' + error);
    }
);

ipcon.setAutoReconnect(false);

// Register Connected Callback
ipcon.on(Tinkerforge.IPConnection.CALLBACK_CONNECTED, function (connectReason) {

    switch(connectReason) {
        case Tinkerforge.IPConnection.CONNECT_REASON_REQUEST:
            console.log('Connected by request');
            break;
        case Tinkerforge.IPConnection.CONNECT_REASON_AUTO_RECONNECT:
            console.log('Auto-Reconnected');
            break;
    }
    ipcon.authenticate(SECRET,
        function() {
            console.log('Authentication succeeded');

            // ...reenable auto reconnect mechanism, as described above...
            ipcon.setAutoReconnect(true);

            // ...then trigger Enumerate
            ipcon.enumerate();

            // Configure Bricklet as DMX master
            dmx.setDMXMode(Tinkerforge.BrickletDMX.DMX_MODE_MASTER);

            dmx.setFrameDuration(40, function (bla) {
                console.log(bla)
            }, function (rtt) {
                console.log(rtt)
            });
            ready = true;
			////////////////7
			handler("dimmer", 255);
			handler("dimmer_mitte", 50);
			/////////////////////
			
        },
        function(error) {
            console.log('Could not authenticate: '+error);
        }
    );

});

// Register Enumerate Callback
ipcon.on(Tinkerforge.IPConnection.CALLBACK_ENUMERATE, function(uid, connectedUid, position, hardwareVersion, firmwareVersion, deviceIdentifier, enumerationType) {
    // Print incoming enumeration
    console.log('UID:               '+uid);
    console.log('Enumeration Type:  '+enumerationType);
    if(enumerationType === Tinkerforge.IPConnection.ENUMERATION_TYPE_DISCONNECTED) {
        console.log('');
        return;
    }
    console.log('Connected UID:     '+connectedUid);
    console.log('Position:          '+position);
    console.log('Hardware Version:  '+hardwareVersion);
    console.log('Firmware Version:  '+firmwareVersion);
    console.log('Device Identifier: '+deviceIdentifier + '\n\n\n');
});


io.listen(4224);

process.on('SIGINT', function(data) {
    ipcon.disconnect();
    process.exit(0);
});
