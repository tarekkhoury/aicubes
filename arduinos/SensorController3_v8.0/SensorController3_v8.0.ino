#include <ArduinoJson.h>  // JSON Parser library

#define MICROCONTROLLERID "3" // each mc will have its unique ID (MICROCONTROLLERID)

// Start - cycle time variables
long cycleTimeInitialMillis = 0;
long cycleTimeEndMillis = 0;
long cycleTimeMillis = 0;
long previousMillisComp1 = 0;        // will store last time LED was updated
long previousMillisComp2 = 0;        // will store last time LED was updated
long previousMillisComp3 = 0;        // will store last time LED was updated
long  previousMillisCompD = 0;        // will store last time LED was updated

#define UPDATEFREQUENCYCOMPONENT_D 10000   // device update
// End - component 1: Door sensor variables

// Start - Incoming serial stream variables
String commandString = "";//Serial.print
// End - Incoming serial stream variables

//TEST LED
#define LEDPIND_TEST 7
//

// Start - component 1: Door sensor variables
#define COMPONENTID_1 "1"
#define COMPONENTDESC_1 "Door"
#define COMPONENTPIN_1 2
#define LEDPIND_COMPONENT_1 5
int stateOfComponent_1 = 0;
int laststateOfComponent_1 = 0;
int ledStateOfComponent_1 = LOW;// ledState used to set the LED
#define UPDATEFREQUENCYCOMPONENT_1 11000

// End - component 1: Door sensor variablesu


// Start - component 2: Light  variables
#define COMPONENTID_2 "2"
#define COMPONENTDESC_2 "Light"
#define COMPONENTPIN_2 11
#define LEDPIND_COMPONENT_2 10
int stateOfComponent_2 = 0;
int laststateOfComponent_2 = 0;
int ledStateOfComponent_2 = LOW;// ledState used to set the LED
#define UPDATEFREQUENCYCOMPONENT_2 9000
#define OPENCOMPONENT_1 5000
// End - component 2: Light variables


// Buzzer

#define LEDFLASHER 5
#define ALARMSOUNDER 6

// Buzzer


// JSON parameters: mcId:integrer , compId:integer , desc:String , action:String, value:String

void setup() {
  // initialize digital pin 13 as an output.
  Serial.begin(9600);

  // Start - initilising pins for component 1
  pinMode(LEDPIND_COMPONENT_1, OUTPUT);
  pinMode(COMPONENTPIN_1, INPUT);
  digitalWrite(COMPONENTPIN_1, HIGH);
  // End - initilising pins for component 1


  // Start - initilising pins for component 1
  pinMode(LEDPIND_COMPONENT_2, OUTPUT);
  pinMode(COMPONENTPIN_2, OUTPUT);
  digitalWrite(LEDPIND_COMPONENT_2, LOW);
  digitalWrite(COMPONENTPIN_2, LOW);

  // End - initilising pins for component 1
  pinMode(LEDPIND_TEST, OUTPUT);

  // Buzzer
  pinMode(LEDFLASHER, OUTPUT);
  pinMode(ALARMSOUNDER, OUTPUT);

  // Buzzer

  // Start - initilising pins for LED Test
  pinMode(LEDPIND_TEST, OUTPUT);
  digitalWrite(LEDPIND_TEST, HIGH);
  delay(200);
  digitalWrite(LEDPIND_TEST, LOW);
  // End - initilising pins for LED Test
  delay(200);

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
      } else if ( action == "DISCO_COMPS") {
       // Serial.println("test");
        getComponents();
       // Serial.println("test");

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


  // Read COMPONENT 1 (Door 1) Status  and TRIGGER (PUSH) a notification id there is a chane in state
  monitorComponentStatusChange( COMPONENTPIN_1, LEDPIND_COMPONENT_1, stateOfComponent_1,  laststateOfComponent_1);



  unsigned long currentMillis = millis();
  if (stateOfComponent_1 == 1) {
    if (currentMillis - previousMillisComp1 > OPENCOMPONENT_1) {
      // save the last time you blinked the LED
      previousMillisComp1 = currentMillis;


      //      for (int i = 1; i <= 10; i++)
      //      {
      analogWrite(LEDFLASHER, 255);
      analogWrite(ALARMSOUNDER, 200);
      //        delay(100);
      analogWrite(LEDFLASHER, 0);
      analogWrite(ALARMSOUNDER, 25);
      //        delay(100);
      //      }

    }
  } else {
    analogWrite(ALARMSOUNDER, 0);
    previousMillisComp1 = currentMillis;

  }







  // regular broadcast of temperature every UPDATEFREQUENCYCOMPONENT_1 milliseconds

  currentMillis = millis();
  if (currentMillis - previousMillisComp2 > UPDATEFREQUENCYCOMPONENT_1) {
    // save the last time you blinked the LED
    previousMillisComp2 = currentMillis;

    StaticJsonBuffer<200> jsonMessageOutBuffer;
    JsonObject& messageOutRoot = jsonMessageOutBuffer.createObject();

    messageOutRoot["m"] = MICROCONTROLLERID;
    messageOutRoot["c"] = COMPONENTID_1;
    messageOutRoot["d"] = COMPONENTDESC_1;
    messageOutRoot["a"] = "PUSH";
    messageOutRoot["v"] = "";
    getComponentState(messageOutRoot);
  }

  // regular update for tempreture





  // regular broadcast of temperature every UPDATEFREQUENCYCOMPONENT_1 milliseconds

  currentMillis = millis();
  if (currentMillis - previousMillisComp3 > UPDATEFREQUENCYCOMPONENT_2) {
    // save the last time you blinked the LED
    previousMillisComp3 = currentMillis;

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
        digitalWrite(COMPONENTPIN_2, HIGH);
        digitalWrite(LEDPIND_COMPONENT_2, HIGH);

      } else {

        digitalWrite(COMPONENTPIN_2, LOW);
        digitalWrite(LEDPIND_COMPONENT_2, LOW);
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


    if ( compId == COMPONENTID_1 ) {
      messageOutRoot["d"] = COMPONENTDESC_1;
      if (action == "GET") {
        messageOutRoot["a"] = "PULL";
      } else {
        messageOutRoot["a"] = "PUSH";
      }
      if (stateOfComponent_1 == 0) {
        messageOutRoot["v"] = "CLOSED";
      }
      else {
        messageOutRoot["v"] = "OPEN";
      }

    } else if ( compId == COMPONENTID_2 ) {
      messageOutRoot["d"] = COMPONENTDESC_2;
      if (action == "GET") {
        messageOutRoot["a"] = "PULL";
      } else {
        messageOutRoot["a"] = "PUSH";
      }

      if (digitalRead(COMPONENTPIN_2) == LOW) {
        messageOutRoot["v"] = "OFF";
      } else {
        messageOutRoot["v"] = "ON";
      }
    }

    messageOutRoot.printTo(Serial);
    Serial.print("\n");

  }
}



