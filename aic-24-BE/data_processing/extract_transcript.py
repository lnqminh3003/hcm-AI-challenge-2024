from multiprocessing import Pool
from subprocess import call
from tqdm import tqdm
import json
import os
import torch
import whisper

import torch.multiprocessing as mp

input_folder = "./raw/sounds"
output_folder = "./raw/transcript"

# Create the output folder if it doesn't exist
if not os.path.exists(output_folder):
    os.makedirs(output_folder)

device = "cuda" if torch.cuda.is_available() else "cpu"
model = whisper.load_model("large", device)

def inference_and_save(model, input_path, output_path):
    # input_path, output_path = paths
    result = model.transcribe(input_path)

    with open(output_path, "w+") as f:
        json.dump(result, f, indent = 6, ensure_ascii=False)


if __name__ == "__main__":

    paths = []

    processes = []
    counter = 0
    for root, _, files in os.walk(input_folder):
        for filename in tqdm(files):
            input_path = os.path.join(root, filename)
            output_path = os.path.join(
                output_folder,
                filename,
            ).replace(".mp3", ".json")

            index = int(input_path.split("/")[-1][1:3])
            if index < 21:
                continue
             
            print(index)
            inference_and_save((input_path, output_path))
            # paths.append((input_path, output_path))


    # pool = Pool(processes=22)
    # pool.map(inference_and_save, paths , 1) # Ensure the chunk size is 1
    # pool.close()
    # pool.join()
