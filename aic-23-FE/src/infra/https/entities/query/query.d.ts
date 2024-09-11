export type Query = {
  video: string;
  mapped_frameid: number;
  frameid: string;
  youtube_url: string;
  img_path: string;
  youtube_link: string;
};

export type RQuery = {
  data: Query[];
};

export type RKeyFrame = {
  mappedKeyFrame: number;
  youtubeLink: string;
};

export type RWeightedQuery = {
  data: Query[];
};