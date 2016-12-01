#include <ArduinoJson.h>  // JSON Parser library

#define MICROCONTROLLERID "2" // each mc will have its unique ID (MICROCONTROLLERID)

// Start - cycle time variables
long cycleTimeInitialMillis = 0;
long cycleTimeEndMillis = 0;
long cycleTimeMillis = 0;
long previousMillis = 0;        // will store last time LED was updated
long previousMillisComp1 = 0;
long previousMillisComp2 = 0;
long  previousMillisCompD = 0;        // will store last time LED was updated

#define UPDATEFREQUENCYCOMPONENT_D 10000   // device update

// End - cycle time variables

// Start - Incoming serial stream variables
String commandString = "";//Serial.print
// End - Incoming serial stream variables


// Start - component 2: Light  variables
#define COMPONENTID_1 "1"
#define COMPONENTDESC_1 "Light"

#define COMPONENTPIN_1 2

#define LEDPIND_COMPONENT_1 10
#define UPDATEFREQUENCYCOMPONENT_1 13000
// End - component 2: Light variables

// Start - component 2: Light  variables
#define COMPONENTID_2 "2"
#define COMPONENTDESC_2 "Light"

#define COMPONENTPIN_2 3
#define LEDPIND_COMPONENT_2 11
#define UPDATEFREQUENCYCOMPONENT_2 14000

// End - component 2: Light variables

//TEST LED
#define LEDPIND_TEST 7



// JSON parameters: mcId:integrer , compId:integer , desc:String , action:String, value:String

void setup() {
  // initialize digital pin 13 as an output.
  Serial.begin(9600);

  // Start - initilising pins for component 1
  pinMode(LEDPIND_COMPONENT_1, OUTPUT);
  pinMode(COMPONENTPIN_1, OUTPUT);
  digitalWrite(LEDPIND_COMPONENT_1, LOW);
  digitalWrite(COMPONENTPIN_1, HIGH);
  // End - initilising pins for component 1

  // Start - initilising pins for component 2
  pinMode(LEDPIND_COMPONENT_2, OUTPUT);
  pinMode(COMPONENTPIN_2, OUTPUT);
  digitalWrite(LEDPIND_COMPONENT_2, LOW);
  digitalWrite(COMPONENTPIN_2, HIGH);
  // End - initilising pins for component 2

  // Start - initilising pins for LED Test
  pinMode(LEDPIND_TEST, OUTPUT);
  digitalWrite(LEDPIND_TEST, HIGH);
  delay(200);
  digitalWrite(LEDPIND_TEST, LOW);
  delay(200);
  // End - initilising pins for LED Test


  // Advertise presense
  getDeviceId();
  delay(1000);
  getDeviceId();
  delay(1000);
  getDeviceId();
  delay(1000);

  getComponents();
  delay(1000);
  getComponents();
  delay(1000);
  getComponents();
  delay(1000);
}


