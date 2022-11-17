// const express = require('express');
// const cors = require('cors');
const IgniteClient = require('@gridgain/thin-client');
// const bodyParser = require('body-parser');

// const app = express();
// app.use(cors());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(require('body-parser').json());

const ENDPOINTS = ['114aba7b-cf77-4c37-922e-8782ef95bf7e.gridgain-nebula-test.com:10800'];
const HIDDEN_LOGIN = 'cluster-user';
const HIDDEN_PASSWORD = 'cluster-user';

const IgniteClientConfiguration = IgniteClient.IgniteClientConfiguration;
const ObjectType = IgniteClient.ObjectType;

const onStateChanged = (state, reason) => {
    if (state === IgniteClient.STATE.CONNECTED) {
        process.stdout.write('Client is started' + "\n");
    }
    else if (state === IgniteClient.STATE.CONNECTING) {
        process.stdout.write('Client is connecting' + "\n");
    }
    else if (state === IgniteClient.STATE.DISCONNECTED) {
        console.log('Client is stopped');
        if (reason) {
            process.stderr.write(reason + "\n");
        }
    }
}

const connectClient = async () => {
    
    const igniteClientConfiguration = new IgniteClientConfiguration(...ENDPOINTS).
        setUserName(HIDDEN_LOGIN).
        setPassword(HIDDEN_PASSWORD).
        setConnectionOptions(true);

    // Connect to the cluster.
    const igniteClient = new IgniteClient(onStateChanged);
    try {
        await igniteClient.connect(igniteClientConfiguration);
        const cache = (await igniteClient.getOrCreateCache('test')).
                    setKeyType(ObjectType.PRIMITIVE_TYPE.INTEGER);
        await cache.put(1, 'foo');
        const value = await cache.get(1);
        // console.log(value);
        // process.stdout.write('Client is connected' + "\n");
        // process.stdout.write(value + "\n");
        process.stderr.write(0);
    }
    catch (err) {
        console.log(err.message);
        process.stderr.write(err.message);
    }
    finally {
        igniteClient.disconnect();
    }
}

connectClient();