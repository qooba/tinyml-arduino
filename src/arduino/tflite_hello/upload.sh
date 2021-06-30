#!/bin/bash

arduino-cli upload -p /dev/ttyACM0 --fqbn arduino:mbed_nano:nano33ble tflite_hello
