#!/bin/bash

#pip install pyserial

#arduino-cli compile --fqbn arduino:mbed_nano:nano33ble voice_sampler

# chmod 666 /dev/ttyACM0
# stty -F /dev/ttyACM0 speed 1200 cs8 -cstopb -parenb

arduino-cli upload -p /dev/ttyACM0 --fqbn arduino:mbed_nano:nano33ble voice_sampler

# cat /dev/ttyACM0
