// Protocol used for serialIn:
// (button1,limit_switch1,button2,limit_switch2,
//  button3,limit_switch3,button4,limit_switch4,
//  button5,limit_switch5,button6,limit_switch6)
// Protocol used for serialOut:
// (state1,state2,state3,state4,state5,state6)



// Game Variables
var supply;
var demand;
var score;
var grid_phase;

// Class Declaration
class Generator {
  constructor(power,fail_chance,number,state,button,limit_switch) {
    this.power = power;
    this.fail_chance = fail_chance;
    this.number = number;
    this.state = state;
    this.button = button;
    this.limit_switch = limit_switch;
  }
}

class Main_Control{
  constructor(supply,demand,score,grid_phase){
    this.supply = supply;
    this.demand = demand;
    this.score = score;
    this.grid_phase = grid_phase;
  }
}

// Object Call
gen1 = new Generator(1,0.1,1,"offline",0,0);
gen2 = new Generator(3,0.2,2,"offline",0,0);
gen3 = new Generator(4,0.2,3,"offline",0,0);
gen4 = new Generator(5,0.2,4,"offline",0,0);
gen5 = new Generator(7,0.3,5,"offline",0,0);
gen6 = new Generator(12,0.4,6,"offline",0,0);

// Communication
var mqtt;
var reconnectTimeout = 2000;
var host = "localhost";
var port = 3000;

function checkSupply(power,state){
  if (power&&(state=="lock")){
    return power;
  }
  else {
    return 0;
  }
}

function convertState(int_state){
  if (int_state==0){
    return "offline"
  }
  if (int_state==1){
    return "transient"
  }
  if (int_state==2){
    return "steady"
  }
  if (int_state==3){
    return "lock"
  }
  if (int_state==4){
    return "fail"
  }
}

function onMessageArrived(msg) {
  // console.log(msg.destinationName);
  switch (msg.destinationName){
    case "serialIn":
      var sdata = msg.payloadString.split(",").map(Number);
      gen1.button=sdata[0];gen1.limit_switch=sdata[1];
      gen2.button=sdata[2];gen2.limit_switch=sdata[3];
      gen3.button=sdata[4];gen3.limit_switch=sdata[5];
      gen4.button=sdata[6];gen4.limit_switch=sdata[7];
      gen5.button=sdata[8];gen5.limit_switch=sdata[9];
      gen6.button=sdata[10];gen6.limit_switch=sdata[11];
      supply=checkSupply(gen1.power,gen1.state)+checkSupply(gen2.power,gen2.state)+checkSupply(gen3.power,gen3.state)+checkSupply(gen4.power,gen4.state)
              +checkSupply(gen5.power,gen5.state)+checkSupply(gen6.power,gen6.state);
      console.log(supply);
      break;
  } 
}

function onConnect() {
  // Once a connection has been made, make a subscription and send a message.
  console.log("Connected ");
  // Subscribe topic
  /// Bwt Grafik dan Gauge
  mqtt.subscribe("serialIn");
}

// Setup
function MQTTconnect() {
  console.log("connecting to " + host + " " + port);
  mqtt = new Paho.MQTT.Client(host, port, "clientjs");
  //document.write("connecting to "+ host);
  var options = {
    timeout: 3,
    onSuccess: onConnect,
    onFailure: onFailure
  };
  mqtt.onMessageArrived = onMessageArrived;
  mqtt.connect(options); //connect
}

// Biar connect MQTT terus
function onFailure(message) {
  console.log("Connection Attempt to Host " + host + "Failed");
  setTimeout(MQTTconnect, reconnectTimeout);
}

// called when the client loses its connection
function onConnectionLost(responseObject) {
 console.log('oow');
  if (responseObject.errorCode !== 0) {
    console.log("onConnectionLost:" + responseObject.errorMessage);
  }
}

MQTTconnect();


