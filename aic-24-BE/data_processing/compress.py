import os
from PIL import Image
import multiprocessing
from tqdm.contrib.concurrent import thread_map

input_folder = "./raw/frames/"

output_folder = "./raw/compressed/"

# Create the output folder if it doesn't exist
if not os.path.exists(output_folder):
    os.makedirs(output_folder)


def resize_and_save(argument):
    (input_path, output_path) = argument
    new_width = 600
    try:
        with Image.open(input_path) as img:
            width_percent = new_width / float(img.size[0])
            new_height = int(
                (float(img.size[1]) * float(width_percent))
            )

            resized_img = img.resize(
                (new_width, new_height),
                Image.Resampling.LANCZOS,
            )

            resized_img.save(output_path)
    except Exception as e:
        print(
            f"Error resizing image {input_path}: {str(e)}"
        )


def process_images(input_folder, output_folder):
    processing_files = []
    for root, _, files in os.walk(input_folder):
        for filename in files:
            input_path = os.path.join(root, filename)
            output_path = os.path.join(
                output_folder,
                os.path.relpath(input_path, input_folder),
            )

            # Create the subdirectory in the output folder if it doesn't exist
            os.makedirs(
                os.path.dirname(output_path), exist_ok=True
            )

            processing_files.append((input_path, output_path))

            # Resize and save the image
            # resize_and_save(
            #     input_path, output_path 
            # )


    cores = multiprocessing.cpu_count()

    thread_map(resize_and_save, processing_files, max_workers=cores)


if __name__ == "__main__":
    process_images(input_folder, output_folder)

    print("Image resizing complete.")
