// *************************************************************************AUDIO FILES****************************************************** //
var transientAu =new Audio(); transientAu.src = "/Audio/TransientFade.wav";
var steadyAu =new Audio(); steadyAu.src = "/Audio/steady.wav";
var lockAu =new Audio(); lockAu.src = "/Audio/Lock.wav";
var failAu =new Audio(); failAu.src = "/Audio/Fail.wav";
var fail2Au =new Audio(); fail2Au.src = "/Audio/Fail2.wav";
var offlineAu =new Audio(); offlineAu.src = "/Audio/Offline.wav";
var offline2Au =new Audio(); offline2Au.src = "/Audio/Offline2.wav";
var tickAu =new Audio(); tickAu.src = "/Audio/Tick.wav";
var tickUpAu =new Audio(); tickUpAu.src = "/Audio/TickUp.wav";
var threeTwoOneAu =new Audio(); threeTwoOneAu.src = "/Audio/321.wav"; threeTwoOneAu.loop = true;
var humAu =new Audio(); humAu.src = "/Audio/Hum.wav"; humAu.loop = true;
var heartBeatAu =new Audio(); heartBeatAu.src = "/Audio/Heartbeat.mp3"; heartBeatAu.loop = true;

// ***********************************************************************OBJECT ORIENTED DECLARATION**************************************************** //

// Class Declaration
class Generator {
  constructor(power,fail_chance,number,transient_time,state,button,limit_switch) {
    this.power = power;
    this.fail_chance = fail_chance;
    this.number = number;
    this.state = state;
    this.button = button;
    this.limit_switch = limit_switch;
    this.transient_time = transient_time;
    this.state = "offline";
  }
}

// Object Call
gen1 = new Generator(1,0.1,1,1000,"offline");
gen2 = new Generator(3,0.2,2,1000,"offline");
gen3 = new Generator(4,0.2,3,2000,"offline");
gen4 = new Generator(5,0.2,4,2000,"offline");
gen5 = new Generator(7,0.3,5,2000,"offline");
gen6 = new Generator(12,0.4,6,2000,"offline");

// ***********************************************************************MQTT AND SERIAL COMMUNICATION PERIPHERALS**************************************************** //

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
})

// Message send
function serialOut(message){
  client.publish(message);
}


// ***********************************************************************CHANGES EXECUTOR TO HTML AND VARIABLE VALUE**************************************************** //

