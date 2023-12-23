// Importing socket.io client library
const socket = io();

// Selecting DOM elements
const deviceSelect = document.getElementById('device');
const commandInput = document.getElementById('command');
const deviceControlForm = document.getElementById('device-control-form');
const startRecordingButton = document.getElementById('start-recording');
const stopRecordingButton = document.getElementById('stop-recording');
const energyDataDiv = document.getElementById('energy-data');
const statusDataDiv = document.getElementById('status-data');

// Event listener for device control form submission
deviceControlForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const device = deviceSelect.value;
    const command = commandInput.value;
    socket.emit('device_control', { device, command });
    commandInput.value = '';
});

// Event listeners for voice command recording
startRecordingButton.addEventListener('click', () => {
    // Start recording voice command
    // This is a placeholder and would need to be replaced with your actual implementation
    console.log('Recording started');
    startRecordingButton.disabled = true;
    stopRecordingButton.disabled = false;
});

stopRecordingButton.addEventListener('click', () => {
    // Stop recording voice command and send it to the server
    // This is a placeholder and would need to be replaced with your actual implementation
    console.log('Recording stopped');
    startRecordingButton.disabled = false;
    stopRecordingButton.disabled = true;
    const command = { audio: 'placeholder' };
    socket.emit('voice_command', command);
});

// Socket event listeners
socket.on('energy_saving_measures', (measures) => {
    energyDataDiv.innerHTML = `<p>Suggestion: ${measures.suggestion}</p><p>Potential Savings: ${measures.potentialSavings}</p>`;
});

socket.on('device_status', (data) => {
    const statusDiv = document.getElementById(`status-${data.device}`);
    if (statusDiv) {
        statusDiv.innerHTML = `<p>Status: ${data.status}</p>`;
    } else {
        const newStatusDiv = document.createElement('div');
        newStatusDiv.id = `status-${data.device}`;
        newStatusDiv.innerHTML = `<h3>${data.device}</h3><p>Status: ${data.status}</p>`;
        statusDataDiv.appendChild(newStatusDiv);
    }
});
