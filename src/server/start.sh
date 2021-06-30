#!/bin/bash

watchmedo auto-restart -d . -p '*.py' --recursive -- python3 arduino.py
