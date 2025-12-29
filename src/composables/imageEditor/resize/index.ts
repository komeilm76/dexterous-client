import { useConvertor } from "@/composables/convertor";
import common from "../common";
const convertor = useConvertor();
const getPercentage = (largeNumber: number, smallNumber: number) => {
  if (largeNumber === 0) {
    throw new Error("Base number cannot be zero");
  }
  return (smallNumber / largeNumber) * 100;
};

const drawResizedImage = (
  bitmap: ImageBitmap,
  targetWidth: number
): HTMLCanvasElement => {
  const percentage = getPercentage(bitmap.width, targetWidth) / 100;

  if (percentage >= 1) {
    // no resize needed
    const canvas = common.createCanvasElement(bitmap.width, bitmap.height);
    canvas.getContext("2d")!.drawImage(bitmap, 0, 0);
    return canvas;
  }

  const width = bitmap.width * percentage;
  const height = bitmap.height * percentage;

  const canvas = common.createCanvasElement(width, height);
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Canvas context not available");
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(bitmap, 0, 0, width, height);

  return canvas;
};

export const resize = async (
  file: File,
  targetWidth: number
): Promise<File> => {
  try {
    if (!file.type.startsWith("image/")) {
      throw new Error("File is not an image");
    }

    const bitmap = await convertor.fileToBitmap(file);

    // If already smaller, return original
    if (bitmap.width <= targetWidth) {
      return file;
    }

    const canvas = drawResizedImage(bitmap, targetWidth);

    const resizedFile = await convertor.canvasToFile(
      canvas,
      file.name,
      file.type,
      0.9 // tweak quality if needed
    );

    bitmap.close(); // VERY IMPORTANT (memory leak prevention)

    return resizedFile;
  } catch (error) {
    console.error("Resize failed:", error);
    throw error;
  }
};
export default resize;
