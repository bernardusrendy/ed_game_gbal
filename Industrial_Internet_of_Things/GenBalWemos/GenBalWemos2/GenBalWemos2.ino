// PIN Definition and library callouts
#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#define pin_button D7
#define pin_limit_switch D8

// NETWORK AND MQTT SERVER
const char* ssid = "AndroidAP_9667";
const char* password = "12345678";
const char* mqtt_server = "192.168.43.175";

// INITIATE WiFi OBJECT
WiFiClient espClient;
PubSubClient client(espClient);
long lastMsg=0; //Temporary variable for message timing

// SETUP WiFi CONNECTION
void setup_wifi() {
  // We start by connecting to a WiFi network
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);

  // Waiting until connected
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  randomSeed(micros());
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

//CALLBACK FUNCTION
void callback(char* topic, byte* payload, unsigned int length) {
}

void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    
    // Create a random client ID
    String clientId = "ESP8266Client-";
    clientId += String(random(0xffff), HEX);
    
    // Attempt to connect
    if (client.connect(clientId.c_str())) {
      Serial.println("connected");
      client.subscribe("autoManual");
      } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

int button=0;
int limit_switch=0;
boolean button_old;
boolean limit_switch_old;
char published_limit_switch[1]={0};
char published_button[1]={0};

// Setup
void setup() {
  Serial.begin(115200);
  pinMode(pin_button, INPUT);
  pinMode(pin_limit_switch, INPUT);
  setup_wifi();
  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
  // Change Check for Button
  boolean b = digitalRead(pin_button);
  if(b!=button_old){
    button=b;
    if(button==1){
      published_button[0]={'1'};  
    }
    else if(button==0){
      published_button[0]={'0'};  
    }    
    client.publish("2/button",published_button);
  }
  button_old = b;
  // Change Check for Limit Switch
  boolean ls = digitalRead(pin_limit_switch);
  if(ls!=limit_switch_old){
    limit_switch=!limit_switch;
    if(limit_switch==1){
      published_limit_switch[0]={'1'};  
    }
    else if(limit_switch==0){
      published_limit_switch[0]={'0'};  
    }
    client.publish("2/limit_switch",published_limit_switch);
    Serial.println(published_limit_switch);
  }
  limit_switch_old = ls;
  delay(10);
}
