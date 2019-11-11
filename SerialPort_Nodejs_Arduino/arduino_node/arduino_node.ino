#include "FastLED.h"

#define NUM_LEDS             9 //LED Amount per Generator
#define BRIGHTNESS          96
#define FRAMES_PER_SECOND  120

#define pin_button1 53
#define pin_limit_switch1 52
#define pin_lights1 A0
#define pin_button2 51
#define pin_limit_switch2 50
#define pin_lights2 A2
#define pin_button3 49
#define pin_limit_switch3 48
#define pin_lights3 A3
#define pin_button4 47
#define pin_limit_switch4 46
#define pin_lights4 A4
#define pin_button5 45
#define pin_limit_switch5 44
#define pin_lights5 A5
#define pin_button6 43
#define pin_limit_switch6 42
#define pin_lights6 A6

#define DATA_MAX_SIZE 9

// Class Declaration
struct Generator {
  int number;
  int button;
  int limit_switch;
  int pin_button;
  int pin_limit_switch;
  String state;
  int pin_lights;
  CRGB led_array[NUM_LEDS];
};

// Object Call
Generator gen1 = {1,0,0,pin_button1,pin_limit_switch1,"offline",pin_lights1};
Generator gen2 = {2,0,0,pin_button2,pin_limit_switch2,"offline",pin_lights2};
Generator gen3 = {3,0,0,pin_button3,pin_limit_switch3,"offline",pin_lights3};
Generator gen4 = {4,0,0,pin_button4,pin_limit_switch4,"offline",pin_lights4};
Generator gen5 = {5,0,0,pin_button5,pin_limit_switch5,"offline",pin_lights5};
Generator gen6 = {6,0,0,pin_button6,pin_limit_switch6,"offline",pin_lights6};

// FastLED custom light
uint8_t gHue = 0;
void sinelon(CRGB *leds)
{
  // a colored dot sweeping back and forth, with fading trails
  fadeToBlackBy( leds, NUM_LEDS, 20);
  int pos = beatsin16(13,0,NUM_LEDS);
  leds[pos] += CHSV( gHue, 255, 192);
}

// Output Lights Actuator
void lights(Generator generator){
  if (generator.state=="offline"){
    for(int i=0; i<NUM_LEDS; i++){
      generator.led_array[i]=CRGB::Black;
    }
    FastLED.show();
  }
  else if (generator.state=="transient"){
    sinelon(generator.led_array);
    FastLED.show();
  }
  else if (generator.state=="steady"){
    for(int i=0; i<NUM_LEDS; i++){
      generator.led_array[i]=CRGB::Blue;
    }
    FastLED.show();
  }
  else if (generator.state=="lock"){
    for(int i=0; i<NUM_LEDS; i++){
      generator.led_array[i]=CRGB::Green;
    }
    FastLED.show();
  }
  else if (generator.state=="fail"){
    for(int i=0; i<NUM_LEDS; i++){
      generator.led_array[i]=CRGB::Red;
    }
    FastLED.show();
  }
}

// Communication Serial Output to Arduino from Main_Control
char data[9];
String serialOut;

void receiveData() {
  static char endMarker = '\n'; // message separator
  char receivedChar;     // read char from serial port
  int ndx = 0;          // current index of data buffer
  // clean data buffer
  memset(data, 32, sizeof(data));
  // read while we have data available and we are
  // still receiving the same message.
  while (Serial.available() > 0) {
    receivedChar = Serial.read();
    if (receivedChar == endMarker) {
      data[ndx] = '\0'; // end current message
      return;
    }
    // looks like a valid message char, so append it and
    // increment our index
    data[ndx] = receivedChar;
    ndx++;
    // if the message is larger than our max size then
    // stop receiving and clear the data buffer. this will
    // most likely cause the next part of the message
    // to be truncated as well, but hopefully when you
    // parse the message, you'll be able to tell that it's
    // not a valid message.
    if (ndx >= DATA_MAX_SIZE) {
      break;
    }
  }
  // no more available bytes to read from serial and we
  // did not receive the separato. it's an incomplete message!
//  Serial.println("error: incomplete message");
//  Serial.println(data);
  serialOut = data;
  memset(data, 32, sizeof(data));
}

