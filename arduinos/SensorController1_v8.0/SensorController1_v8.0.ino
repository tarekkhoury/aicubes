#include <Wire.h>
#include <Adafruit_BMP085.h>

#include <ArduinoJson.h>  // JSON Parser library
#include <dht.h>


#define MICROCONTROLLERID "1" // each mc will have its unique ID (MICROCONTROLLERID)

//TEST LED
#define LEDPIND_TEST 7

// Start - cycle time variables
long cycleTimeInitialMillis = 0;
long cycleTimeEndMillis = 0;
long cycleTimeMillis = 0;
long previousMillisComp1 = 0;        // will store last time LED was updated
long previousMillisComp2 = 0;        // will store last time LED was updated
long previousMillisComp3 = 0;        // will store last time LED was updated
long  previousMillisComp4 = 0;        // will store last time LED was updated
long  previousMillisComp5_1 = 0;        // will store last time LED was updated
long  previousMillisComp5_2 = 0;        // will store last time LED was updated
long  previousMillisCompD = 0;        // will store last time LED was updated

#define UPDATEFREQUENCYCOMPONENT_D 10000   // device update

// End - component 1: Door sensor variables

// Start - Incoming serial stream variables
String commandString = "";//Serial.print
// End - Incoming serial stream variables

// Start - component 1: Door sensor variables
#define COMPONENTID_1 "1"
#define COMPONENTDESC_1 "Door"

#define COMPONENTPIN_1 2
#define LEDPIND_COMPONENT_1 13
int stateOfComponent_1 = 0;
int laststateOfComponent_1 = 0;
int ledStateOfComponent_1 = LOW;// ledState used to set the LED
#define UPDATEFREQUENCYCOMPONENT_1 11000

// End - component 1: Door sensor variables


// Start - component 2: Light  variables
#define COMPONENTID_2 "2"
#define COMPONENTDESC_2 "Light"

#define COMPONENTPIN_2 11
#define LEDPIND_COMPONENT_2 10
int stateOfComponent_2 = 0;
int laststateOfComponent_2 = 0;
int ledStateOfComponent_2 = LOW;// ledState used to set the LED
#define UPDATEFREQUENCYCOMPONENT_2 9000

// End - component 2: Light variables


// Start - component 3: TMP sensor variables

#define COMPONENTID_3 "3"
#define COMPONENTDESC_3 "Temperature (C)"

#define COMPONENTPIN_3 0
#define UPDATEFREQUENCYCOMPONENT_3 10000

// End - component 3: TMP sensor variables

// Start - component 4: Humidity DHT11 sensor variables

dht DHT;
#define  COMPONENTID_4 "4"
#define COMPONENTDESC_4 "Humidity (%)"

#define COMPONENTPIN_4 3
#define  UPDATEFREQUENCYCOMPONENT_4 11500

// End - component 4: Humidity DHT11 sensor variables


// Start - component 5: Pressure BMP180 sensor variables

Adafruit_BMP085 bmp;
#define  COMPONENTID_5_1 "5"
#define COMPONENTDESC_5_1 "Pressure (Pa)"

#define  COMPONENTID_5_2 "6"
#define COMPONENTDESC_5_2 "Altitude (m)"


//#define COMPONENTPIN_4 3
#define  UPDATEFREQUENCYCOMPONENT_5_1 12500
#define  UPDATEFREQUENCYCOMPONENT_5_2 13200
// End - component 5: Pressure BMP180 sensor variables

// PIR Sensor


#define COMPONENTID_6 "7"
#define COMPONENTDESC_6 "Motion"
#define COMPONENTPIN_6 5
#define LEDPIN_COMPONENT_6 6

int COMPONENT_STATE_6 = LOW;             // we start, assuming no motion detected
int COMPONENTPIN_6_val = 0;

//int calibrationTime = 30;
////the time when the sensor outputs a low impulse
//long unsigned int lowIn;
////the amount of milliseconds the sensor has to be low
////before we assume all motion has stopped
//long unsigned int pause = 5000;
//boolean lockLow = true;
//boolean takeLowTime;




// JSON parameters: mcId:integrer , compId:integer , desc:String , action:String, value:String

