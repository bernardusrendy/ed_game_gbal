// Game Variables
var id;
var supply=0;
var demand=0;
var score=0;
var grid_phase=0;
var duration=10000;
var game=0;
var grid_phase_duration = 500;

//Audio Files
var transientAu =new Audio(); transientAu.src = "/Audio/TransientFade.wav";
var steadyAu =new Audio(); steadyAu.src = "/Audio/steady.wav";
var lockAu =new Audio(); lockAu.src = "/Audio/Lock.wav";
var failAu =new Audio(); failAu.src = "/Audio/Fail.wav";
var fail2Au =new Audio(); fail2Au.src = "/Audio/Fail2.wav";
var offlineAu =new Audio(); offlineAu.src = "/Audio/Offline.wav";
var offline2Au =new Audio(); offline2Au.src = "/Audio/Offline2.wav";
var tickAu =new Audio(); tickAu.src = "/Audio/Tick.wav";
var tickUpAu =new Audio(); tickUpAu.src = "/Audio/TickUp.wav";
var humAu =new Audio(); humAu.src = "Hum.wav"; humAu.loop = true;

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
gen1 = new Generator(1,0.1,1,"offline",0,0,1000);
gen2 = new Generator(3,0.2,2,"offline",0,0,1000);
gen3 = new Generator(4,0.2,3,"offline",0,0,2000);
gen4 = new Generator(5,0.2,4,"offline",0,0,2000);
gen5 = new Generator(7,0.3,5,"offline",0,0,2000);
gen6 = new Generator(12,0.4,6,"offline",0,0,2000);

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
    }
    // console.log(supply);
})

// Message send
function serialOut(message){
  client.publish(message);
}

function changePower(generator,power){
  id="power_"+generator.number.toString();
  document.getElementById(id).innerHTML = power.toString();
}

function changeState(generator,state){
  id="#state_"+generator.number.toString();
  if(generator.state=="offline"){
    $(id).removeClass("bg-secondary");
  }
  else if(generator.state=="transient"){
    $(id).removeClass("bg-warning");
  }
  else if(generator.state=="steady"){
    $(id).removeClass("bg-primary");
  }
  else if(generator.state=="lock"){
    $(id).removeClass("bg-success");
  }
  else if(generator.state=="fail"){
    $(id).removeClass("bg-danger");
  }
  //=================
  if(state=="offline"){
    $(id).addClass("bg-secondary");
    transientAu.pause(); transientAu.currentTime = 0.0;
    if(generator.state=="lock"){offline2Au.play();}
    else {offlineAu.play();}
  }
  else if(state=="transient"){
    $(id).addClass("bg-warning");
    transientAu.play();
  }
  else if(state=="steady"){
    $(id).addClass("bg-primary");
    steadyAu.play();
  }
  else if(state=="lock"){
    $(id).addClass("bg-success");
    lockAu.play();
  }
  else if(state=="fail"){
    $(id).addClass("bg-danger");
    transientAu.pause(); transientAu.currentTime = 0.0;
    if(generator.state=="offline"){offlineAu.currentTime = 0.0; offlineAu.play();}
    else if(generator.state=="lock"){fail2Au.play();}
    else {failAu.play();}

  }
  generator.state=state;
  serialOut(generator.number.toString+"/state/"+generator.state);
  // console.log("perubahan warna");
}

function changeDemand(number){
  demand=number;
  document.getElementById("demand").innerHTML = number.toFixed(2).toString();
  document.getElementById("demand_bar").style.width = (number*4).toString()+"%";
}

function changeSupply(number){
  supply=number;
  document.getElementById("supply").innerHTML = number.toFixed(2).toString();
  document.getElementById("supply_bar").style.width = (number*4).toString()+"%";
}