void monitorComponentStatusChange(int sensorPin, int ledPin, int &stateOfComponent, int &lastStateOfComponent)
{
  if (digitalRead(sensorPin) == LOW) {
    digitalWrite(ledPin, LOW);
    stateOfComponent = 0;
  }
  else {
    digitalWrite(ledPin, HIGH);
    stateOfComponent  = 1;
  }
  // IF Door Sensor Status Change --> broadcast change
  if (stateOfComponent != lastStateOfComponent) {
    StaticJsonBuffer<200> jsonMessageOutBuffer;
    JsonObject& messageOutRoot = jsonMessageOutBuffer.createObject();
    messageOutRoot["m"] = MICROCONTROLLERID;
    messageOutRoot["c"] = COMPONENTID_1;
    messageOutRoot["d"] = COMPONENTDESC_1;
    messageOutRoot["a"] = "PUSH";

    if (digitalRead(sensorPin) == LOW) {
      messageOutRoot["v"] = "CLOSED";
    }
    else {
      messageOutRoot["v"] = "OPEN";
    }
    messageOutRoot.printTo(Serial);
    Serial.print("\n");
  }
  lastStateOfComponent = stateOfComponent;
}


void getComponents() {
  
  
  StaticJsonBuffer<200> jsonBuffer;
  JsonObject& object = jsonBuffer.createObject();
  
  object["m"] = MICROCONTROLLERID;
  object["c"] = COMPONENTID_1;
  object["d"] = COMPONENTDESC_1;
  object["a"] = "COMPS";
  object["v"] = "Digital Sensors";
  
  object.printTo(Serial);
  Serial.print("\n");
  
  object["m"] = MICROCONTROLLERID;
  object["c"] = COMPONENTID_2;
  object["d"] = COMPONENTDESC_2;
  object["a"] = "COMPS";
  object["v"] = "Digital Sensors";
  
  object.printTo(Serial);
  Serial.print("\n");
}


void getDeviceId() {
  StaticJsonBuffer<200> jsonMessageBroadcastBuffer;
  JsonObject& messageBCRoot = jsonMessageBroadcastBuffer.createObject();

  messageBCRoot["m"] = MICROCONTROLLERID;
  messageBCRoot["c"] = "";
  messageBCRoot["d"] = "Arduino Micro Pro";
  messageBCRoot["a"] = "DEVICES";
  messageBCRoot["v"] = MICROCONTROLLERID;
  
  messageBCRoot.printTo(Serial);
  Serial.print("\n");
}



