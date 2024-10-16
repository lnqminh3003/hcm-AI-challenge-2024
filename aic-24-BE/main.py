from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from asonic import Client
from asonic.enums import Channel
from google.cloud import storage

import os
import json
import pickle
import dill as pickle 

import torch
import utils
import pdb
from nitzche_clip import NitzcheCLIP

bucket_name = 'aic24'
model_file_name = 'clip_vit_h14_nitzche.pkl'



load_dotenv(".env")

app = FastAPI()

origins = ["http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins= origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class CustomUnpickler(pickle.Unpickler):
    def find_class(self, module, name):
        if name == "NitzcheCLIP":
            print("Found Nitzche")
            from nitzche_clip import NitzcheCLIP
            return NitzcheCLIP
        
        return super().find_class(module, name)


@app.on_event("startup")
async def preload_model():
    model_path = os.getenv("MODEL_PATH")

    app.model = {}

    print(
        "model path:",
        os.path.join(model_path, os.getenv("MODEL_16")),
        "rb",
    )
    
    app.model["b16"] = CustomUnpickler(
        open(
            os.path.join(model_path, os.getenv("MODEL_16")),
            "rb",
        )
    ).load()

    c = Client(
        host="127.0.0.1",
        port=1491,
        password="admin",
        max_connections=100,
    )
    await c.channel(Channel.SEARCH)
    app.client = c
    print("Connected to Sonic")
    files = []
    asr_folder = "./data_processing/raw/transcript/"
    app.text_data = {}

    for file in os.listdir(asr_folder):
        if file.endswith(".json"):
            file_path = os.path.join(asr_folder, file)
            vid_id = file.split(".")[0]
            with open(
                file_path, "r", encoding="utf-8"
            ) as f:
                data = json.load(f)["segments"]
                app.text_data[vid_id] = {}

                for segment in data:
                    start = int(
                        float(segment["start"]) * 25
                    )
                    app.text_data[vid_id][start] = segment[
                        "text"
                    ]                  


class Query(BaseModel):
    text: str
    top: int = 100
    model: str = "b16"
    filter_people_mode: str = "off"
    num_people: int = 1
    with_weith: bool = True
    text_gamma: float = (1.0,)
    skip: int = (25,)
    gamma: float = (0.9,)
    decay: float = (0.3,)
    window_size: int = (3,)

class KeyFrame(BaseModel):
    video: str
    keyframe: str


@app.post("/weighted-query")
async def query(query: Query):
    queries = None
    queries = utils.extract_query(query.text)
    result = app.model.predicts(
        queries,
        top=query.top,
        text_gamma=1.0,
        skip=25,
        gamma=0.9,
        decay=0.3,
        window_size=3,
    )

    for index in range(len(result)):
        del result[index]["clip_embedding"]
        del result[index]["filepath"]

    return {"data": result.tolist()}

@app.post("/query")
async def query(query: Query):
    model = app.model[query.model]
    result = model.predict(query.text, query.top)

    return {"data": result}


@app.post("/keyframe")
async def keyframe(keyframe: KeyFrame):
    result = utils.get_key_frame(
        app.model["b16"], keyframe.video, keyframe.keyframe
    )

    return {
        "mappedKeyFrame": result[0],
        "youtubeLink": result[1],
    }


class ASRQuery(BaseModel):
    text: str
    top: int = 40



@app.post("/asr")
async def asrquery(asrquery: ASRQuery):
    results = await app.client.query(
        collection="asr",
        bucket="test",
        terms=asrquery.text,
        limit=asrquery.top,
    )

    res = []
    print(results)
    for r in results:
        result = utils.unicode_string_decompress(''.join([chr(x) for x in r]))
        vid_id, frame_start, fps, prefix, frame_list  = result.split("\t")

        frame_start = int(float(frame_start) * 25)
        # frame_end = int(float(frame_end) * 25)
        # frame_mid = ((frame_start + frame_end) >> 1)
        # frame_mid -= frame_mid % 25

        frame_list = utils.asc_list_decompress(frame_list)

        res.append(
            {
                "text": app.text_data[vid_id][frame_start],
                "video_id": vid_id,
                "start": frame_start,
                "listFrameId" : frame_list,
                "fps": fps,
                "prefix": prefix,
            },
        )

    return res


class Respond(BaseModel):
    text: str


@app.post("/print_log")
async def printLog(respond: Respond):
    utils.print_log(respond.text, "log.txt")


