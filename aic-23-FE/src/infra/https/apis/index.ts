import { ASR_API } from "./asr";
import { LOG_API } from "./log";
import { QUERY_API } from "./query";
import { SUBMIT_API } from "./submit";

const APIS = {
  query: QUERY_API,
  submit: SUBMIT_API,
  asr: ASR_API,
  log: LOG_API,
};

export default APIS;
