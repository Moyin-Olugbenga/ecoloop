#include <DHT.h>
#include <MQUnifiedsensor.h>
#include <TinyGPSPlus.h>
#include <HardwareSerial.h>
#include <WiFi.h>
#include <HTTPClient.h>

// ─── PIN DEFINITIONS ───────────────────────────
#define DHT_PIN        4        // DHT22 DATA → D4
#define DHT_TYPE       DHT22
#define MQ135_PIN      34       // MQ135 OUT → D34
#define GPS_RX_PIN     21       // GPS TXD → RX2
#define GPS_TX_PIN     22       // GPS RXD → TX2

// ─── WIFI CREDENTIALS ──────────────────────────
const char* WIFI_SSID     = "TECNO SPARK 40";
const char* WIFI_PASSWORD = "adekanmii";

// ─── YOUR BACKEND URL ──────────────────────────
const char* SERVER_URL = "http://YOUR_BACKEND_URL/api/sensor-data";

// ─── SENSOR OBJECTS ────────────────────────────
DHT dht(DHT_PIN, DHT_TYPE);
MQUnifiedsensor MQ135("ESP32", 3.3, 12, MQ135_PIN, "MQ-135");
TinyGPSPlus gps;
HardwareSerial GPSSerial(2);

// ─── SEVERITY FUNCTION ─────────────────────────
String getSeverity(float ppm) {
  if (ppm < 100)  return "Clean";
  if (ppm < 300)  return "Moderate";
  if (ppm < 600)  return "Severe";
  return "Hazardous";
}

// ─── SEVERITY COLOR ────────────────────────────
String getSeverityColor(float ppm) {
  if (ppm < 100)  return "green";
  if (ppm < 300)  return "yellow";
  if (ppm < 600)  return "orange";
  return "red";
}

void setup() {
  Serial.begin(115200);

  // DHT22 setup
  dht.begin();
  Serial.println("DHT22 initialized");

  // MQ135 setup
  MQ135.setRegressionMethod(1);
  MQ135.setA(110.47);
  MQ135.setB(-2.862);
  MQ135.init();

  // Calibrate MQ135
  Serial.println("Calibrating MQ135, please wait 30 seconds...");
  float calcR0 = 0;
  for (int i = 1; i <= 10; i++) {
    MQ135.update();
    calcR0 += MQ135.calibrate(3.6);
    Serial.print(".");
    delay(3000);
  }
  MQ135.setR0(calcR0 / 10);
  Serial.println("\nMQ135 calibrated");

  // GPS setup
  GPSSerial.begin(9600, SERIAL_8N1, GPS_RX_PIN, GPS_TX_PIN);
  Serial.println("GPS initialized");

  // WiFi setup
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
}

void loop() {

  // ─── READ DHT22 ──────────────────────────────
  float temperature = dht.readTemperature();
  float humidity    = dht.readHumidity();

  if (isnan(temperature) || isnan(humidity)) {
    Serial.println("DHT22 read failed, retrying...");
    delay(2000);
    return;
  }

  // ─── READ MQ135 (corrected with temp/humidity) 
  MQ135.update();

  // correction factor using DHT22 values
  float correctionFactor = 1.0;
  if (!isnan(temperature) && !isnan(humidity)) {
    correctionFactor = (temperature / 20.0) * (humidity / 65.0);
  }

  float ppm = MQ135.readSensor() * correctionFactor;
  String severity = getSeverity(ppm);
  String color    = getSeverityColor(ppm);

  // ─── READ GPS ────────────────────────────────
  float latitude  = 0.0;
  float longitude = 0.0;
  bool  gpsValid  = false;

  unsigned long gpsStart = millis();
  while (millis() - gpsStart < 2000) {
    while (GPSSerial.available() > 0) {
      gps.encode(GPSSerial.read());
    }
    if (gps.location.isValid()) {
      latitude  = gps.location.lat();
      longitude = gps.location.lng();
      gpsValid  = true;
      break;
    }
  }

  // ─── PRINT TO SERIAL MONITOR ─────────────────
  Serial.println("================================");
  Serial.print("Temperature : "); Serial.print(temperature); Serial.println(" °C");
  Serial.print("Humidity    : "); Serial.print(humidity);    Serial.println(" %");
  Serial.print("Gas PPM     : "); Serial.println(ppm);
  Serial.print("Severity    : "); Serial.println(severity);
  Serial.print("Latitude    : "); Serial.println(latitude,  6);
  Serial.print("Longitude   : "); Serial.println(longitude, 6);
  Serial.println("================================");

  // ─── SEND TO BACKEND ─────────────────────────
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(SERVER_URL);
    http.addHeader("Content-Type", "application/json");

    String jsonPayload = "{";
    jsonPayload += "\"node_id\":\"node-01\",";
    jsonPayload += "\"temperature\":" + String(temperature) + ",";
    jsonPayload += "\"humidity\":"    + String(humidity)    + ",";
    jsonPayload += "\"gas_ppm\":"     + String(ppm)         + ",";
    jsonPayload += "\"severity\":\""  + severity            + "\",";
    jsonPayload += "\"color\":\""     + color               + "\",";
    jsonPayload += "\"latitude\":"    + String(latitude, 6) + ",";
    jsonPayload += "\"longitude\":"   + String(longitude,6) + ",";
    jsonPayload += "\"gps_valid\":"   + String(gpsValid ? "true" : "false");
    jsonPayload += "}";

    Serial.println("Sending: " + jsonPayload);

    int responseCode = http.POST(jsonPayload);
    Serial.print("Server response: ");
    Serial.println(responseCode);

    http.end();
  } else {
    Serial.println("WiFi disconnected, skipping send");
  }

  // wait 5 minutes before next reading
  delay(300000);
}