#include <Arduino_LPS22HB.h>

void setup() {
    Serial.begin(9600);
    while (!Serial);
    if (!BARO.begin()) {
        Serial.println("Failed to initialize pressure sensor!");
        while (1);
    }
}
void loop() {
    float pressure = BARO.readPressure();
    Serial.println(pressure);
    delay(1000);
}