void loop() {

  cycleTimeInitialMillis = millis(); // loop start time

  while (Serial.available()) {
    //blinkLed(13, 1000);
    delay(3);
    char c = Serial.read();
    if ( c != 0) {
      commandString += c;
      if (c == '\n') {
        break;
      }
    }
  }

  if (commandString != "") {
    StaticJsonBuffer<200> jsonMessageInBuffer;
    char charBuf[100];
    commandString.toCharArray(charBuf, 100) ;
    JsonObject& messageInRoot = jsonMessageInBuffer.parseObject(charBuf); ;

    // display message to Serialfor debugging
#if 0
    messageInRoot.printTo(Serial);
    Serial.print("\n");
#endif

    String mcId = messageInRoot["m"];
    String compId = messageInRoot["c"];
    String desc = messageInRoot["d"];
    String action = messageInRoot["a"];
    String value = messageInRoot["v"];

    if (mcId == MICROCONTROLLERID ) {
      if ( action == "GET") {
        getComponentState(messageInRoot);
      } else if ( action == "SET") {
        setComponentState(messageInRoot);
      }  else if ( action == "DISCO_COMPS") {
//        Serial.println("test");
        getComponents();
//        Serial.println("test");

      }
    }


    if (action == "BROADCAST") {

      StaticJsonBuffer<200> jsonMessageBroadcastBuffer;
      JsonObject& messageBCRoot = jsonMessageBroadcastBuffer.createObject();

      messageBCRoot["m"] = MICROCONTROLLERID;
      messageBCRoot["c"] = COMPONENTID_1;
      messageBCRoot["d"] = COMPONENTDESC_1;
      messageBCRoot["a"] = "GET";
      messageBCRoot["v"] = "";
      getComponentState(messageBCRoot);

      messageBCRoot["m"] = MICROCONTROLLERID;
      messageBCRoot["c"] = COMPONENTID_2;
      messageBCRoot["d"] = COMPONENTDESC_2;
      messageBCRoot["a"] = "GET";
      messageBCRoot["v"] = "";
      getComponentState(messageBCRoot);
    }

    if (action == "TESTALL") { // blink
      for (int i = 0; i < 10; i++) {
        digitalWrite(LEDPIND_TEST, HIGH);
        delay(100);
        digitalWrite(LEDPIND_TEST, LOW);
        delay(100);
      }

    }

    if ( action == "DISCO_DEVICES") {

      getDeviceId();
    }

  }


  // regular broadcast of temperature every UPDATEFREQUENCYCOMPONENT_2 milliseconds

  unsigned long currentMillis = millis();
  if (currentMillis - previousMillisComp1 > UPDATEFREQUENCYCOMPONENT_1) {
    // save the last time you blinked the LED
    previousMillisComp1 = currentMillis;

    StaticJsonBuffer<200> jsonMessageOutBuffer;
    JsonObject& messageOutRoot = jsonMessageOutBuffer.createObject();

    messageOutRoot["m"] = MICROCONTROLLERID;
    messageOutRoot["c"] = COMPONENTID_1;
    messageOutRoot["d"] = COMPONENTDESC_1;
    messageOutRoot["a"] = "PUSH";
    messageOutRoot["v"] = "";
    getComponentState(messageOutRoot);

  }

  // regular update for temperature


  // regular broadcast of temperature every UPDATEFREQUENCYCOMPONENT_2 milliseconds

  currentMillis = millis();
  if (currentMillis - previousMillisComp2 > UPDATEFREQUENCYCOMPONENT_2) {
    // save the last time you blinked the LED
    previousMillisComp2 = currentMillis;

    StaticJsonBuffer<200> jsonMessageOutBuffer;
    JsonObject& messageOutRoot = jsonMessageOutBuffer.createObject();

    messageOutRoot["m"] = MICROCONTROLLERID;
    messageOutRoot["c"] = COMPONENTID_2;
    messageOutRoot["d"] = COMPONENTDESC_2;
    messageOutRoot["a"] = "PUSH";
    messageOutRoot["v"] = "";
    getComponentState(messageOutRoot);

  }

  // regular update for tempreture


 // regular update for device

  currentMillis = millis();
  if (currentMillis - previousMillisCompD > UPDATEFREQUENCYCOMPONENT_D) {
    // save the last time you blinked the LED
    previousMillisCompD = currentMillis;
    getDeviceId();
  }

  // regular update for device



#if 0
  cycleTimeEndMillis = millis();  // loop end time
  Serial.print("\t");
  Serial.print("cycleTimeMillis = ");
  Serial.print(cycleTimeEndMillis - cycleTimeInitialMillis);
  Serial.println("\t");
#endif
  commandString = "";  //reset comand string
}


