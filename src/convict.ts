import * as convict from "convict";
import * as path from "path";
//todo in future=? // 	{blackout_enable (weather the blackout button shoulkd be visible) why???}

// Define a schema
const config = convict({
    env: {
        doc: 'The application environment.',
        format: ['production', 'development', 'test'],
        default: 'development',
        env: 'NODE_ENV'
    },
    tinkerforge: {
        host: {
            doc: 'The HOST address to connect TK to.',
            format: String,
            default: '127.0.0.1',
            env: 'TK_HOST'
        },
        port: {
            doc: 'The port to connect.',
            format: 'port',
            default: 4223,
            env: 'TK_PORT',
        },
        secret: {
            doc: "Tinkerforge auth secret",
            format: String,
            default: "",
            env: "TK_SECRET"
        }
    },
    lamps: {

    }
});


const env = config.get('env');
config.loadFile(path.join(__dirname, "..", "config", env + '.json'));

// Perform validation
config.validate({allowed: 'strict'});

export {
    config
}


// config dmx dingens:
//
// {
// 	tinkerforge_host
// 	tinerforge_port
// 	tinerforge_secret
//
// 	lampcount: array of dmx channels
//

//
// 	lamp_groups: {
// 	    array of lamp numbers (channels)
// }
// => lamp_groups: {"group A": [1, 2, 3]}
// }
