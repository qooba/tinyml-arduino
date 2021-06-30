#!/bin/bash

jupyter notebook --notebook-dir=/server --ip=0.0.0.0 --no-browser --port=8888 --NotebookApp.token='' --NotebookApp.password='' --NotebookApp.allow_origin='*' --allow-root
