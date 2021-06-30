import os

class TrainingService:
    def __init__(self): ...


    def list_trainings(self):
        trainings_info=[]
        for package in os.listdir('/deepmicroscopy'):
            if not os.path.isfile(f'/deepmicroscopy/{package}'):
                trainings_info.append({
                    'name': package,
                })

        return trainings_info

    def start_training(self, package: str ='1111111', num_steps: int = 1000, selected_model: str = 'ssd_mobilenet_v2', batch_size: int = 8): ...


