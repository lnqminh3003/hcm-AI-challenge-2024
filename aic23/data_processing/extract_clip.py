from sklearn import preprocessing
import torch
import clip
from PIL import Image
import numpy as np

import os
from PIL import Image
from tqdm import tqdm
from transformers import CLIPProcessor, CLIPModel

input_folder = "./raw/frames/"

output_folder = "./raw/features-G14/"

device = "cuda" if torch.cuda.is_available() else "cpu"
model = CLIPModel.from_pretrained("laion/CLIP-ViT-bigG-14-laion2B-39B-b160k", device_map=device)
processor = CLIPProcessor.from_pretrained("laion/CLIP-ViT-bigG-14-laion2B-39B-b160k", device_map=device)
model = model.to(device)
 
# model, preprocess = clip.load("ViT-G/14", device=device)

# Create the output folder if it doesn't exist
if not os.path.exists(output_folder):
    os.makedirs(output_folder)


def inference(input_path, output_path):
    # image = (
    #     preprocess(Image.open(input_path))
    #     .unsqueeze(0)
    #     .to(device)
    # )

    with torch.no_grad():
        # image_features = model.encode_image(image)
        image_features = model.get_image_features(
            **processor(
                images=Image.open(input_path),
                return_tensors="pt" 
            ).to(device)
        )

        with open(output_path, "wb") as f:
            np.save(f, image_features.cpu().numpy())


def process_images(input_folder, output_folder):
    for root, _, files in os.walk(input_folder):
        for filename in tqdm(files):
            input_path = os.path.join(root, filename)
            output_path = os.path.join(
                output_folder,
                os.path.relpath(input_path, input_folder),
            ).replace(".jpg", ".npy")

            os.makedirs(
                os.path.dirname(output_path), exist_ok=True
            )


            # index = int(input_path.split("/")[-1][1:3])
            # if index < 21:
            #     continue

            inference(input_path, output_path)


if __name__ == "__main__":
    print("come to here")
    process_images(input_folder, output_folder)
