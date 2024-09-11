import { NEXT_API_HOST, NEXT_API_SUBMIT } from "@constants/arbitrary";
import axios from "axios";

const submitAxiosIntance = axios.create({
  baseURL: NEXT_API_SUBMIT,
  headers: {
    "Content-Type": "application/json; charset=utf-8",
  },
  withCredentials: true,
});

submitAxiosIntance.defaults.withCredentials = true;

axios.interceptors.request.use(
  async (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    return Promise.reject(error);
  }
);

export default submitAxiosIntance;
