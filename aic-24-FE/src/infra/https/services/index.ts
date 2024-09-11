import ASRService from "./asr";
import LogService from "./log";
import QueryService from "./query";
import SubmitService from "./submit";

const API_SERVICES = {
  QUERY: QueryService,
  SUBMIT: SubmitService,
  ASR: ASRService,
  Log: LogService,
};

export default API_SERVICES;
