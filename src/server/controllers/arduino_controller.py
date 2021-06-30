import os
import json
import sys
import logging
from controllers.controller import routes, Controller
from di import IFactory
from aiohttp import web
from workers.workers import IWorker
from services.ws import WebSocketManager

class ArduinoController(Controller):
    def __init__(self, factory: IFactory, socket_manager: WebSocketManager):
        super().__init__()
        self.factory=factory
        self.socket_manager=socket_manager

    @routes.get("/api/arduino/{feature}")
    async def feature(self, request):
        feature = request.match_info['feature']
        worker=self.factory.create(IWorker,'arduino_worker')
        if feature not in ['gyroscope','magnetometer','pdm','pressure','rgb','temperature','accelerometer','gyroscope','magnetometer','objectcolorcapture','objectcolorclassify']:
            raise ValueError(f'No such feature: {feature}')

        msg=json.dumps({'feature': feature})
        worker.send(msg)
        return self.json({'status':'ok'})

    @routes.post("/api/arduino/tinyml")
    async def tinyml(self, request):
        post = await request.post()
        package_file = post.get('file').file.read()
        with open(f'/arduino/object_color_classifier/model.h','wb') as f:
            f.write(package_file)

        worker=self.factory.create(IWorker,'arduino_worker')
        msg=json.dumps({'feature': 'objectcolorclassifier'})
        worker.send(msg)
        return self.json({'status':'ok'})