function inc_grid_phase(){
  grid_phase++;
  if (grid_phase>4){
    grid_phase=1;
  }
  if(grid_phase==1){
    $("#gp-1").removeClass("bg-success").addClass("bg-warning");
    $("#gp-2").removeClass("bg-warning").addClass("bg-success");
    $("#gp-3").removeClass("bg-warning").addClass("bg-success");
    $("#gp-4").removeClass("bg-warning").addClass("bg-success");
    tickUpAu.play();
  }
  else if(grid_phase==2){
    $("#gp-2").removeClass("bg-success").addClass("bg-warning");
    $("#gp-1").removeClass("bg-warning").addClass("bg-success");
    $("#gp-3").removeClass("bg-warning").addClass("bg-success");
    $("#gp-4").removeClass("bg-warning").addClass("bg-success");
    tickAu.play();
  }
  else if(grid_phase==3){
    $("#gp-3").removeClass("bg-success").addClass("bg-warning");
    $("#gp-2").removeClass("bg-warning").addClass("bg-success");
    $("#gp-1").removeClass("bg-warning").addClass("bg-success");
    $("#gp-4").removeClass("bg-warning").addClass("bg-success");
    tickAu.play();
  }
  else if(grid_phase==4){
    $("#gp-4").removeClass("bg-success").addClass("bg-warning");
    $("#gp-2").removeClass("bg-warning").addClass("bg-success");
    $("#gp-3").removeClass("bg-warning").addClass("bg-success");
    $("#gp-1").removeClass("bg-warning").addClass("bg-success");
    tickAu.play();
  }
}

function generatorState(generator){
  switch(generator.state){
    case "offline":
      clearTimeout(timeout);
      if(generator.limit_switch&&generator.button){
        changeState(generator,"transient");
        var timeout=setTimeout(function(){
          if(generator.state= "transient"){
            changeState(generator,"steady");clearTimeout(timeout);
          }},generator.transient_time);
      }
      if(generator.limit_switch&&!generator.button){
        changeState(generator,"fail");
      }
      break;
    case "transient":
      if(!generator.limit_switch){
        changeState(generator,"offline");
        clearTimeout(timeout);
      }
      if(!generator.button){
        changeState(generator,"fail");
        clearTimeout(timeout);
      }
      break;
    case "steady":
      clearTimeout(timeout);
      if((generator.limit_switch&&!generator.button)&&(grid_phase==1)){
        changeState(generator,"lock");
        console.log("lock");
      }
      if(!generator.limit_switch){
        changeState(generator,"offline");
      }
      if ((!generator.button)&&(grid_phase==2||grid_phase==3||grid_phase==4)){
        changeState(generator,"fail");
        console.log("steady-fail-error");
      }
      break;
    case "lock":
      if(!generator.limit_switch){
        changeState(generator,"offline");
      }
      break;
    case "fail":
      if (!generator.limit_switch){
        changeState(generator,"offline");
      }
      break;
  }
}

function gridPhase(){
  var startTime = Date.now();
  var interval = setInterval(function() {
      var elapsedTime = Date.now() - startTime;
      var distance = grid_phase_duration - elapsedTime;
      if (distance <= 6) {
        startTime=Date.now();
        return inc_grid_phase();
      }
  },10);
}

function gameStart(){
  game=1;
}

//Countdown and game
function gameOver(){

}

// Timer countDown
function countDown(Duration, func, id){
  var startTime = Date.now();
  var interval = setInterval(function() {
      var elapsedTime = Date.now() - startTime;
      var distance = Duration - elapsedTime;
      document.getElementById(id).innerHTML = (distance / 1000).toFixed(2);
      if (distance <= 6) {
        clearInterval(interval);
        return func();
      }
  },10);
}

function checkGeneratorState(){
    var startTime = Date.now();
    var interval = setInterval(function() {
        var elapsedTime = Date.now() - startTime;
        var distance = 10 - elapsedTime;
        if (distance <= 6) {
          supply=checkSupply(gen1.power,gen1.state)+checkSupply(gen2.power,gen2.state)+checkSupply(gen3.power,gen3.state)+checkSupply(gen4.power,gen4.state)+checkSupply(gen5.power,gen5.state)+checkSupply(gen6.power,gen6.state);
          changeSupply(supply);
          startTime=Date.now();
          generatorState(gen1);
          generatorState(gen2);
          generatorState(gen3);
          generatorState(gen4);
          generatorState(gen5);
          generatorState(gen6);
        }
    },10);
}

if(game){
  // MAIN
  var duration=9000;
  countDown(duration,gameOver,"time");
  gridPhase();
  checkGeneratorState();
  var startTime1 = Date.now();
  var interval = setInterval(function() {
        var elapsedTime = Date.now() - startTime1;
        var distance = 5000 - elapsedTime;
        if (distance <= 6) {
          startTime1=Date.now();
          return changeDemand(Math.random()*25);
        }
    },10)
}
