# ED_GAME_GBAL
Educational game that simulates a centralized energy generation with its problem, mainly focuses in balancing demand and energy supplied
## About
The idea of generator balancing is a game to educate young teen to young adult about the process in large scale centralized
energy generation. The challenge is to balance the (supply) of the energy generation regarding the (demand).
the (offline) generator will need time to be turned on (transient time) to (steady state) and inserted to the grid (lock) with
correct phase.
sometimes it also fails (fail) and need to be restarted to transient time and to steady state once again.
The game will be divided into (10 rounds), with each demand gets higher and trickier number

## User Interface
User will interface input from (6 generators) each has (1 button) and (1 limit switch)
User will interface output from (1 monitor screen) for {(score), (demand), (supply), (grid_phase)} and , 
(6 LED strip in each generator) for indicating generator state, 
and (Light in Button in each generator)

## Classes and Objects
Therefore there will be:
1. 6 generators with 8 attributes, 2 behavior: 
		-attributes: 
			1. power: 1,3,5,7,10,12
			2. fail_chance: 0.1,0.2,0.3,0.4
			3. number: 1,2,3,4,5,6
			4. state: 0=="offline",1=="transient",2=="steady",3=="lock",4=="fail"
			5. button: 0,1
			6. limit_switch: 0,1
			7. pin_limit_switch: *IN ARDUINO*
			8. pin_button: *IN ARDUINO*
			9. transient_time: 
			10. pin_lights: *IN ARDUINO*
			11. time_turned_on:
		-behavior:
			1. lights(state)
			2. changeState(state)
			3. digitalIn(pin_limit_switch,pin_button)
2. 1 main_control with 4 attributes:
		-attributes: 
			1. score: (if abs(supply-demand)<=3, score=+10, else score=+10-abs(supply-demand))
			2. demand: 1 /*round1*/,3/*round2*/,5/*round3*/,7/*round4*/,10/*round5*/,np.round(np.rand(1)*10)/*round6*/,np.round(np.rand(1)*15)/*round7*/,np.round(np.rand(1)*20)/*round8*/,np.round(np.rand(1)*30)/*round9*/,np.round(np.rand(1)*38)/*round10*/
			3. supply: Sum(if generator::states=="lock") 
			4. grid_phase: 1,2,3,4 
			5. round_number:
			6. round_time:
		-behavior:
			1. next_round()
			2. start_game()

## Code Development
Code development is being done in javascript with serial communication to arduino nano in mainboard, taking input from generators and controlling actuators in generators.

CPP (arduino Mega):
	1. data acquisition:
		-button
		-limit_switch
	2. aktuator:
		-lights(state)
	3. SerialOut from laptop to update "state" in generators
	4. SerialIn to laptop to update "button" and "limit_switch" of generators object in javascript

HTML_CSS_JS (Laptop with external monitor):
	1. Tampilan
	2. Olahdata main_control

Protocol are adjusted for MQTT with structure:
	generator.number/attributes/value

Untested and Incomplete:
	1. SerialOut from Client to Serial Port to arduino
	2. StateChange Game mechanism with display
