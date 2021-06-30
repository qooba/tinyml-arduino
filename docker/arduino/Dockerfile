FROM arduino/arduino-cli:builder-1
RUN curl -fsSL https://raw.githubusercontent.com/arduino/arduino-cli/master/install.sh | BINDIR=/usr/local/bin sh
RUN apt update && apt install vim -yq
RUN arduino-cli core update-index
RUN arduino-cli core install arduino:mbed_nano

ENV DEBIAN_FRONTEND=noninteractive
RUN apt update && apt install curl git cmake ack-grep g++ python3-dev vim-youcompleteme tmux -yq
RUN apt install python3-pip -yq

ENV LANG=C.UTF-8 LC_ALL=C.UTF-8

RUN apt-get update -q && \
    apt-get install -q -y --no-install-recommends \
        bzip2 \
        ca-certificates \
        git \
        libglib2.0-0 \
        libsm6 \
        libxext6 \
        libxrender1 \
        mercurial \
        subversion \
        wget \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

ENV PATH /opt/conda/bin:$PATH

ARG CONDA_VERSION=py38_4.9.2
ARG CONDA_MD5=122c8c9beb51e124ab32a0fa6426c656

RUN wget --quiet https://repo.anaconda.com/miniconda/Miniconda3-${CONDA_VERSION}-Linux-x86_64.sh -O miniconda.sh && \
    echo "${CONDA_MD5}  miniconda.sh" > miniconda.md5 && \
    if ! md5sum --status -c miniconda.md5; then exit 1; fi && \
    mkdir -p /opt && \
    sh miniconda.sh -b -p /opt/conda && \
    rm miniconda.sh miniconda.md5 && \
    ln -s /opt/conda/etc/profile.d/conda.sh /etc/profile.d/conda.sh && \
    echo ". /opt/conda/etc/profile.d/conda.sh" >> ~/.bashrc && \
    echo "conda activate base" >> ~/.bashrc && \
    find /opt/conda/ -follow -type f -name '*.a' -delete && \
    find /opt/conda/ -follow -type f -name '*.js.map' -delete && \
    /opt/conda/bin/conda clean -afy


RUN pip3 install jupyterlab pyserial qdi aiohttp==3.6.2 minio==5.0.7 jinja2==2.11.1 cachetools==4.0.0 pyyaml==5.3 watchdog[watchmedo] aiohttp_cors==0.7.0 ujson==1.35
RUN arduino-cli lib install Arduino_TensorFlowLite
RUN conda install scikit-learn matplotlib numpy tensorflow
RUN pip3 install tinymlgen
RUN arduino-cli lib install Arduino_APDS9960 Arduino_HTS221 Arduino_LPS22HB Arduino_LSM9DS1 arduinoFFT
RUN pip3 install async-timeout
ENV PYTHONPATH="/app:${PYTHONPATH}"
WORKDIR /server/
CMD watchmedo auto-restart -d . -p '*.py' --recursive python3 arduino.py
#CMD ["/bin/bash","-c", "jupyter lab --notebook-dir=/opt/notebooks --ip='0.0.0.0' --port=8888 --no-browser --allow-root --NotebookApp.password='' --NotebookApp.token=''"]`

