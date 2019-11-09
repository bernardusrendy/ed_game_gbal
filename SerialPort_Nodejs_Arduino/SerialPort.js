//Local MQTT Protocol
const brokerAddress = 'localhost'
//var host = 'mqtt://192.168.43.106'
//var options = {retain: true}

var mqtt = require('mqtt')
var client = mqtt.connect('mqtt://'+brokerAddress)

const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const ports = new SerialPort('COM10', { baudRate: 9600 });
var serialOut;
const parser = ports.pipe(new Readline({ delimiter: '\n' }));

// Write Port to arduino
client.on('connect', function() {
    console.log('client connected at %s:%s',brokerAddress);
    client.subscribe('serialOut');
})

client.on('message', function(topic, message) { 
    //console.log('received message on %s: %s', topic, message)
    switch (topic) {
        case 'serialOut': serialOut=message; break;
    }
})

ports.write(serialOut+'\n', (err) => {
    if (err) {
      return console.log('Error on write: ', err.message);
    }
    console.log('message written');
  });

ports.on("open", () => {
  console.log('serial port open');
});

ports.write(serialOut+'\n', (err) => {
    if (err) {
      return console.log('Error on write: ', err.message);
    }
    console.log('message written');
  });

// Read Port from arduino
parser.on('data', data =>{
	client.publish('serialIn',data.toString(),{retain: true});
	console.log('got word from arduino:', data);	
});

