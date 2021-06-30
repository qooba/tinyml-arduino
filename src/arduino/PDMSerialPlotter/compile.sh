#!/bin/bash

#pip install pyserial

arduino-cli compile --fqbn arduino:mbed_nano:nano33ble PDMSerialPlotter

# chmod 666 /dev/ttyACM0
# stty -F /dev/ttyACM0 speed 1200 cs8 -cstopb -parenb

arduino-cli upload -p /dev/ttyACM0 --fqbn arduino:mbed_nano:nano33ble PDMSerialPlotter

# cat /dev/ttyACM0