function changePower(generator,power){
  id="power_"+generator.number.toString();
  generator.power=power;
  document.getElementById(id).innerHTML = generator.power.toString();
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

function gameStart(){
  game=1;
  console.log("Game Started");
}

function gameOver(){
  game=-1;
  console.log("Game Stopped");
}

function randomPower(generator,floor,range){
  changePower(generator,floor+Math.floor(Math.random()*range));
}

function randomDemand(minimumOn){
  powerArray=[gen1.power,gen2.power,gen3.power,gen4.power,gen5.power,gen6.power];
  totalDemand=0;
  do{
    on=0;
    for (i=0;i<6;i++){
      randomizerArray[i]=Math.round(Math.random());
    }
    for (i=0;i<6;i++){
      if(randomizerArray[i]==1){
        on++;
      }
    }
  }
  while (on<minimumOn);
  for (i=0;i<6;i++){
    if(randomizerArray[i]==1){
      totalDemand=totalDemand+powerArray[i];
    }
  }
  changeDemand(totalDemand);
}

function round(minimumOn,duration){
  gridPhase();
  clearInterval(intervalCount);
  randomPower(gen1,3,4);
  randomPower(gen2,5,4);
  randomPower(gen3,5,4);
  randomPower(gen4,7,2);
  randomPower(gen5,9,2);
  randomPower(gen6,11,2);
  randomDemand(minimumOn);
  countDown(duration+3000*on,gameOver,"time");
}

// ***********************************************************************HTML EVENT HANDLER**************************************************** //

document.getElementById("mulai").onclick = function gameOverClicked(){
  gameStart();
}

document.getElementById("stop").onclick = function gameOverClicked(){
  gameOver();
}

function gameOverModal(win,roundNumber){
  $('#gameOverModal').modal('show');
  if (win==1){
    document.getElementById("winModal").innerHTML = "Selamat Anda Berhasil Menyediakan Energi Untuk Indonesia!!!";
    document.getElementById("roundResultModal").innerHTML = roundNumber;
  }
  else {
    document.getElementById("winModal").innerHTML = "\"Jangan Pernah Menyerah, Kegigihan Selalu Membuahkan Hasil!\" - Petuah Bijak";
    document.getElementById("roundResultModal").innerHTML = roundNumber-1;
  }
}

// ***********************************************************************INTERVAL THREADS**************************************************** //

// Transition Counter Interval
function transitionCounter(duration){
  var startTime = Date.now();
  intervalModalCounter = setInterval(function() {
      var elapsedTime = Date.now() - startTime;
      var distance = duration - elapsedTime;
      document.getElementById("modalCounter").innerHTML = Math.ceil(distance / 1000);
      if (distance <= 6) {
        document.getElementById("modalCounter").innerHTML = 0;
        clearInterval(intervalModalCounter);
        }
      },10);
}

// Transition Modal Interval
function transitionModal(duration){
  roundNumber++;
  threeTwoOneAu.play();
  // checkRound();
  $('#transitionModal').modal('show');
  document.getElementById("transitionModalRoundNumber").innerHTML = roundNumber;
  clearInterval(intervalGrid);
  $("#gp-1").removeClass("bg-success").addClass("bg-warning");
  $("#gp-2").removeClass("bg-warning").addClass("bg-success");
  $("#gp-3").removeClass("bg-warning").addClass("bg-success");
  $("#gp-4").removeClass("bg-warning").addClass("bg-success");
  grid_phase=1;
  var startTime = Date.now();
  intervalModal = setInterval(function() {
      var elapsedTime = Date.now() - startTime;
      var distance = duration - elapsedTime;
      if (distance <= 6) {
        $('#transitionModal').modal('hide');
        clearInterval(intervalModal);
        game=2;
        threeTwoOneAu.pause();
        }
      },10);
}

// CheckRound interval check
function checkRound(){
  var startTime = Date.now();
  intervalCheckRound = setInterval(function() {
      var elapsedTime = Date.now() - startTime;
      var distance = 30 - elapsedTime;
      if (distance <= 6) {
        startTime=Date.now();
        if((demand==supply)&&(roundNumber!=5)&&(supply!=0)){
          clearInterval(intervalCheckRound);
          transitionModal(3000);
          transitionCounter(3000);
          console.log("next round");
        }
        else if ((demand==supply)&&(roundNumber==5)&&(supply!=0)){
          clearInterval(intervalCheckRound);
          win=1;
          game=-1;
          console.log("You Win");
        }
      }
  },10);
}

// gridPhase interval change
function gridPhase(){
  var startTime = Date.now();
  intervalGrid = setInterval(function() {
      var elapsedTime = Date.now() - startTime;
      var distance = grid_phase_duration - elapsedTime;
      if (distance <= 6) {
        startTime=Date.now();
        return inc_grid_phase();
      }
  },10);
}

// Timer countDown interval
function countDown(duration, func, id){
  heartBeatAu.currentTime = 10.0;
  heartBeatAu.play();
  var startTime = Date.now();
  intervalCount = setInterval(function() {
      var elapsedTime = Date.now() - startTime;
      var distance = duration - elapsedTime;
      document.getElementById(id).innerHTML = (distance / 1000).toFixed(2);
      if (distance <= 10) {
        clearInterval(intervalCount);
        heartBeatAu.pause();
        return func();
      }
      if (distance <= 5000) {
        heartBeatAu.playbackRate=2.0;
<<<<<<< Updated upstream
        heartBeatAu.volume=0.5;
=======
>>>>>>> Stashed changes
      }
  },5);
}

// CheckGeneratorState interval to change generator state
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

// ***********************************************************************MICROCONTROLLER-LIKE PROCEDURAL**************************************************** //

// Game Variables
var id;
var supply=0;
var demand=0;
var score=0;
var grid_phase=1;
var game=0;
var grid_phase_duration = 500;
var roundNumber=0; // roundNumber==0 means the game is on idle event handling
var win=0;
var randomizerArray=[0,0,0,0,0,0];
var on=0;
var i=0;
var totalDemand=0;
var powerArray=[gen1.power,gen2.power,gen3.power,gen4.power,gen5.power,gen6.power];

// Interval Purpose Global Variables
var intervalCount;
var intervalGrid;
var intervalCheckRound;
var intervalModal;
var intervalModalCounter;

// Microcontroller like setup and loop
var startTime = Date.now();
var interval = setInterval(function() {
      var elapsedTime = Date.now() - startTime;
      var distance = 30- elapsedTime;
      if (distance <= 6) {
        startTime=Date.now();
        return loop();
      }
  },10)
checkGeneratorState();

function loop(){
  // game==0 means the game is on idle event handling, no loop will be executed (reduces program's load)
  // game==1 means event handler senses Game Started
  if(game==1){
    // Reset
    document.getElementById("time").innerHTML = "0.00";
    roundNumber=0;
    clearInterval(intervalGrid);
    clearInterval(intervalCount);
    clearInterval(intervalCheckRound);
    clearInterval(intervalModalCounter);
    clearInterval(intervalModal);
    grid_phase=1;
    $("#gp-1").removeClass("bg-success").addClass("bg-warning");
    $("#gp-2").removeClass("bg-warning").addClass("bg-success");
    $("#gp-3").removeClass("bg-warning").addClass("bg-success");
    $("#gp-4").removeClass("bg-warning").addClass("bg-success");
    win=0;
    game=0;
    transitionModal(3000);
    transitionCounter(3000);
  }
  // game==2 means event handler senses Round Changes after interval modal done
  else if(game==2){
    game=0;
    document.getElementById("roundNumber").innerHTML = roundNumber.toString();
    if (roundNumber==1){
      round(1,13000);
    }
    else if (roundNumber==2){
      round(2,12000);
    }
    else if (roundNumber==3){
      round(3,11000);
    }
    else if (roundNumber==4){
      round(3,10000);
    }
    else if (roundNumber==5){
      round(3,9000);
    }
  }
  // game==-1 means event handler senses Game Stopped
  else if (game==-1){
    game=0;
    // Show modal of result (win or lose at what round)
    gameOverModal(win,roundNumber);
    // Reset everything
    document.getElementById("time").innerHTML = "0.00";
    roundNumber=0;
    clearInterval(intervalGrid);
    clearInterval(intervalCount);
    clearInterval(intervalCheckRound);
    clearInterval(intervalModalCounter);
    clearInterval(intervalModal);
    grid_phase=1;
    $("#gp-1").removeClass("bg-success").addClass("bg-warning");
    $("#gp-2").removeClass("bg-warning").addClass("bg-success");
    $("#gp-3").removeClass("bg-warning").addClass("bg-success");
    $("#gp-4").removeClass("bg-warning").addClass("bg-success");
    win=0;
  }
}
// SOUND EFFECT + BACKGROUND SOUND EFFECT
