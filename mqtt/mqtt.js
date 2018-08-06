const mqtt = require('mqtt');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const { URL, USERNAME, PASSWORD } = process.env;
const port = process.env.PORT || 5001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

const client = mqtt.connect(URL, {
    username: USERNAME,
    password: PASSWORD
});

client.on('connect', () => {
    console.log('mqtt connected');
});

app.post('/send-command', (req,res) => {
    const {deviceId, command} = req.body;

    const topic = `/command/${deviceId}`;

    client.publish(topic, command, () => {
        res.send('published new message');
    });

    return res.send(`${command}`);
});

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});