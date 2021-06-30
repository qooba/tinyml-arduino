#!/bin/bash

#docker network create -d bridge app_default

docker run -it --rm -p 8888:8888 --network app_default --name arduino --device=/dev/ttyACM0:/dev/ttyACM0 -v $(pwd)/src/arduino:/arduino -v $(pwd)/src/server:/server qooba/tinyml-arduino:lab /bin/bash


