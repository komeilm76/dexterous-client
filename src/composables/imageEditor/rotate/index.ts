import { useConvertor } from "@/composables/convertor";
import commons from "../common";
const convertor = useConvertor();

const degToRad = (degree: number): number => {
  return (degree * Math.PI) / 180;
};

const getRotatedSize = (width: number, height: number, rad: number) => {
  const sin = Math.abs(Math.sin(rad));
  const cos = Math.abs(Math.cos(rad));

  return {
    width: width * cos + height * sin,
    height: width * sin + height * cos,
  };
};

const drawRotatedImage = (
  bitmap: ImageBitmap,
  degree: number
): HTMLCanvasElement => {
  const rad = degToRad(degree);
  const { width, height } = getRotatedSize(bitmap.width, bitmap.height, rad);

  const canvas = commons.createCanvasElement(width, height);
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Canvas context not available");
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  // Move to canvas center
  ctx.translate(width / 2, height / 2);

  // Rotate around center
  ctx.rotate(rad);

  // Draw image centered
  ctx.drawImage(bitmap, -bitmap.width / 2, -bitmap.height / 2);

  return canvas;
};

export const rotate = async (file: File, degree: number): Promise<File> => {
  try {
    if (!file.type.startsWith("image/")) {
      throw new Error("File is not an image");
    }

    if (!Number.isFinite(degree)) {
      throw new Error("Invalid rotation degree");
    }

    const bitmap = await convertor.fileToBitmap(file);

    // Normalize degree (e.g. 450 → 90)
    const normalizedDegree = ((degree % 360) + 360) % 360;

    if (normalizedDegree === 0) {
      bitmap.close();
      return file;
    }

    const canvas = drawRotatedImage(bitmap, normalizedDegree);

    const rotatedFile = await convertor.canvasToFile(
      canvas,
      file.name,
      file.type,
      0.9
    );

    bitmap.close(); // 🚨 critical for mobile memory

    return rotatedFile;
  } catch (error) {
    console.error("Rotate failed:", error);
    throw error;
  }
};
export default rotate;
