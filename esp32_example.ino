#include <WiFi.h>
#include <HTTPClient.h>

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

const char* apiUrl = "http://YOUR_SERVER_IP:5000/api/data";
const char* deviceId = "esp32-001";
const char* deviceKey = "YOUR_THINGSPEAK_WRITE_KEY";

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("Connected");
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(apiUrl);
    http.addHeader("Content-Type", "application/json");
    http.addHeader("x-device-key", deviceKey);

    float voltage = 230.5;
    float current = 4.9;
    float power = voltage * current;
    float energy = 15.7;
    float temperature = 41.2;

    String payload = String("{") +
      "\"deviceId\":\"" + deviceId + "\"," +
      "\"voltage\":" + String(voltage, 2) + "," +
      "\"current\":" + String(current, 2) + "," +
      "\"power\":" + String(power, 2) + "," +
      "\"energy\":" + String(energy, 2) + "," +
      "\"temperature\":" + String(temperature, 2) + "," +
      "\"timestamp\":\"2026-02-12T08:30:00Z\"" +
      "}";

    int httpCode = http.POST(payload);
    Serial.printf("HTTP Response code: %d\n", httpCode);
    http.end();
  }

  delay(5000);
}
