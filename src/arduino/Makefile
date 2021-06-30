
CLI = arduino-cli

COMPILE = ${CLI} compile --fqbn arduino:mbed_nano:nano33ble

UPLOAD = ${CLI} upload -p /dev/ttyACM0 --fqbn arduino:mbed_nano:nano33ble

################ RGB ##################
rgb: rgb-compile rgb-upload

rgb-compile:
	@echo "COMPILE RGB"
	cd rgb
	$(COMPILE) rgb
	cd ..
	
rgb-upload:
	@echo "UPLOAD RGB"
	cd rgb
	$(UPLOAD) rgb
	cd ..
#######################################
################# PDM #################
pdm: pdm-compile pdm-upload

pdm-compile:
	@echo "COMPILE PDM"
	cd pdm
	$(COMPILE) pdm
	cd ..
	
pdm-upload:
	@echo "UPLOAD PDM"
	cd pdm
	$(UPLOAD) pdm
	cd ..
#######################################
############# TEMPERATURE #############
temperature: temperature-compile temperature-upload

temperature-compile:
	@echo "COMPILE TEMPERATURE"
	cd temperature
	$(COMPILE) temperature
	cd ..
	
temperature-upload:
	@echo "UPLOAD TEMPERATURE"
	cd temperature
	$(UPLOAD) temperature
	cd ..
#######################################
############## PRESSURE ###############
pressure: pressure-compile pressure-upload

pressure-compile:
	@echo "COMPILE PRESSURE"
	cd pressure
	$(COMPILE) pressure
	cd ..
	
pressure-upload:
	@echo "UPLOAD PRESSURE"
	cd pressure
	$(UPLOAD) pressure
	cd ..
#######################################
############# MAGNETOMETER ############
magnetometer: magnetometer-compile magnetometer-upload

magnetometer-compile:
	@echo "COMPILE MAGNETOMETER"
	cd magnetometer
	$(COMPILE) magnetometer
	cd ..
	
magnetometer-upload:
	@echo "UPLOAD MAGNETOMETER"
	cd magnetometer
	$(UPLOAD) magnetometer
	cd ..
#######################################
############## GYROSCOPE ##############
gyroscope: gyroscope-compile gyroscope-upload

gyroscope-compile:
	@echo "COMPILE GYROSCOPE"
	cd gyroscope
	$(COMPILE) gyroscope
	cd ..
	
gyroscope-upload:
	@echo "UPLOAD GYROSCOPE"
	cd gyroscope
	$(UPLOAD) gyroscope
	cd ..
#######################################
############ ACCELEROMETER ############
accelerometer: accelerometer-compile accelerometer-upload

accelerometer-compile:
	@echo "COMPILE ACCELEROMETER"
	cd accelerometer
	$(COMPILE) accelerometer
	cd ..
	
accelerometer-upload:
	@echo "UPLOAD ACCELEROMETER"
	cd accelerometer
	$(UPLOAD) accelerometer
	cd ..
#######################################
######### OBJECT COLOR CAPTURE ########
objectcolorcapture: objectcolorcapture-compile objectcolorcapture-upload

objectcolorcapture-compile:
	@echo "COMPILE OBJECT COLOR CAPTURE"
	cd object_color_capture
	$(COMPILE) object_color_capture
	cd ..
	
objectcolorcapture-upload:
	@echo "UPLOAD OBJECT COLOR CAPTURE"
	cd object_color_capture
	$(UPLOAD) object_color_capture
	cd ..
#######################################
######### OBJECT COLOR CLASIFIER ########
objectcolorclassifier: objectcolorclassifier-compile objectcolorclassifier-upload

objectcolorclassifier-compile:
	@echo "COMPILE OBJECT COLOR CLASSIFIER"
	cd object_color_classifier
	$(COMPILE) object_color_classifier
	cd ..
	
objectcolorclassifier-upload:
	@echo "UPLOAD OBJECT COLOR CLASSIFIER"
	cd object_color_classifier
	$(UPLOAD) object_color_classifier
	cd ..
#######################################
