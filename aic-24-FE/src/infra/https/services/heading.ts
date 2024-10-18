import axiosInstance from "../axios";
import { Asr } from "../entities/asr/asr";

const HeadingService = {
  heading: (text: string, top: number) =>
    axiosInstance
      .post<Asr[]>(`http://localhost:8000/heading`, {
        text: text || "a man",
        top: top || 200,
      })
      .then((res) => res.data),
};

export default HeadingService;
