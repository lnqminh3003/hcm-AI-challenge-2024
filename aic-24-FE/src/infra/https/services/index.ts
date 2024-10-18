import ASRService from "./asr";
import LogService from "./log";
import QueryService from "./query";
import SubmitService from "./submit";
import HeadingService from "./heading";

const API_SERVICES = {
  QUERY: QueryService,
  SUBMIT: SubmitService,
  ASR: ASRService,
  Log: LogService,
  HEADING: HeadingService,
};

export default API_SERVICES;