void setup() {
  // initialize digital pin 13 as an output.
  Serial.begin(9600);
  bmp.begin();

  ///////////////

  pinMode(COMPONENTPIN_6, INPUT);
  pinMode(LEDPIN_COMPONENT_6, OUTPUT);
  digitalWrite(COMPONENTPIN_6, LOW);

  ///////////////


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





  //  //give the sensor some time to calibrate
  //  Serial.print("calibrating sensor ");
  //    for(int i = 0; i < calibrationTime; i++){
  //      Serial.print(".");
  //      delay(1000);
  //      }
  //    Serial.println(" done");
  //    Serial.println("SENSOR ACTIVE");
  //    delay(50);


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
        getComponents();
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

      messageBCRoot["m"] = MICROCONTROLLERID;
      messageBCRoot["c"] = COMPONENTID_3;
      messageBCRoot["d"] = COMPONENTDESC_3;
      messageBCRoot["a"] = "GET";
      messageBCRoot["v"] = "";
      getComponentState(messageBCRoot);

      messageBCRoot["m"] = MICROCONTROLLERID;
      messageBCRoot["c"] = COMPONENTID_4;
      messageBCRoot["d"] = COMPONENTDESC_4;
      messageBCRoot["a"] = "GET";
      messageBCRoot["v"] = "";
      getComponentState(messageBCRoot);

      messageBCRoot["m"] = MICROCONTROLLERID;
      messageBCRoot["c"] = COMPONENTID_5_1;
      messageBCRoot["d"] = COMPONENTDESC_5_1;
      messageBCRoot["a"] = "GET";
      messageBCRoot["v"] = "";
      getComponentState(messageBCRoot);

      messageBCRoot["m"] = MICROCONTROLLERID;
      messageBCRoot["c"] = COMPONENTID_5_2;
      messageBCRoot["d"] = COMPONENTDESC_5_2;
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
  monitorMotion();


  // regular broadcast of temperature every UPDATEFREQUENCYCOMPONENT_3 milliseconds
  unsigned long currentMillis = millis();


  if (currentMillis - previousMillisComp1 > UPDATEFREQUENCYCOMPONENT_3) {
    // save the last time you blinked the LED
    previousMillisComp1 = currentMillis;

    StaticJsonBuffer<200> jsonMessageOutBuffer;
    JsonObject& messageOutRoot = jsonMessageOutBuffer.createObject();

    messageOutRoot["m"] = MICROCONTROLLERID;
    messageOutRoot["c"] = COMPONENTID_3;
    messageOutRoot["d"] = COMPONENTDESC_3;
    messageOutRoot["a"] = "PUSH";
    messageOutRoot["v"] = getTempSensorValue();
    messageOutRoot.printTo(Serial);
    Serial.print("\n");
  }

  // regular update for tempreture


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




  // regular broadcast of temperature every UPDATEFREQUENCYCOMPONENT_1 milliseconds

  currentMillis = millis();
  if (currentMillis - previousMillisComp3 > UPDATEFREQUENCYCOMPONENT_1) {
    // save the last time you blinked the LED
    previousMillisComp3 = currentMillis;

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


  // regular broadcast of humidity every UPDATEFREQUENCYCOMPONENT_1 milliseconds

  currentMillis = millis();
  if (currentMillis - previousMillisComp4 > UPDATEFREQUENCYCOMPONENT_4) {
    // save the last time you blinked the LED
    previousMillisComp4 = currentMillis;

    StaticJsonBuffer<200> jsonMessageOutBuffer;
    JsonObject& messageOutRoot = jsonMessageOutBuffer.createObject();

    messageOutRoot["m"] = MICROCONTROLLERID;
    messageOutRoot["c"] = COMPONENTID_4;
    messageOutRoot["d"] = COMPONENTDESC_4;
    messageOutRoot["a"] = "PUSH";
    messageOutRoot["v"] = getHumidityDHT22();
    getComponentState(messageOutRoot);
  }

  // regular update for humidity


  // regular broadcast of Pressure every UPDATEFREQUENCYCOMPONENT_1 milliseconds

  currentMillis = millis();
  if (currentMillis - previousMillisComp5_1 > UPDATEFREQUENCYCOMPONENT_5_1) {
    // save the last time you blinked the LED
    previousMillisComp5_1 = currentMillis;

    StaticJsonBuffer<200> jsonMessageOutBuffer;
    JsonObject& messageOutRoot = jsonMessageOutBuffer.createObject();

    messageOutRoot["m"] = MICROCONTROLLERID;
    messageOutRoot["c"] = COMPONENTID_5_1;
    messageOutRoot["d"] = COMPONENTDESC_5_1;
    messageOutRoot["a"] = "PUSH";
    messageOutRoot["v"] = getPressureBmp185();
    getComponentState(messageOutRoot);
  }

  // regular update for Pressure



  // regular broadcast of Pressure every UPDATEFREQUENCYCOMPONENT_1 milliseconds

  currentMillis = millis();
  if (currentMillis - previousMillisComp5_2 > UPDATEFREQUENCYCOMPONENT_5_2) {
    // save the last time you blinked the LED
    previousMillisComp5_2 = currentMillis;

    StaticJsonBuffer<200> jsonMessageOutBuffer;
    JsonObject& messageOutRoot = jsonMessageOutBuffer.createObject();

    messageOutRoot["m"] = MICROCONTROLLERID;
    messageOutRoot["c"] = COMPONENTID_5_2;
    messageOutRoot["d"] = COMPONENTDESC_5_2;
    messageOutRoot["a"] = "PUSH";
    messageOutRoot["v"] = getreadAltitudeBmp185(101500);
    getComponentState(messageOutRoot);
  }



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
    } else if (compId == COMPONENTID_3) {
      messageOutRoot["d"] = COMPONENTDESC_3;
      if (action == "GET") {
        messageOutRoot["a"] = "PULL";
      } else {
        messageOutRoot["a"] = "PUSH";
      }
      messageOutRoot["v"] = getTempSensorValue();

    } else if (compId == COMPONENTID_4) {
      messageOutRoot["d"] = COMPONENTDESC_4;
      if (action == "GET") {
        messageOutRoot["a"] = "PULL";
      } else {
        messageOutRoot["a"] = "PUSH";
      }
      messageOutRoot["v"] = getHumidityDHT22();

    } else if (compId == COMPONENTID_5_1) {
      messageOutRoot["d"] = COMPONENTDESC_5_1;
      if (action == "GET") {
        messageOutRoot["a"] = "PULL";
      } else {
        messageOutRoot["a"] = "PUSH";
      }
      messageOutRoot["v"] = getPressureBmp185();

    } else if (compId == COMPONENTID_5_2) {
      messageOutRoot["d"] = COMPONENTDESC_5_2;
      if (action == "GET") {
        messageOutRoot["a"] = "PULL";
      } else {
        messageOutRoot["a"] = "PUSH";
      }
      messageOutRoot["v"] = getreadAltitudeBmp185(101500);
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












String getTempSensorValue() {
  int reading = analogRead(COMPONENTPIN_3);

  float voltage = reading * 5.0;
  voltage /= 1024.0;

  float temperatureC = (voltage - 0.5) * 100 ;  //converting from 10 mv per degree wit 500 mV offset

  char charVal[10];               //temporarily holds data from vals
  String stringVal = "";     //data on buff is copied to this string

  dtostrf(temperatureC, 3, 1, charVal);  //4 is mininum width, 3 is precision; float value is copied onto buff
  //convert chararray to string
  for (int i = 0; i < sizeof(charVal); i++)
  {
    stringVal += charVal[i];
  }

  return stringVal;
}






float getTemperatureDHT22() {
  DHT.read22(COMPONENTPIN_4);

  return DHT.temperature;
}

String getHumidityDHT22() {
  DHT.read22(COMPONENTPIN_4);

  char charVal[10];               //temporarily holds data from vals
  String stringVal = "";     //data on buff is copied to this string

  dtostrf(DHT.humidity, 4, 1, charVal);  //4 is mininum width, 3 is precision; float value is copied onto buff
  //convert chararray to string
  for (int i = 0; i < sizeof(charVal); i++)
  {
    stringVal += charVal[i];
  }

  return stringVal;
}




String getTemperatureBmp185() {
  char charVal[10];               //temporarily holds data from vals
  String stringVal = "";     //data on buff is copied to this string

  dtostrf(bmp.readTemperature(), 4, 1, charVal);  //4 is mininum width, 3 is precision; float value is copied onto buff
  //convert chararray to string
  for (int i = 0; i < sizeof(charVal); i++)
  {
    stringVal += charVal[i];
  }

  return stringVal;

}





String getPressureBmp185() {

  char charVal[10];               //temporarily holds data from vals
  String stringVal = "";     //data on buff is copied to this string

  dtostrf(bmp.readPressure(), 4, 1, charVal);  //4 is mininum width, 3 is precision; float value is copied onto buff
  //convert chararray to string
  for (int i = 0; i < sizeof(charVal); i++)
  {
    stringVal += charVal[i];
  }

  return stringVal;


}

String getreadAltitudeBmp185() {

  char charVal[10];               //temporarily holds data from vals
  String stringVal = "";     //data on buff is copied to this string

  dtostrf(bmp.readAltitude(), 4, 1, charVal);  //4 is mininum width, 3 is precision; float value is copied onto buff
  //convert chararray to string
  for (int i = 0; i < sizeof(charVal); i++)
  {
    stringVal += charVal[i];
  }

  return stringVal;


}

String getreadAltitudeBmp185(float seaLevelPressure) {


  char charVal[10];               //temporarily holds data from vals
  String stringVal = "";     //data on buff is copied to this string

  dtostrf(bmp.readAltitude(seaLevelPressure), 4, 1, charVal);  //4 is mininum width, 3 is precision; float value is copied onto buff
  //convert chararray to string
  for (int i = 0; i < sizeof(charVal); i++)
  {
    stringVal += charVal[i];
  }

  return stringVal;


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
  object["v"] = "Digital Switches";

  object.printTo(Serial);
  Serial.print("\n");

  object["m"] = MICROCONTROLLERID;
  object["c"] = COMPONENTID_3;
  object["d"] = COMPONENTDESC_3;
  object["a"] = "COMPS";
  object["v"] = "Analog Sensors";

  object.printTo(Serial);
  Serial.print("\n");

  object["m"] = MICROCONTROLLERID;
  object["c"] = COMPONENTID_4;
  object["d"] = COMPONENTDESC_4;
  object["a"] = "COMPS";
  object["v"] = "Analog Sensors";

  object.printTo(Serial);
  Serial.print("\n");

  object["m"] = MICROCONTROLLERID;
  object["c"] = COMPONENTID_5_1;
  object["d"] = COMPONENTDESC_5_1;
  object["a"] = "COMPS";
  object["v"] = "Analog Sensors";

  object.printTo(Serial);
  Serial.print("\n");

  object["m"] = MICROCONTROLLERID;
  object["c"] = COMPONENTID_5_2;
  object["d"] = COMPONENTDESC_5_2;
  object["a"] = "COMPS";
  object["v"] = "Analog Sensors";

  object.printTo(Serial);
  Serial.print("\n");

  object["m"] = MICROCONTROLLERID;
  object["c"] = COMPONENTID_6;
  object["d"] = COMPONENTDESC_6;
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
  messageBCRoot["d"] = "Arduino Uno";
  messageBCRoot["a"] = "DEVICES";
  messageBCRoot["v"] = MICROCONTROLLERID;

  messageBCRoot.printTo(Serial);
  Serial.print("\n");

}


void monitorMotion() {





    COMPONENTPIN_6_val = digitalRead(COMPONENTPIN_6);  // read input value
    if (COMPONENTPIN_6_val == HIGH) {            // check if the input is HIGH
      digitalWrite(LEDPIN_COMPONENT_6, HIGH);  // turn LED ON
      if (COMPONENT_STATE_6 == LOW) {
        // we have just turned on
        StaticJsonBuffer<200> jsonMessageBroadcastBuffer;
        JsonObject& messageBCRoot = jsonMessageBroadcastBuffer.createObject();

        messageBCRoot["m"] = MICROCONTROLLERID;
        messageBCRoot["c"] = COMPONENTID_6;
        messageBCRoot["d"] = COMPONENTDESC_6;
        messageBCRoot["a"] = "PUSH";
        messageBCRoot["v"] = "YES";
        messageBCRoot.printTo(Serial);
        Serial.print("\n");

        // We only want to print on the output change, not state
        COMPONENT_STATE_6 = HIGH;
      }
    } else {
      digitalWrite(LEDPIN_COMPONENT_6, LOW); // turn LED OFF
      if (COMPONENT_STATE_6 == HIGH) {
        // we have just turned of
        StaticJsonBuffer<200> jsonMessageBroadcastBuffer;
        JsonObject& messageBCRoot = jsonMessageBroadcastBuffer.createObject();
        messageBCRoot["m"] = MICROCONTROLLERID;
        messageBCRoot["c"] = COMPONENTID_6;
        messageBCRoot["d"] = COMPONENTDESC_6;
        messageBCRoot["a"] = "PUSH";
        messageBCRoot["v"] = "NO";
        messageBCRoot.printTo(Serial);
        Serial.print("\n");

        // We only want to print on the output change, not state
        COMPONENT_STATE_6 = LOW;
      }
    }
  






}

