const assert = require('assert');
const mqtt = require('mqtt');
const iotIntegration = require('./iotIntegration');
const aiModule = require('./aiModule');

describe('Smart Home Automation System', () => {
    let mqttClient;

    before(() => {
        mqttClient = mqtt.connect('mqtt://broker.hivemq.com');
    });

    after(() => {
        mqttClient.end();
    });

    describe('IoT Integration', () => {
        it('should control device', () => {
            let data = {
                device: 'lights',
                command: { state: 'on' }
            };

            mqttClient.on('message', (topic, message) => {
                if (topic === `home/device_control/${data.device}`) {
                    let receivedCommand = JSON.parse(message.toString());
                    assert.deepStrictEqual(receivedCommand, data.command);
                }
            });

            iotIntegration.controlDevice(mqttClient, data);
        });
    });

    describe('AI Module', () => {
        it('should process voice command', () => {
            let command = { audio: 'placeholder' };

            // Mock the Google Cloud Speech-to-Text client
            const client = {
                recognize: function(request) {
                    return Promise.resolve([{
                        results: [{
                            alternatives: [{ transcript: 'turn on the lights' }]
                        }]
                    }]);
                }
            };

            aiModule.processVoiceCommand(mqttClient, command, client);
        });

        it('should analyze energy usage', () => {
            let energyData = {
                totalUsage: 100,
                devices: {
                    lights: 50,
                    heater: 30,
                    tv: 20
                }
            };

            let measures = aiModule.analyzeEnergyUsage(energyData);
            assert.strictEqual(measures.suggestion, 'Turn off lights when not in use');
            assert.strictEqual(measures.potentialSavings, '10%');
        });
    });
});
