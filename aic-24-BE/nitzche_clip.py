import os
import numpy as np
import json
import pickle
import torch.nn.functional as F
from open_clip import create_model_from_pretrained, get_tokenizer 
from tqdm import tqdm


class NitzcheCLIP:
    def __init__(self, feature_path):
        self.file_path_list, self.image_feature, self.youtube_link, self.fps = [], [], {}, {}
        for filename in tqdm(sorted(os.listdir(feature_path))):
            filepath = os.path.join(feature_path, filename)
            with open(filepath, "rb") as fp:
                file_path, image_feature = pickle.load(fp)
                
                self.file_path_list.extend(file_path)
                self.image_feature.append(image_feature)
        
        meta_dir = './data/media-info'
        for filename in tqdm(sorted(os.listdir(meta_dir))):
            filepath = os.path.join(meta_dir, filename)
            video_id = filename.split('.')[0]
            with open(filepath, 'r') as file:
                data = json.load(file)
            self.youtube_link[video_id] = data['watch_url']
            self.fps[video_id] = data['fps']
        
        self.num_people = {}
        yolo_dir = './data/yolo'
        for video_name in tqdm(sorted(os.listdir(yolo_dir))):
            video_dir = os.path.join(yolo_dir, video_name)
            for filename in sorted(os.listdir(video_dir)):
                filepath = os.path.join(video_dir, filename)
                img_path = os.path.join('./data/video_frames', video_name, filename.replace('.txt', '.jpg'))
                with open(filepath, 'r') as file:
                    cnt = sum(1 for line in file if line.split()[0] == '0')
                self.num_people[img_path] = cnt
        for path in self.file_path_list:
            if path not in self.num_people:
                self.num_people[path] = 0
                
        self.image_feature = np.concatenate(self.image_feature, axis=0)
        self.model, self.processor = self._load_model()

    def _load_model(self):
        device = "cpu"
        model, _ = create_model_from_pretrained('hf-hub:apple/DFN5B-CLIP-ViT-H-14-384', device=device)
        txt_processors = get_tokenizer('ViT-H-14')
        return model, txt_processors

    def featurize_text(self, text_query):
        device = "cpu"
        text_input = self.processor(text_query, context_length=self.model.context_length).to(device)
        
        features_text = self.model.encode_text(text_input)
        features_text = F.normalize(features_text, dim=-1)
        features_text = features_text.cpu().detach().numpy()

        return features_text

    def filter_people(self, path_list, filter_people_mode, num_people):
        """
        mode: 'less' or 'more' or 'equal'
        k: number of people
        """
        if filter_people_mode == 'less':
            return [path for path in path_list if self.num_people[path] < num_people]
        elif filter_people_mode == 'more':
            return [path for path in path_list if self.num_people[path] > num_people]
        elif filter_people_mode == 'equal':
            return [path for path in path_list if self.num_people[path] == num_people]

    def predict(self, text_query, top=500, filter_people_mode='off', num_people=0):
        print(num_people)
        print(filter_people_mode)
        features_text = self.featurize_text(text_query)    
        results = np.squeeze(np.matmul(self.image_feature, features_text.T))
        
        results = np.argsort(results)[::-1].tolist()
        sorted_path_list = [self.file_path_list[index] for index in results[:top]]
        if filter_people_mode != 'off':
            sorted_path_list = self.filter_people(sorted_path_list, filter_people_mode=filter_people_mode, num_people=num_people)
        
        results_dict = {}
        for path_list in sorted_path_list:
            vid, timeframe = path_list.split('/')[-2:]
            
            results_dict.setdefault(vid, [])
            results_dict[vid].append(timeframe)
            results_dict[vid] = sorted(results_dict[vid], key=lambda x: int(x[:-4]))
            
        return [
            {
                'img_path': os.path.join('./data/video_frames', vid, timeframe),
                'youtube_link': f"{self.youtube_link[vid]}&t={int(int(timeframe.split('.')[0])/self.fps[vid])}s",
                'fps': self.fps[vid]
            } 
            for vid, timeframe_list in results_dict.items() for timeframe in timeframe_list
        ]
        
    def save(self, path):
        pickle.dump(self, open(path, "wb"))

    @staticmethod
    def load(path):
        return pickle.load(open(path, "rb"))
    
if __name__ == '__main__':
    # nitzche_ins = NitzcheCLIP(feature_path='./data/clip_vit_h14_features')
    # nitzche_ins.save('./data/clip_vit_h14_nitzche.pkl')
    
    # Test function matching    
    nitzche_ins = NitzcheCLIP.load('./data/clip_vit_h14_nitzche.pkl')
    image_paths = nitzche_ins.predict(text_query="A shot from a camera on a car filming the journey. In the shot there is a yellow sign \"COM BINH DAN\" with red letters. Next the camera switches to another section of the road. In the next shot there is a person wearing a black shirt with a pink suitcase standing on the right hand side.", filter_people_mode='equal', num_people=1)
    breakpoint()
