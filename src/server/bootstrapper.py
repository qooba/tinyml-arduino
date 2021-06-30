import di
from typing import Callable
from functools import lru_cache
#from services.training import TrainingService
from controllers.controller import IController
from controllers.serial_controller import SerialController
from controllers.arduino_controller import ArduinoController
from workers.workers import IWorker, TrainingWorker, SerialWorker, ArduinoWorker
from services.ws import WebSocketManager

class Bootstapper:

    def bootstrap(self):
        c = Bootstapper.container()
        c.register_instance(di.IContainer, c)
        c.register_instance(di.IFactory, di.Factory(c))

        # services
        #c.register_singleton(TrainingService)
        c.register_singleton(WebSocketManager)

        # controllers
        c.register(IController, SerialController, "serial")
        c.register(IController, ArduinoController, "arduino")

        # workers
        c.register_singleton(IWorker, SerialWorker, 'serial_worker')
        c.register_singleton(IWorker, ArduinoWorker, 'arduino_worker')

        return c



    @staticmethod
    @lru_cache()
    def container():
        return di.Container()
