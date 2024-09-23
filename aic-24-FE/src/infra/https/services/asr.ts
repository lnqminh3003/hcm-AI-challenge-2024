import APIS from "../apis";
import axiosInstance from "../axios";
import { Asr } from "../entities/asr/asr";

const ASRService = {
  asr: (text: string, top: number) =>
    axiosInstance
      .post<Asr[]>(APIS.asr.ASR, {
        text: text || "a man",
        top: top || 200,
      })
      .then((res) => res.data),
};

export default ASRService;
