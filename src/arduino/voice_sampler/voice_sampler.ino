/*
 * Voice sampler for Arduino Nano 33 BLE Sense by Alan Wang
 */

#include <math.h>
#include <PDM.h>
#include <arduinoFFT.h>

#define PDM_SOUND_GAIN    30     // sound gain of PDM mic
#define PDM_BUFFER_SIZE   256    // buffer size of PDM mic

#define SAMPLE_THRESHOLD  900   // RMS threshold to trigger sampling
#define FEATURE_SIZE      32     // sampling size of one voice instance
#define SAMPLE_DELAY      20     // delay time (ms) between sampling

#define CHANNELS 1

// default PCM output frequency
#define FREQUENCY 16000
#define SERIAL_BAUD_RATE 115200

double vReal[PDM_BUFFER_SIZE];
double vImag[PDM_BUFFER_SIZE];

double feature_data[FEATURE_SIZE];
double fft_feature_data[FEATURE_SIZE];
volatile double rms;
unsigned int total_counter = 0;

short sample_buffer[PDM_BUFFER_SIZE];
arduinoFFT FFT = arduinoFFT();

// callback function for PDM mic
void onPDMdata() {
  rms = -1;

  int bytes_available = PDM.available();
  PDM.read(sample_buffer, bytes_available);

  // calculate RMS (root mean square) from sample_buffer
  // divided by 2 because PCM has 2 channels :)
  if (CHANNELS == 1) {
    bytes_available = bytes_available / 2;
  }

  unsigned int sum = 0;
  for (unsigned short i = 0; i < (bytes_available); i++) sum += pow(sample_buffer[i], 2);
  rms = sqrt(double(sum) / (double(bytes_available)));
}


void setup() {

  Serial.begin(SERIAL_BAUD_RATE);
  while (!Serial);

  PDM.onReceive(onPDMdata);
  PDM.setBufferSize(PDM_BUFFER_SIZE);
  PDM.setGain(PDM_SOUND_GAIN);

  if (!PDM.begin(1, FREQUENCY)) {  // start PDM mic and sampling at 16 KHz
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
  // waiting until sampling triggered
  while (rms < SAMPLE_THRESHOLD);




  digitalWrite(LED_BUILTIN, HIGH);
  for (unsigned short i = 0; i < FEATURE_SIZE; i++) {  // sampling
    while (rms < 0);
    feature_data[i] = rms;
    for (int i = 0; i < PDM_BUFFER_SIZE; i++) {
      vReal[i] = sample_buffer[i];
      vImag[i] = 0;
    }


    FFT.Windowing(vReal, PDM_BUFFER_SIZE, FFT_WIN_TYP_HAMMING, FFT_FORWARD);
    FFT.Compute(vReal, vImag, PDM_BUFFER_SIZE, FFT_FORWARD);
    FFT.ComplexToMagnitude(vReal, vImag, PDM_BUFFER_SIZE);
    double peak = FFT.MajorPeak(vReal, PDM_BUFFER_SIZE, FREQUENCY);

    fft_feature_data[i] = peak;

    delay(SAMPLE_DELAY);
  }
  digitalWrite(LED_BUILTIN, LOW);

  // pring out sampling data
  Serial.print("[");
  for (unsigned short i = 0; i < FEATURE_SIZE; i++) {
    Serial.print("{\"rms\":"+String(feature_data[i])+",");
    Serial.print("\"fft\":"+String(fft_feature_data[i])+"}");
    if(i<FEATURE_SIZE-1) {
      Serial.print(", ");
    }
  }

  Serial.println("]");

  // wait for 1 second after one sampling
  delay(900);
  digitalWrite(LED_BUILTIN, HIGH);
  delay(100);
  digitalWrite(LED_BUILTIN, LOW);
}
