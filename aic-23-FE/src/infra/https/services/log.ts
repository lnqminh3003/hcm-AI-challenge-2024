import APIS from "../apis";
import axiosInstance from "../axios";

const LogService = {
  log: (text: string) =>
    axiosInstance
      .post(APIS.log.LOG, {
        text: text || "This Is Log",
      })
      .then((res) => res.data),
};

export default LogService;
