#include "FastLED.h"

#define NUM_LEDS             9 //LED Amount per Generator
#define BRIGHTNESS          96
#define FRAMES_PER_SECOND  120

#define pin_button1 A0
#define pin_limit_switch1 A1
#define pin_lights1 A2
#define pin_button2 A3
#define pin_limit_switch2 A4
#define pin_lights2 A5
#define pin_button3 A6
#define pin_limit_switch3 A7
#define pin_lights3 1
#define pin_button4 2
#define pin_limit_switch4 3
#define pin_lights4 4
#define pin_button5 5
#define pin_limit_switch5 6
#define pin_lights5 7
#define pin_button6 8
#define pin_limit_switch6 9
#define pin_lights6 10
#define DATA_MAX_SIZE 6

// Class Declaration
struct Generator {
  int button;
  int limit_switch;
  int pin_button;
  int pin_limit_switch;
  String state;
  int pin_lights;
  CRGB led_array[NUM_LEDS];
};

// Object Call
Generator gen1 = {0,0,pin_button1,pin_limit_switch1,"offline",pin_lights1};
Generator gen2 = {0,0,pin_button2,pin_limit_switch2,"offline",pin_lights2};
Generator gen3 = {0,0,pin_button3,pin_limit_switch3,"offline",pin_lights3};
Generator gen4 = {0,0,pin_button4,pin_limit_switch4,"offline",pin_lights4};
Generator gen5 = {0,0,pin_button5,pin_limit_switch5,"offline",pin_lights5};
Generator gen6 = {0,0,pin_button6,pin_limit_switch6,"offline",pin_lights6};

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
char data[8];
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
  Serial.println("error: incomplete message");
  Serial.println(data);
  serialOut = data;
  memset(data, 32, sizeof(data));
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
  receiveData();
  gen1.state=serialOut[0];
  gen2.state=serialOut[1];
  gen3.state=serialOut[2];
  gen4.state=serialOut[3];
  gen5.state=serialOut[4];
  gen6.state=serialOut[5];
  lights(gen1);
  lights(gen2);
  lights(gen3);
  lights(gen4);
  lights(gen5);
  lights(gen6);
  if(
    Serial.print(gen1.button);
    Serial.print(",");
    Serial.print(gen1.limit_switch);
    Serial.print(",");
    Serial.print(gen2.button);
    Serial.print(",");
    Serial.print(gen2.limit_switch);
    Serial.print(",");
    Serial.print(gen3.button);
    Serial.print(",");
    Serial.print(gen3.limit_switch);
    Serial.print(",");
    Serial.print(gen4.button);
    Serial.print(",");
    Serial.print(gen4.limit_switch);
    Serial.print(",");
    Serial.print(gen5.button);
    Serial.print(",");
    Serial.print(gen5.limit_switch);
    Serial.print(",");
    Serial.print(gen6.button);
    Serial.print(",");
    Serial.println(gen6.limit_switch);
}
