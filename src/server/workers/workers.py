import os
import asyncio
import time
import threading
import zmq
import logging
import asyncio
import json
import io
from di import IContainer, IFactory
from services.ws import WebSocketManager
from services.training import TrainingService
import serial
from async_timeout import timeout

class IWorker:
    def work(self) -> None: ...
    def send(self, message: str) -> None: ...

class BaseWorker(IWorker):
    def __init__(self):
        self.sender_context = zmq.Context.instance()
        self.sender = self.sender_context.socket(zmq.PAIR)
        self.sender.connect(self.url)

        self.receiver_context = zmq.Context.instance()
        self.receiver = self.receiver_context.socket(zmq.PAIR)
        self.receiver.bind(self.url)

    async def handle(self, receiver) -> None: ...

    def send(self, message: str):
        self.sender.send(message.encode('utf-8'))

    def work(self) -> None:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        loop.run_until_complete(self.handle(self.receiver))
        loop.close()


    def __enter__(self):
        return self

    def __exit__(self, type, value, traceback):
        self.sender_context.term()
        self.receiver_context.term()
        self._close(manual_close=False)

class TrainingWorker(BaseWorker):
    def __init__(self, container: IContainer, socket_manager: WebSocketManager, training_service: TrainingService):
        self.url="inproc://training_worker"
        super().__init__()
        self.container = container
        self.socket_manager=socket_manager
        self.training_service=training_service

    async def handle(self, receiver) -> None:
        while True:
            msg  = receiver.recv()
            logging.info("Training: [ %s ]" % (msg))
            msg=json.loads(msg)
            self.training_service.start_training(msg['package'])
            await self.socket_manager.send(msg.decode())

class ArduinoWorker(BaseWorker):
    def __init__(self, container: IContainer, socket_manager: WebSocketManager):
        self.url="inproc://arduino_worker"
        super().__init__()
        self.container = container
        self.socket_manager=socket_manager
        self.last_feature=None

    async def handle(self, receiver) -> None:
        while True:
            command_msg = json.loads(receiver.recv())
            print(command_msg)
            try:
                feature = command_msg["feature"]
                if self.last_feature == feature:
                    continue
                else:
                    self.last_feature = feature

                SerialWorker.compilation_pending=True
                print("Compilation start - waiting for serial close")
                #async with timeout(1.5) as cm:
                #c=await receiver.recv_multipart()
                await asyncio.sleep(5)
                print("Compilation start")
                os.system(f"cd /arduino && make {feature}")
                await asyncio.sleep(2)
                SerialWorker.compilation_pending=False
                print("Compilation finished")
                #await self.socket_manager.send(msg)

            except Exception as ex:
                print(ex)
            finally:
                SerialWorker.compilation_pending=False


class SerialWorker(BaseWorker):
    compilation_pending = False
    serial_open = False

    def __init__(self, container: IContainer, factory: IFactory, socket_manager: WebSocketManager):
        self.url="inproc://voice_worker"
        super().__init__()
        self.container = container
        self.socket_manager=socket_manager
        self.arduino_worker=factory.create(IWorker,'arduino_worker')

    async def handle(self, receiver) -> None:
        baud_rate=9600
        ser = serial.Serial("/dev/ttyACM0",baud_rate)
        while True:
            '''
            samples_msg = json.loads(receiver.recv())
            total_samples = int(samples_msg["total_samples"])
            label=samples_msg["label"]
            print(f"Now I will grab samples {total_samples}")
            sample=[]
            for s in range(total_samples):
                cc=str(ser.readline())
                msg=cc[2:][:-5]
                msgs=json.loads(msg)
                sample.append(msgs)
                for m in msgs:
                    await self.socket_manager.send(str(m))

                for i in range(10):
                    m={'rms':0,'fft':0}
                    await self.socket_manager.send(json.dumps(m))

                print(f"Sample {s}")

            with open(f'/tmp/sample_{label}.txt','w') as f:
                f.write(json.dumps(sample))

            print("Samples grabbed :)")
            '''
            if SerialWorker.compilation_pending:
                if ser:
                    ser.close()
                    ser = None
                    print("Serial is closed :)")
                    SerialWorker.serial_open=False
                    self.arduino_worker.send("1")
                await asyncio.sleep(1)
            else:
                if not ser:
                    ser = serial.Serial("/dev/ttyACM0",baud_rate)
                    print("Serial is open :)")
                    SerialWorker.serial_open=True

                cc=str(ser.readline())
                msg=cc[2:][:-5]
                print(msg)
                await self.socket_manager.send(msg)




