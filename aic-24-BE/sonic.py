import asyncio
import os
import json

from asonic import Client
from asonic.enums import Channel
from tqdm import tqdm

asr_folder = "./data_processing/raw/transcript/"


async def setup():
    c = Client(
        host="127.0.0.1",
        port=1491,
        password="admin",
        max_connections=100,
    )
    await c.channel(Channel.INGEST)

    files = []
    for file in os.listdir(asr_folder):
        if file.endswith(".json"):
            files.append(file)
    for file in tqdm(files):
        file_path = os.path.join(asr_folder, file)
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)["segments"]

            for segment in data:
                await c.push(
                    collection="asr",
                    bucket="test",
                    obj="{}-{}-{}".format(
                        file.split(".")[0],
                        segment["start"],
                        segment["end"],
                    ),
                    text=segment["text"],
                )


if __name__ == "__main__":
    loop = asyncio.get_event_loop()
    loop.run_until_complete(setup())
