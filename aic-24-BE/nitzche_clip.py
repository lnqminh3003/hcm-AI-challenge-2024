import os
import numpy as np
import json
import pickle
import torch.nn.functional as F
from open_clip import create_model_from_pretrained, get_tokenizer 
from tqdm import tqdm
from collections import defaultdict


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

    def predict(self, text_query, top=500):
        features_text = self.featurize_text(text_query)    
        results = np.squeeze(np.matmul(self.image_feature, features_text.T))
        
        results = np.argsort(results)[::-1].tolist()
        sorted_path_list = [self.file_path_list[index] for index in results[:top]]
        
        results_dict = {}
        for path_list in sorted_path_list:
            vid, timeframe = path_list.split('/')[-2:]
            
            results_dict.setdefault(vid, [])
            results_dict[vid].append(timeframe)
            results_dict[vid] = sorted(results_dict[vid], key=lambda x: int(x[:-4]))
        
        return [
            {
                'img_path': os.path.join('/data/video_frames', vid, timeframe),
                'youtube_link': f"{self.youtube_link[vid]}&t={int(int(timeframe.split('.')[0])/self.fps[vid])}s"
            } 
            for vid, timeframe_list in results_dict.items() for timeframe in timeframe_list
        ]
        
    # def predict(self, text_query, top=500):
    #     single_query = text_query.split('.')
    #     results = [self.soft_predict(query, top) for query in single_query]
        
    #     final_results = defaultdict(list)
    #     vid_score = defaultdict(int)    
    #     vid_order = []                     # To maintain the original insertion order of vids
   
    #     for sublist in results:
    #         seen_vids_in_sublist = set()  
    #         for item in sublist:
    #             vid, timeframe = item['img_path'].split('/')[-2:]
                
    #             if vid not in seen_vids_in_sublist:
    #                 vid_score[vid] += 1
    #                 seen_vids_in_sublist.add(vid)
                    
    #             # Record the vid's first appearance in original order
    #             if vid not in vid_order:
    #                 vid_order.append(vid)
                    
    #             final_results[vid].append(timeframe)
    #             final_results[vid] = sorted(final_results[vid], key=lambda x: int(x[:-4]))        
                
    #     # Sort by vid_score first (descending), then by original vid_order if the scores are the same
    #     sorted_final_results = sorted(
    #         final_results.items(),
    #         key=lambda x: (-vid_score[x[0]], vid_order.index(x[0]))
    #     )

    #     # Convert to the desired output format (list of dictionaries)
    #     return [
    #         {
    #             'img_path': os.path.join('./data/video_frames', vid, timeframe),
    #             'youtube_link': f"{self.youtube_link[vid]}&t={int(int(timeframe.split('.')[0])/self.fps[vid])}s"
    #         }
    #         for vid, timeframe_list in sorted_final_results for timeframe in timeframe_list
    #     ] 
        
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
    image_paths = nitzche_ins.predicts(text_query="A woman")
    breakpoint()
