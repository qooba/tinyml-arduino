import os
import json
import sys
import logging
from controllers.controller import routes, Controller
from di import IFactory
from aiohttp import web
from workers.workers import IWorker
from services.ws import WebSocketManager

class SerialController(Controller):
    def __init__(self, factory: IFactory, socket_manager: WebSocketManager):
        super().__init__()
        self.factory=factory
        self.socket_manager=socket_manager

    @routes.get("/api/serial/{total_samples}/{label}")
    async def collect(self, request):
        total_samples = request.match_info['total_samples']
        label = request.match_info['label']
        worker=self.factory.create(IWorker,'serial_worker')
        msg=json.dumps({'total_samples': total_samples, 'label': label})
        worker.send(msg)
        return self.json({'status':'ok'})

    @routes.get("/api/serial/close")
    async def close(self, request):
        await self.socket_manager.close_all()
        return self.json({'status':'ok'})

