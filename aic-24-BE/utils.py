import re
import numpy as np

import json
import os
from fuzzywuzzy import process
from unidecode import unidecode

import datetime
import pytz


def get_key_frame(model, video, keyframe):
    for sample in model.dataset:
        if (
            sample["video"] == video
            and sample["frameid"] == keyframe
        ):
            return (
                sample["mapped_frameid"],
                sample["youtube_url"],
            )

    return "undifined", "undifined"


def extract_query(text: str):
    matches = re.findall("([\w\s]+)\s+\$(\d+)", text)
    x = [x[0] for x in matches]
    y = np.array(
        [
            float(y[1] if y[1] != "0" else "0.1")
            for y in matches
        ]
    )
    y = y / y.sum()

    return [(xx, yy) for xx, yy in zip(x, y)]


def shift(arr, num, fill_value=np.nan):
    result = np.empty_like(arr)
    if num > 0:
        result[:num] = fill_value
        result[num:] = arr[:-num]
    elif num < 0:
        result[num:] = fill_value
        result[:num] = arr[-num:]
    else:
        result[:] = arr
    return result


# ASR fuzzy search
def load_json(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        return json.load(f)


def get_segments(file_path):
    data = load_json(file_path)
    return data["segments"]


def fuzzy_search(query, files, top):
    matches = []

    for file_path in files:
        segments = get_segments(file_path)
        for segment in segments:
            text = segment["text"]
            ratio = process.extractOne(query, [text])[1]
            matches.append(
                [
                    file_path[-13:-5],
                    text,
                    ratio,
                    segment["start"],
                    segment["end"],
                ]
            )

    return sorted(
        matches, key=lambda x: x[2], reverse=True
    )[:top]


def get_result_fuzzy_search(
    directory="./transcript", query="", top=40
):
    files = [
        os.path.join(directory, file)
        for file in os.listdir(directory)
        if file.endswith(".json")
    ]

    matches = fuzzy_search(query, files, top)

    # for match in matches:
    #     print(f"Video: {match[0]}, Text: {match[1]}, Start: {match[3]}, End: {match[4]}")
    return matches


def get_utube_link(model, video, timeStart):
    for sample in model.dataset:
        if sample["video"] == video:
            return (
                sample["youtube_url"].split("&")[0]
                + "&t="
                + str(int(timeStart))
            )

    return "undifined"


# Full text search with OR
def normalize_text(text):
    return unidecode(text).lower()


def search_sub_query(sub_query, files):
    matches = []
    norm_sub_query = normalize_text(sub_query)

    for file_path in files:
        segments = get_segments(file_path)
        for segment in segments:
            text = segment["text"]
            norm_text = normalize_text(text)
            if re.search(norm_sub_query, norm_text):
                matches.append(
                    [
                        file_path[-13:-5],
                        text,
                        segment["start"],
                        segment["end"],
                    ]
                )

    return matches


def fulltext_search(
    directory="./transcript", query="", top=None
):
    files = [
        os.path.join(directory, file)
        for file in os.listdir(directory)
        if file.endswith(".json")
    ]
    sub_queries = query.split(" OR ")
    matches = []

    for sub_query in sub_queries:
        matches.extend(search_sub_query(sub_query, files))

    # for match in matches:
    #     print(f"Video: {match[0]}, Text: {match[1]}, Start: {match[2]}, End: {match[3]}")

    if top:
        return matches[:top]
    return matches


HCM_tz = pytz.timezone("Asia/Ho_Chi_Minh")


def print_log(text, file_path):
    cur_time = datetime.datetime.now(HCM_tz)
    try:
        with open(file_path, "a") as f:
            f.write(
                cur_time.strftime("%Y-%m-%d %H:%M:%S")
                + " -> "
                + text
                + "\n"
            )
        print(f"Write to {file_path} successfully")

    except Exception as e:
        print("Write file error:", str(e))


if __name__ == "__main__":
    test_string = "first sentence $10 second sentence $0"
    print(extract_query(test_string))

    a = np.random.rand(3, 1)

    print(a)
    print(shift(a, -1, 0.0))
    print(a + a)
