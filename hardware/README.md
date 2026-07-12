# Hardware — Pollution Sensor Node

## Components

- ESP32 DEVKIT
- MQ135 Gas Sensor
- DHT22 Temperature and Humidity Sensor
- NEO-6M GPS Module
- Power Bank (demo) / Solar + TP4056 + 18650 (deployment)

## Pin Connections

- MQ135 OUT → GPIO34
- DHT22 DATA → GPIO4
- GPS TXD → GPIO21 (RX2)
- GPS RXD → GPIO22 (TX2)

## Libraries Required

- DHT sensor library by Adafruit
- MQUnifiedsensor by Miguel Califa
- TinyGPSPlus by Mikal Hart

## Setup

1. Install libraries in Arduino IDE
2. Set your WiFi SSID and password
3. Set your backend SERVER_URL
4. Upload to ESP32
