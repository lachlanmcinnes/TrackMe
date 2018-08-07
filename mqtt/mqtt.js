const mqtt = require('mqtt');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const randomCoordinates = require('random-coordinates');
const randomInt = require('random-int');

mongoose.connect(process.env.MONGO_URL);

const Device = require('./models/device');

const app = express();

const { URL, USER, PASSWORD } = process.env;
const port = process.env.PORT || 5001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const client = mqtt.connect(URL, {
    username: USER,
    password: PASSWORD
});

client.on('connect', () => {
    console.log('mqtt connected');
    client.subscribe('/sensorData');
});

client.on('message', (topic, message) => {
    if (topic == '/sensorData') {
        const data = JSON.parse(message);
        
        Device.findOne({"name": data.deviceId}, (err, device) => {
            if (err) {
                console.log(err)
            }

            const {sensorData} = device;
            const { ts, loc, temp } = data;

            sensorData.push({ ts, loc, temp });
            device.sensorData = sensorData;

            device.save(err => {
                if (err){
                    console.log(err)
                }
            });
        });
    }
});

app.post('/send-command', (req, res) => {
    const { deviceId, command } = req.body;
    const topic = `/command/${deviceId}`;
    client.publish(topic, command, () => {
        res.send('published new message');
    });
});

app.put('/sensor-data', (req, res) => {
    const {deviceId} = req.body;

    const [lat, lon] = randomCoordinates().split(",");
    const ts = new Date().getTime();
    const loc = {lat, lon};
    const temp = randomInt(20,50);

    const topic = `/sensorData`;
    const message = JSON.stringify({ deviceId, ts, loc, temp });

    client.publish(topic, message, () => {
        res.send('published new message');
    });
});

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});
