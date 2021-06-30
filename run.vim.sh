#!/bin/bash

#docker run -it -p 8888:8888 --device=/dev/ttyACM0:/dev/ttyACM0 -v $PWD/arduino-cli:/arduino-cli -v $(pwd)/notebooks:/opt/notebooks -w /arduino-cli qooba/arduino jupyter lab --notebook-dir=/opt/notebooks --ip='0.0.0.0' --port=8888 --no-browser --allow-root --NotebookApp.password='' --NotebookApp.token=''
#/bin/bash

docker run --name miniconda3_bash -it --rm -v $(pwd)/src:/src -w /src qooba/tinyml-arduino:vim  /bin/bash

#docker run --name miniconda3_bash -it --rm -v /home/qba/Qooba:/qooba  qooba/miniconda3 /bin/bash
