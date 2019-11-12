// Local MQTT Protocol
const brokerAddress = 'localhost'
// var host = 'mqtt://192.168.43.106'
// var options = {retain: true}

var mqtt = require('mqtt')
var client = mqtt.connect('mqtt://'+brokerAddress)

var topic;
var temp;
// Serial
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const ports = new SerialPort('COM5', { baudRate: 9600 });
const parser = ports.pipe(new Readline({ delimiter: '\n' }));

// Write Port to arduino if there is incoming message in mqtt topic serialOut
client.on('connect', function() {
    console.log('client connected at %s:%s',brokerAddress);
    client.subscribe('1/state');
    client.subscribe('2/state');
    client.subscribe('3/state');
    client.subscribe('4/state');
    client.subscribe('5/state');
    client.subscribe('6/state');
})

function SerialWrite(serialOut){
  ports.write(serialOut+'\n', (err) => {
    if (err) {
      return console.log('Error on write: ', err.message);
    }
    console.log('message written');
  });
}

client.on('message', function(topic, message) { 
    //console.log('received message on %s: %s', topic, message)
    SerialWrite(topic+"/"+message);
})

ports.on("open", () => {
  console.log('serial port open');
});

// Read Port from arduino
parser.on('data', data =>{
  temp=data;
  topic=temp.split("/");
	client.publish(topic[0]+"/"+topic[1],topic[2].toString(),{retain: true});
	console.log('got word from arduino:', data);
});

