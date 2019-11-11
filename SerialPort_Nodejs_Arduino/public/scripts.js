// Game Variables
var supply;
var demand;
var score;
var grid_phase;

// Class Declaration
class Generator {
  constructor(power,fail_chance,number,state,button,limit_switch,transient_time,time_turned_on) {
    this.power = power;
    this.fail_chance = fail_chance;
    this.number = number;
    this.state = state;
    this.button = button;
    this.limit_switch = limit_switch;
    this.transient_time = transient_time;
    this.time_turned_on = time_turned_on;
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
gen1 = new Generator(1,0.1,1,"offline",0,0,1);
gen2 = new Generator(3,0.2,2,"offline",0,0,1);
gen3 = new Generator(4,0.2,3,"offline",0,0,2);
gen4 = new Generator(5,0.2,4,"offline",0,0,2);
gen5 = new Generator(7,0.3,5,"offline",0,0,3);
gen6 = new Generator(12,0.4,6,"offline",0,0,4);

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
    case "1/button":
        gen1.button=Number(msg.payloadString);
        break;
    case "1/limit_switch":
        gen1.limit_switch=Number(msg.payloadString);
        break;
    case "2/button":
        gen2.button=Number(msg.payloadString);
        break;
    case "2/limit_switch":
        gen2.limit_switch=Number(msg.payloadString);
        break;
    case "3/button":
        gen3.button=Number(msg.payloadString);
        break;
    case "3/limit_switch":
        gen3.limit_switch=Number(msg.payloadString);
        break;
    case "4/button":
        gen4.button=Number(msg.payloadString);
        break;
    case "4/limit_switch":
        gen4.limit_switch=Number(msg.payloadString);
        break;
    case "5/button":
        gen5.button=Number(msg.payloadString);
        break;
    case "5/limit_switch":
        gen5.limit_switch=Number(msg.payloadString);
        break;
    case "6/button":
        gen6.button=Number(msg.payloadString);
        break;
    case "6/limit_switch":
        gen6.limit_switch=Number(msg.payloadString);
        break;
    default:
  } 
  supply=checkSupply(gen1.power,gen1.state)+checkSupply(gen2.power,gen2.state)+checkSupply(gen3.power,gen3.state)+checkSupply(gen4.power,gen4.state)+checkSupply(gen5.power,gen5.state)+checkSupply(gen6.power,gen6.state);
  console.log(supply);
}

function onConnect() {
  // Once a connection has been made, make a subscription and send a message.
  console.log("Connected ");
  // Subscribe topic
  /// Bwt Grafik dan Gauge
  mqtt.subscribe("1/button");
  mqtt.subscribe("1/limit_switch");
  mqtt.subscribe("2/button");
  mqtt.subscribe("2/limit_switch");
  mqtt.subscribe("3/button");
  mqtt.subscribe("3/limit_switch");
  mqtt.subscribe("4/button");
  mqtt.subscribe("4/limit_switch");
  mqtt.subscribe("5/button");
  mqtt.subscribe("5/limit_switch");
  mqtt.subscribe("6/button");
  mqtt.subscribe("6/limit_switch");
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

// MQTT Reconnect
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

// Game mechanism
var lose=0;

// Countdown
function Countdown(Duration, func, Id){ 
  var countDownDate = new Date().getTime()+(Duration*1000);
  var x = setInterval(function(Duration, func, Id) {
    // Get today's date and time
    var now = new Date().getTime();

    // Find the distance between now and the count down date
    var distance = countDownDate - now;
    
    // Time calculations for days, hours, minutes and seconds
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Display the result in the element with id="demo"
    document.getElementById(Id).innerHTML = seconds;

    // If the count down is finished, write some text
    if (distance < 0) {
      clearInterval(x);
      return func();
    }
  }, 1000)
}

function inc_grid_phase(){
  grid_phase++;
  if (grid_phase>4){
    grid_phase=1;
  }
}

function grid(){
  Countdown(1, inc_grid_phase()); 
}

function startGrid(){
  Countdown(round_time, grid(), "grid_phase");
}

function startGame(){
  console.log("Goodluck and Have Fun!");
  Countdown(5,"precount");
  while ((round_number<=10)&&(!lose)){
    round(round_number);
    // ubah power
    // ubah fail_chance
    round_number++;
    Countdown(7,"precount");
  }
}

function round(round_number){
  // mulai grid_phase interval 
  // ubah demand
  demand=
  // cek perubahan state hingga timer selesai, selagi mengecek perubahan state, hitung skor
  // tentukan apakah lanjut ke babak selanjutnya dengan variable lose
  // matikan grid_phase interval
}
