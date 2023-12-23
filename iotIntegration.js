const mqtt = require('mqtt');

module.exports = {
    controlDevice: function(mqttClient, data) {
        let topic = `home/device_control/${data.device}`;
        let message = JSON.stringify(data.command);
        mqttClient.publish(topic, message);
    },

    setupDeviceListeners: function(mqttClient, devices) {
        devices.forEach(device => {
            let topic = `home/device_status/${device}`;
            mqttClient.subscribe(topic);
        });
    },

    addDevice: function(mqttClient, device) {
        let topic = `home/device_status/${device}`;
        mqttClient.subscribe(topic);
    },

    removeDevice: function(mqttClient, device) {
        let topic = `home/device_status/${device}`;
        mqttClient.unsubscribe(topic);
    }
};
