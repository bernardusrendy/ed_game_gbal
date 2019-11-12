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
            gen2.button=Number(message);
            break;
        case "2/limit_switch":
            gen2.limit_switch=Number(message);
            break;
        case "3/button":
            gen3.button=Number(message);
            break;
        case "3/limit_switch":
            gen3.limit_switch=Number(message);
            break;
        case "4/button":
            gen4.button=Number(message);
            break;
        case "4/limit_switch":
            gen4.limit_switch=Number(message);
            break;
        case "5/button":
            gen5.button=Number(message);
            break;
        case "5/limit_switch":
            gen5.limit_switch=Number(message);
            break;
        case "6/button":
            gen6.button=Number(message);
            break;
        case "6/limit_switch":
            gen6.limit_switch=Number(message);
            break;
        default:
    }
    supply=checkSupply(gen1.power,gen1.state)+checkSupply(gen2.power,gen2.state)+checkSupply(gen3.power,gen3.state)+checkSupply(gen4.power,gen4.state)+checkSupply(gen5.power,gen5.state)+checkSupply(gen6.power,gen6.state);
    console.log(supply);
})

// Message send
function serialOut(message){
  client.publish(message);
}

var id;
var temp;

function changeState(generator,state){
  id="state_"+generator.number.toString();
  if(generator.state="offline"&&state="transient"){
    id.removeClass("bg-secondary").addClass("bg-info");
  }
  else if(generator.state="offline"&&state="steady"){
    id.removeClass("bg-secondary").addClass("bg-primary");
  }
  else if(generator.state="transient"&&state="steady"){
    id.removeClass("bg-info").addClass("bg-primary");
  }
  else if(generator.state="transient"&&state="fail"){
    id.removeClass("bg-info").addClass("bg-warning");
  }
  else if(generator.state="steady"&&state="fail"){
    id.removeClass("bg-primary").addClass("bg-warning");
  }
  else if(generator.state="fail"&&state="offline"){
    id.removeClass("bg-warning").addClass("bg-secondary");
  }
  else if(generator.state="steady"&&state="lock"){
    id.removeClass("bg-primary").addClass("bg-success");
  }
  else if(generator.state="lock"&&state="offline"){
    id.removeClass("bg-success").addClass("bg-secondary");
  }
  generator.state=state;
  serialOut(generator.number.toString+"/state"+generator.state);
}

function changeDemand(number){
  demand=number;
  document.getElementById("demand").innerHTML = number;
  document.getElementById("demand_bar").style.width = (number*4/25).toString+"%";
}

function changeSupply(number){
  supply=number;
  document.getElementById("supply").innerHTML = number;
  document.getElementById("supply_bar").style.width = (number*4/25).toString+"%";
}

// // Game mechanism
// var lose=0;

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

<<<<<<< HEAD
// function inc_grid_phase(){
//   grid_phase++;
//   if (grid_phase>4){
//     grid_phase=1;
//   }
// }

// function grid(){
//   Countdown(1, inc_grid_phase()); 
// }

// function startGrid(){
//   Countdown(round_time, grid(), "grid_phase");
// }

// function startGame(){
//   console.log("Goodluck and Have Fun!");
//   Countdown(5,"precount");
//   while ((round_number<=10)&&(!lose)){
//     round(round_number);
//     // ubah power
//     // ubah fail_chance
//     round_number++;
//     Countdown(7,"precount");
//   }
// }

// function round(round_number){
//   // mulai grid_phase interval 
//   // ubah demand
//   // demand=
//   // cek perubahan state hingga timer selesai, selagi mengecek perubahan state, hitung skor
//   // tentukan apakah lanjut ke babak selanjutnya dengan variable lose
//   // matikan grid_phase interval
// }
=======
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
>>>>>>> fff2a7d5fad829ed8cfbf08c4b394736ae9e2573
