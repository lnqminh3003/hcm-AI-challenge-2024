import os
import cv2
import multiprocessing
from tqdm.contrib.concurrent import thread_map

# Input folder containing videos
input_folder = "./raw/vids/video"

# Output folder for extracted frames
output_folder = "./raw/frames/"

# Create the output folder if it doesn't exist
if not os.path.exists(output_folder):
    os.makedirs(output_folder)


def extract_frames(video_path):
    # Open the video file
    cap = cv2.VideoCapture(video_path)

    # Get the total number of frames
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

    filename = video_path.split("/")[-1].split(".")[0]


    # Create the output folder if it doesn't exist
    video_frame_folder_path = os.path.join(output_folder, filename)
    if not os.path.exists(video_frame_folder_path):
        os.makedirs(video_frame_folder_path)

    # Loop through each frame
    for frame_number in range(0, total_frames):
        ret, frame = cap.read()
        if not ret:
            break

        if frame_number % 25 != 0:
            continue

        # Save the frame with frame number in the filename
        frame_filename = os.path.join(video_frame_folder_path, f"{frame_number}.jpg")
        cv2.imwrite(frame_filename, frame)

    # Release the video capture object
    cap.release()


if __name__ == "__main__":
    files = []
    # List all files in the input folder
    for filename in os.listdir(input_folder):
        if filename.endswith(".mp4") or filename.endswith(
            ".avi"
        ):
            video_path = os.path.join(
                input_folder, filename
            )

            files.append(video_path)

    cores = multiprocessing.cpu_count()

    print("Run with {} workers".format(cores))

    thread_map(extract_frames, files, max_workers=cores * 2)

    print("Frame extraction complete.")
