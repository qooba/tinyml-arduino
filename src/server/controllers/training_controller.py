import os
import json
import sys
import logging
from services.training import TrainingService
from controllers.controller import routes, Controller
from di import IFactory
from aiohttp import web
from workers.workers import IWorker
from services.ws import WebSocketManager

class TrainingController(Controller):
    def __init__(self, training_service: TrainingService, factory: IFactory, socket_manager: WebSocketManager):
        super().__init__()
        self.training_service=training_service
        self.factory=factory
        self.socket_manager=socket_manager

    @routes.get("/api/training/send")
    async def send(self, request):
        data={'hello':'world'}
        await self.socket_manager.send(json.dumps(data))
        return self.json(data)


    @routes.get("/api/training")
    async def list_trainings(self, request):
        trainings_info=self.training_service.list_trainings()
        return self.json(trainings_info)

    @routes.put("/api/training/{package}")
    async def upload_package(self, request):
        post = await request.post()
        package_file = post.get('file').file.read()
        package = request.match_info['package']
        with open(f'/deepmicroscopy/{package}.zip','wb') as f:
            f.write(package_file)

        worker=self.factory.create(IWorker,'training_worker')
        msg=json.dumps({'package': package})
        worker.send(msg)

        return self.json({'status':'ok'})


