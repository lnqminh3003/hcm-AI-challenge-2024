import { error } from "console";
import APIS from "../apis";
import { RSubmit } from "../entities/submit/submit";
import submitAxiosIntance from "../submitAxios";
import { message } from "antd";

const SubmitService = {
  Login: (username: string, password: string) =>
    submitAxiosIntance
      .post(APIS.submit.LOGIN, { username, password })
      .then((res) => res.data),
  Submit: (item: string, frame: string, session: string) =>
    submitAxiosIntance
      .get<RSubmit>(APIS.submit.SUBMIT, { params: { item, frame, session } })
      .then((res) => res.data),
};

export default SubmitService;
