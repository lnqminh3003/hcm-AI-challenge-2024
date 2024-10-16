import APIS from "../apis";
import axiosInstance from "../axios";
import { RKeyFrame, RQuery } from "../entities/query/query";


const QueryService = {
  query: (text: string, top: string, model: string, filter_people_mode: string, num_people: string) =>
    axiosInstance
      .post<RQuery>(APIS.query.QUERY, {
        text: text || "a man",
        top: top || 400,
        // model: model || "b16",
        // filter_people_mode: filter_people_mode || "off",
        // num_people: num_people || 2,
      })
      .then((res) => res.data),

  weightedQuery: (
    text: string,
    top: number,
    with_weith: boolean,
    text_gamma: number,
    skip: number,
    gamma: number,
    decay: number,
    window_size: number
  ) =>
    axiosInstance
      .post<RQuery>(APIS.query.WEIGHTED_QUERY, {
        text: text || "a man",
        top: top || 100,
        with_weith,
        text_gamma,
        skip,
        gamma,
        decay,
        window_size,
      })
      .then((res) => res.data),

  map: (video: string, keyFrame: string) =>
    axiosInstance.post<RKeyFrame>(APIS.query.KEYFRAME, {
      video: video || "",
      keyframe: keyFrame || "",
    }),
};

export default QueryService;
