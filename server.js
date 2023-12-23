const express = require('express');
const bodyParser = require('body-parser');
const mqtt = require('mqtt');
const socketIo = require('socket.io');
const iotIntegration = require('./iotIntegration');
const aiModule = require('./aiModule');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname));

let mqttClient = mqtt.connect('mqtt://broker.hivemq.com');

mqttClient.on('connect', () => {
    console.log('Connected to MQTT Broker');
});

mqttClient.on('error', (err) => {
    console.log('Unable to connect to MQTT Broker', err);
});

let io = socketIo.listen(app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}));

io.sockets.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('device_control', (data) => {
        iotIntegration.controlDevice(mqttClient, data);
    });

    socket.on('voice_command', (command) => {
        aiModule.processVoiceCommand(mqttClient, command);
    });

    mqttClient.on('message', (topic, message) => {
        if (topic === 'home/energy_usage') {
            let energyData = JSON.parse(message.toString());
            let energySavingMeasures = aiModule.analyzeEnergyUsage(energyData);
            socket.emit('energy_saving_measures', energySavingMeasures);
        } else if (topic.startsWith('home/device_status/')) {
            socket.emit('device_status', {
                device: topic.split('/')[2],
                status: message.toString()
            });
        }
    });
});
