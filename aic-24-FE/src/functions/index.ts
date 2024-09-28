import { ImgType } from "pages";
import { groupBy } from "lodash";

export const extractBatch = (str: string) => {
  return str.replace(/_[\s\S]*$/, "");
};

export const rmExt = (str: string) => {
  // return str.replace(/\.jpg/, "");
  return str.replace(/\.webp/, "");
};

export const checkLiveSearch = (str: string, isLiveSearch: boolean) => {
  return str.match(/[\s|\n]$/) && isLiveSearch;
};

export const groupByVideo = (imgSoure: ImgType[]): Record<string, ImgType[]> => {
  return groupBy(imgSoure, "video");
};