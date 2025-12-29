import common from "./common";
import crop from "./crop";
import cropFromCorners from "./cropFromCorners";
import cropWithBBox from "./cropWithBBox";
import flip from "./flip";
import resize from "./resize";
import rotate from "./rotate";
import svgBBox from "./svgBBox";

export type IImageMimeType =
  | "image/bmp"
  | "image/tiff"
  | "image/x-ms-bmp"
  | "image/gif"
  | "image/jpeg"
  | "image/png";

export const useImageEditor = () => {
  return {
    rotate,
    resize,
    flip,
    crop,
    cropFromCorners,
    svgBBox,
    cropWithBBox,
    ...common,
  };
};

export default {
  rotate,
  resize,
  flip,
  crop,
  cropFromCorners,
  svgBBox,
  cropWithBBox,
  ...common,
};