void setComponentState(JsonObject &messageIn) {
  String mcId = messageIn["m"];
  String compId = messageIn["c"];
  String desc = messageIn["d"];
  String action = messageIn["a"];
  String value = messageIn["v"];

  if (mcId == MICROCONTROLLERID) {

    if ( compId == COMPONENTID_2 && action == "SET") {
      messageIn["d"] = COMPONENTDESC_2;


      if (value == "ON") {
        digitalWrite(COMPONENTPIN_2, LOW);
        digitalWrite(LEDPIND_COMPONENT_2, HIGH);

      } else {

        digitalWrite(COMPONENTPIN_2, HIGH);
        digitalWrite(LEDPIND_COMPONENT_2, LOW);
      }
    } else if (compId == COMPONENTID_1 && action == "SET") {
      messageIn["d"] = COMPONENTDESC_1;

      if (value == "ON") {
        digitalWrite(COMPONENTPIN_1, LOW);
        digitalWrite(LEDPIND_COMPONENT_1, HIGH);

      } else {
        digitalWrite(COMPONENTPIN_1, HIGH);
        digitalWrite(LEDPIND_COMPONENT_1, LOW);
      }
    }
    messageIn["a"] = "PULL";
    messageIn.printTo(Serial);
    Serial.print("\n");
  }

}




void getComponentState(JsonObject &messageIn) {

  String mcId = messageIn["m"];
  String compId = messageIn["c"];
  String desc = messageIn["d"];
  String action = messageIn["a"];
  String value = messageIn["v"];

  if (mcId == MICROCONTROLLERID) {
    StaticJsonBuffer<200> jsonMessageOutBuffer;
    JsonObject& messageOutRoot = jsonMessageOutBuffer.createObject();

    messageOutRoot["m"] = mcId;
    messageOutRoot["c"] = compId;

    if ( compId == COMPONENTID_1) {
      messageOutRoot["d"] = COMPONENTDESC_1;
      if (action == "GET") {
        messageOutRoot["a"] = "PULL";
      } else {
        messageOutRoot["a"] = "PUSH";
      }
      if (digitalRead(COMPONENTPIN_1) == HIGH) {
        messageOutRoot["v"] = "OFF";
      } else {
        messageOutRoot["v"] = "ON";
      }

    } else if ( compId == COMPONENTID_2 ) {
      messageOutRoot["d"] = COMPONENTDESC_2;
      if (action == "GET") {
        messageOutRoot["a"] = "PULL";
      } else {
        messageOutRoot["a"] = "PUSH";
      }
      if (digitalRead(COMPONENTPIN_2) == HIGH) {
        messageOutRoot["v"] = "OFF";
      } else {
        messageOutRoot["v"] = "ON";
      }

    }

    messageOutRoot.printTo(Serial);
    Serial.print("\n");
  }
}


void getComponents() {

  StaticJsonBuffer<200> jsonBuffer;
  JsonObject& object = jsonBuffer.createObject();
  
  object["m"] = MICROCONTROLLERID;
  object["c"] = COMPONENTID_1;
  object["d"] = COMPONENTDESC_1;
  object["a"] = "COMPS";
  object["v"] = "Digital Switches";
  
  object.printTo(Serial);
  Serial.print("\n");
  
  object["m"] = MICROCONTROLLERID;
  object["c"] = COMPONENTID_2;
  object["d"] = COMPONENTDESC_2;
  object["a"] = "COMPS";
  object["v"] = "Digital Switches";
  
  object.printTo(Serial);
  Serial.print("\n");




}


void getDeviceId() {
  StaticJsonBuffer<200> jsonMessageBroadcastBuffer;
  JsonObject& messageBCRoot = jsonMessageBroadcastBuffer.createObject();

  messageBCRoot["m"] = MICROCONTROLLERID;
  messageBCRoot["c"] = "";
  messageBCRoot["d"] = "Arduino Uno";
  messageBCRoot["a"] = "DEVICES";
  messageBCRoot["v"] = MICROCONTROLLERID;
  
  messageBCRoot.printTo(Serial);
  Serial.print("\n");
}

