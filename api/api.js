const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.connect(process.env.MONGO_URL);

const Device = require('./models/device');
const User = require('./models/user');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());

app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/api/users', (req,res) => {
    User.find({}, (err, users) => {
        if (err ==true) {
            return res.send(err);
        }else{
            return res.send(users);
        }
    });
});

app.get('/api/devices', (req, res) => {
    Device.find({}, (err, devices) => {
        if (err == true) {
            return res.send(err);
        } else {
            return res.send(devices);
        }
    });
});

app.get('/api/devices/:deviceId/device-history', (req, res) => {
    const {deviceId} = req.params;
    Device.findOne({"_id":deviceId}, (err, devices) => {
        const {sensorData} =devices;
        return err
        ? res.send(err)
        : res.send(sensorData);
    });
});

app.get('/api/users/:user/devices', (req, res) => {
    const { user } = req.params;
    Device.find({"user": user }, (err, devices) => {
        return err
        ? res.send(err)
        : res.send(devices);
    });
});


app.post('/api/authenticate', (req, res) => {
    const {user, password} = req.body;

    User.findOne({user: user}, (err, user) => {
        if (err ==true) {
            return res.send(err);
        }else if (user == null) {
            return res.send('no users with that name');
        }else if (user.password != password) {
            return res.send('incorrect password used');
        }else{
            return res.json({
                success: true,
                message: 'Authenticated successfully',
                isAdmin: user.isAdmin
            });
        }
    });
});

app.post('/api/devices', (req, res) => {
    const {name, user, sensorData} = req.body;
    const newDevice = new Device({
        name,
        user,
        sensorData
    });
    newDevice.save(err => {
        return err
        ? res.send(err)
        :res.send('successfully added device and data');
    });
});

app.post('/api/register', (req, res) => {
    const {user, password, isAdmin} = req.body;
    const newUser = new User({
        user,
        password,
        isAdmin
    });
    
    User.findOne({user: user}, (err, users) =>{
        if (err==true){
            return res.send(err);
        }else if (users!=null){
            return res.send('User name is already in use');
        }else{
            newUser.save(err => {
                return err
                ? res.send(err)
                : res.json({
                    success: true,
                    message: 'Created new user'
                });
            });
        }
    });
});

app.get('/api/test',(requestAnimationFrame, res) => {
    res.send ('The API is working!');
});

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});

