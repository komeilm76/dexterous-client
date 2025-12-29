export type Point = { x: number; y: number };

export type BBoxPoints = {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  width: number;
  height: number;
  topLeft: Point;
  topRight: Point;
  bottomRight: Point;
  bottomLeft: Point;
};
const readFileAsBitmap = async (file: File): Promise<ImageBitmap> => {
  try {
    return await createImageBitmap(file);
  } catch {
    throw new Error("Failed to decode image");
  }
};
const clampBBox = (
  bbox: BBoxPoints,
  imageWidth: number,
  imageHeight: number
) => {
  const startX = Math.max(0, Math.min(bbox.startX, imageWidth));
  const startY = Math.max(0, Math.min(bbox.startY, imageHeight));
  const endX = Math.max(startX, Math.min(bbox.endX, imageWidth));
  const endY = Math.max(startY, Math.min(bbox.endY, imageHeight));

  return {
    x: startX,
    y: startY,
    width: endX - startX,
    height: endY - startY,
  };
};
const createCanvas = (width: number, height: number): HTMLCanvasElement => {
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(width);
  canvas.height = Math.round(height);
  return canvas;
};

const drawCroppedImage = (
  bitmap: ImageBitmap,
  crop: { x: number; y: number; width: number; height: number }
): HTMLCanvasElement => {
  if (crop.width <= 0 || crop.height <= 0) {
    throw new Error("Invalid crop size");
  }

  const canvas = createCanvas(crop.width, crop.height);
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Canvas context not available");
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  ctx.drawImage(
    bitmap,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    crop.width,
    crop.height
  );

  return canvas;
};
const canvasToFile = async (
  canvas: HTMLCanvasElement,
  fileName: string,
  type: string,
  quality = 0.9
): Promise<File> => {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Failed to create Blob"));
          return;
        }
        resolve(new File([blob], fileName, { type }));
      },
      type,
      quality
    );
  });
};

export const cropWithBBox = async (
  file: File,
  bboxPoints: BBoxPoints
): Promise<File> => {
  try {
    if (!file.type.startsWith("image/")) {
      throw new Error("File is not an image");
    }

    const bitmap = await readFileAsBitmap(file);

    const crop = clampBBox(bboxPoints, bitmap.width, bitmap.height);

    const canvas = drawCroppedImage(bitmap, crop);

    const croppedFile = await canvasToFile(canvas, file.name, file.type, 0.95);

    bitmap.close(); // 🚨 CRITICAL for iOS / Android

    return croppedFile;
  } catch (error) {
    console.error("Crop failed:", error);
    throw error;
  }
};

export default cropWithBBox;
