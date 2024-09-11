import pickle
import os
import numpy as np
import numpy as np
from tqdm import tqdm
import copy
from transformers import CLIPProcessor, CLIPModel


class Plato:
    def __init__(self, dataset):
        if dataset == None:
            raise exit
        self.dataset = []
        print("Converting dataset")
        for sample in tqdm(dataset):
            dict_sample = {
                "video": sample["video"],
                "filepath": sample["filepath"],
                "mapped_frameid": sample["frameid"],
                "clip_embedding": sample["clip_embedding"],
                "frameid": sample["frameid"],
                "youtube_url": sample["youtube_url"],
            }
            self.dataset.append(dict_sample)

        print("Concat embedding array into a big array")
        self.stack_vector = []
        npy_dir = f"./feature/"
        for file in sorted(
            os.listdir("./feature/"),
            key=lambda x: (
                x[:8],
                int(x.split("_")[-1][:-4]),
            ),
        ):
            file_path = os.path.join(npy_dir, file)
            clip_embedding = np.load(file_path)
            self.stack_vector.append(clip_embedding)
        self.stack_vector = np.vstack(self.stack_vector)
        self.model, self.processor = self._load_model()

    def _load_model(self):
        # option 16 32-not suitable
        model = CLIPModel.from_pretrained(
            "openai/clip-vit-base-patch16"
        )
        processor = CLIPProcessor.from_pretrained(
            "openai/clip-vit-base-patch16"
        )
        return model, processor

    def featurize_text(self, text):
        inputs = self.processor(
            text=text, return_tensors="pt", padding=True
        )
        text_feature = self.model.get_text_features(
            **inputs
        )
        text_feature = text_feature.detach().numpy()
        return text_feature

    def predict(self, text_features, top=1000):
        text_features = self.featurize_text(text_features)
        vector_dataset = self.stack_vector @ text_features.T
        vector_dataset = np.argsort(
            vector_dataset.squeeze()
        )[-top:][::-1].tolist()

        ignored_videos = ['L18_V006', 'L19_V048',  'L20_V010', 'L22_V023', 'L22_V024', 'L35_V005']

        return [
            {
                "frameid": self.dataset[i]["frameid"],
                "video": self.dataset[i]["video"],
                "youtube_url": self.dataset[i][
                    "youtube_url"
                ],
            }
            for i in vector_dataset if self.dataset[i]["video"] not in ignored_videos
        ]

    def batch_ranking(self, queries):
        result = []
        for i, query in enumerate(queries):
            print(f"Processing query {i+1} ...")
            result.append(self.predict(query))
        return result

    def predict_csv(self, query_dir):
        queries = []
        with open(query_dir, "r") as f:
            for line in f:
                queries.append(line.strip())
        return self.batch_ranking(queries)

    ################################## Customize
    def filter_vid(self, res):
        dic = {}
        new_arr = []
        for i in range(1000):
            vid = res[i]["video"]
            if vid not in dic:
                dic[vid] = 0
            dic[vid] += 1
            if dic[vid] <= 1:
                new_arr.append(res[i])
        return np.asarray(new_arr)

    ############################################

    def save(self, path):
        pickle.dump(self, open(path, "wb"))

    @staticmethod
    def load(path):
        return pickle.load(open(path, "rb"))
