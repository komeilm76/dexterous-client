import { useConvertor } from "@/composables/convertor";
import commons from "../common";
const convertor = useConvertor();

export type FlipOptions = {
  horizontal?: boolean;
  vertical?: boolean;
};

const getFlipScale = ({ horizontal, vertical }: FlipOptions) => {
  return {
    x: horizontal ? -1 : 1,
    y: vertical ? -1 : 1,
  };
};

const drawFlippedImage = (
  bitmap: ImageBitmap,
  options: FlipOptions
): HTMLCanvasElement => {
  const canvas = commons.createCanvasElement(bitmap.width, bitmap.height);
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Canvas context not available");
  }

  const { x, y } = getFlipScale(options);

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  // Move origin to center
  ctx.translate(canvas.width / 2, canvas.height / 2);

  // Flip around center
  ctx.scale(x, y);

  // Draw centered
  ctx.drawImage(bitmap, -bitmap.width / 2, -bitmap.height / 2);

  return canvas;
};

export const flip = async (file: File, options: FlipOptions): Promise<File> => {
  try {
    if (!file.type.startsWith("image/")) {
      throw new Error("File is not an image");
    }

    if (!options.horizontal && !options.vertical) {
      return file;
    }

    const bitmap = await convertor.fileToBitmap(file);

    const canvas = drawFlippedImage(bitmap, options);

    const flippedFile = await convertor.canvasToFile(
      canvas,
      file.name,
      file.type,
      0.9
    );

    bitmap.close(); // 🚨 critical for iOS / Android memory

    return flippedFile;
  } catch (error) {
    console.error("Flip failed:", error);
    throw error;
  }
};

export default flip;
