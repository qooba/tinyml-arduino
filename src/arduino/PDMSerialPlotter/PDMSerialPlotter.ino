/*
  This example reads audio data from the on-board PDM microphones, and prints
  out the samples to the Serial console. The Serial Plotter built into the
  Arduino IDE can be used to plot the audio data (Tools -> Serial Plotter)

  Circuit:
  - Arduino Nano 33 BLE board, or
  - Arduino Nano RP2040 Connect, or
  - Arduino Portenta H7 board plus Portenta Vision Shield

  This example code is in the public domain.
*/

#include <math.h>
#include <PDM.h>

#define SERIAL_BAUD_RATE 115200

// default number of output channels
static const char channels = 1;

// default PCM output frequency
static const int frequency = 16000;

// Buffer to read samples into, each sample is 16-bits
short sampleBuffer[512];

// Number of audio samples read
volatile int samplesRead;

volatile double rms;

void setup() {
  Serial.begin(SERIAL_BAUD_RATE);
  while (!Serial);

  // Configure the data receive callback
  PDM.onReceive(onPDMdata);

  // Optionally set the gain
  // Defaults to 20 on the BLE Sense and -10 on the Portenta Vision Shield
  // PDM.setGain(30);

  // Initialize PDM with:
  // - one channel (mono mode)
  // - a 16 kHz sample rate for the Arduino Nano 33 BLE Sense
  // - a 32 kHz or 64 kHz sample rate for the Arduino Portenta Vision Shield
  if (!PDM.begin(channels, frequency)) {
    Serial.println("Failed to start PDM!");
    while (1);
  }

  pinMode(LED_BUILTIN, OUTPUT);

  // wait 1 second to avoid initial PDM reading
  delay(900);
  digitalWrite(LED_BUILTIN, HIGH);
  delay(100);
  digitalWrite(LED_BUILTIN, LOW);

}

void loop() {
  // Wait for samples to be read
  if (samplesRead) {

    // Print samples to the serial monitor or plotter

    //Serial.print("[");
    for (int i = 0; i < samplesRead; i++) {
      if(channels == 2) {
        //Serial.print("L:");
        Serial.print(sampleBuffer[i]);
        //Serial.print(", ");
        //Serial.print(" R:");
        i++;
      }
      Serial.println(sampleBuffer[i]);
      //Serial.print(", ");
    }
    //Serial.println("],");

    // Clear the read count
    samplesRead = 0;

    //for (unsigned short i = 0; i < 10; i++) Serial.println(0);
    //delay(900);
    //digitalWrite(LED_BUILTIN, HIGH);
    //delay(100);
    //digitalWrite(LED_BUILTIN, LOW);

  }
}

/**
 * Callback function to process the data from the PDM microphone.
 * NOTE: This callback is executed as part of an ISR.
 * Therefore using `Serial` to print messages inside this function isn't supported.
 * */
void onPDMdata() {
  // Query the number of available bytes
  int bytesAvailable = PDM.available();

  // Read into the sample buffer
  PDM.read(sampleBuffer, bytesAvailable);

  // 16-bit, 2 bytes per sample
  samplesRead = bytesAvailable / 2;

  unsigned int sum = 0;
  for (unsigned short i = 0; i < (bytesAvailable); i++) sum += pow(sampleBuffer[i], 2);
  rms = sqrt(double(sum) / (double(bytesAvailable)));
}

