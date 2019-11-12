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

// Server and broker address
const brokerAddress = 'localhost'
const serverAddress = 'localhost'
const serverPort = 3000

// MQTT Setup
var client = mqtt.connect('ws:localhost:3000');

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

client.on('connect', function() {
    console.log('client connected at %s:%s',brokerAddress);
    client.subscribe('1/button');
    client.subscribe('1/limit_switch');
    client.subscribe('2/button');
    client.subscribe('2/limit_switch');
    client.subscribe('3/button');
    client.subscribe('3/limit_switch')
    client.subscribe('4/button');
    client.subscribe('4/limit_switch');
    client.subscribe('5/button');
    client.subscribe('5/limit_switch');
    client.subscribe('6/button');
    client.subscribe('6/limit_switch');
})

// Message Receive
client.on('message', function(topic, message) {
    //console.log('received message on %s: %s', topic, message)
    switch (topic) {
        case "1/button":
            gen1.button=Number(message);
            break;
        case "1/limit_switch":
            gen1.limit_switch=Number(message);
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
})
// Game mechanism
var lose=0;

// Countdown
function Countdown(Duration, func, id){
  var startTime = Date.now();
  var interval = setInterval(function() {
      var elapsedTime = Date.now() - startTime;
      var distance = Duration - elapsedTime;
      document.getElementById(id).innerHTML = (distance / 1000).toFixed(2);

      if (distance < 0) {
        clearInterval(x);
        return func();
  }, 10);
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
  // demand=
  // cek perubahan state hingga timer selesai, selagi mengecek perubahan state, hitung skor
  // tentukan apakah lanjut ke babak selanjutnya dengan variable lose
  // matikan grid_phase interval
}
