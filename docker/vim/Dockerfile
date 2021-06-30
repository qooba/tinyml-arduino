FROM continuumio/miniconda3
#RUN apt update && apt install curl git tmux -yq 
RUN apt update && apt install curl git cmake ack g++ python3-dev vim-youcompleteme tmux -yq
RUN sh -c "$(curl -fsSL https://raw.githubusercontent.com/qooba/vim-python-ide/master/setup.sh)"
RUN conda install jupyterlab -c conda-forge
RUN pip install nbdev
RUN echo "alias ls='ls --color=auto'" >> /root/.bashrc

RUN pip install fastapi jupyterlab pyserial qdi uvicorn jinja2 aiofiles python-multipart
ENV PYTHONPATH="/app:${PYTHONPATH}"

CMD bin/bash