void routingSerialOut(String serialOut){
  if(serialOut[0]=='1'){
    gen1.state=serialOut[9];
  }
  else if(serialOut[0]=='2'){
    gen2.state=serialOut[9];
  }
  else if(serialOut[0]=='3'){
    gen3.state=serialOut[9];
  }
  else if(serialOut[0]=='4'){
    gen4.state=serialOut[9];
  }
  else if(serialOut[0]=='5'){
    gen5.state=serialOut[9];
  }
  else if(serialOut[0]=='6'){
    gen6.state=serialOut[9];
  }
}

void checkAttributeChange(Generator generator) { 
  // Change Check for Button
  static boolean b_old = 1;
  boolean b = digitalRead(generator.pin_button);
  boolean b_change = (b&&!b_old);
  b_old = b;
  if(b_change){
    generator.button=!generator.button;
    Serial.print(generator.number);
    Serial.print("/button/");
    Serial.println(generator.button);
  }
  // Change Check for Limit Switch
  static boolean ls_old = 1;
  boolean ls = digitalRead(generator.pin_limit_switch);
  boolean ls_change = (ls&&!ls_old);
  ls_old = ls;
  if(ls_change){
    generator.limit_switch=!generator.limit_switch;
    Serial.print(generator.number);
    Serial.print("/limit_switch/");
    Serial.println(generator.limit_switch);
  }
}

// Setup
void setup() {
  Serial.begin(9600);
  pinMode(pin_button1, INPUT);
  pinMode(pin_button2, INPUT);
  pinMode(pin_button3, INPUT);
  pinMode(pin_button4, INPUT);
  pinMode(pin_button5, INPUT);
  pinMode(pin_button6, INPUT);
  pinMode(pin_limit_switch1, INPUT);
  pinMode(pin_limit_switch2, INPUT);
  pinMode(pin_limit_switch3, INPUT);
  pinMode(pin_limit_switch4, INPUT);
  pinMode(pin_limit_switch5, INPUT);
  pinMode(pin_limit_switch6, INPUT);
  pinMode(pin_lights1, OUTPUT);
  pinMode(pin_lights2, OUTPUT);
  pinMode(pin_lights3, OUTPUT);
  pinMode(pin_lights4, OUTPUT);
  pinMode(pin_lights5, OUTPUT);
  pinMode(pin_lights6, OUTPUT);
  FastLED.addLeds<WS2812, pin_lights1>(gen1.led_array, NUM_LEDS);
  FastLED.addLeds<WS2812, pin_lights2>(gen2.led_array, NUM_LEDS);
  FastLED.addLeds<WS2812, pin_lights3>(gen3.led_array, NUM_LEDS);
  FastLED.addLeds<WS2812, pin_lights4>(gen4.led_array, NUM_LEDS);
  FastLED.addLeds<WS2812, pin_lights5>(gen5.led_array, NUM_LEDS);
  FastLED.addLeds<WS2812, pin_lights6>(gen6.led_array, NUM_LEDS);
  FastLED.setBrightness(BRIGHTNESS);
}

void loop() {
  // Input dari SerialPort berupa serialOut
  receiveData();
  routingSerialOut(serialOut);
  // Aktuasi sesuai state
  lights(gen1);
  lights(gen2);
  lights(gen3);
  lights(gen4);
  lights(gen5);
  lights(gen6);
  // Input dari button dan limit_switch
  // Ditransmisikan ke SerialPort jika suatu attribut dalam salah satu generator berubah
  checkAttributeChange(gen1);
  checkAttributeChange(gen2);
  checkAttributeChange(gen3);
  checkAttributeChange(gen4);
  checkAttributeChange(gen5);
  checkAttributeChange(gen6);
  delay(10);
}
