import { NEXT_API_HOST } from "@constants/arbitrary";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: NEXT_API_HOST,
  headers: {
    "Content-Type": "application/json; charset=utf-8",
  },
  withCredentials: true,
});

axiosInstance.defaults.withCredentials = true;

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

export default axiosInstance;
