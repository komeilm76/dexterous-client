export type Point = {
  x: number;
  y: number;
};

const readFileAsBitmap = async (file: File): Promise<ImageBitmap> => {
  try {
    return await createImageBitmap(file);
  } catch {
    throw new Error("Failed to decode image");
  }
};

const normalizePoints = (a: Point, b: Point) => {
  const startX = Math.min(a.x, b.x);
  const startY = Math.min(a.y, b.y);
  const endX = Math.max(a.x, b.x);
  const endY = Math.max(a.y, b.y);

  return { startX, startY, endX, endY };
};

const clampCropArea = (
  rect: { startX: number; startY: number; endX: number; endY: number },
  imageWidth: number,
  imageHeight: number
) => {
  const x = Math.max(0, Math.min(rect.startX, imageWidth));
  const y = Math.max(0, Math.min(rect.startY, imageHeight));

  const endX = Math.max(x, Math.min(rect.endX, imageWidth));
  const endY = Math.max(y, Math.min(rect.endY, imageHeight));

  return {
    x,
    y,
    width: endX - x,
    height: endY - y,
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
  quality = 0.95
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

export const crop = async (
  file: File,
  startPoint: Point,
  endPoint: Point
): Promise<File> => {
  try {
    if (!file.type.startsWith("image/")) {
      throw new Error("File is not an image");
    }

    const bitmap = await readFileAsBitmap(file);

    const normalized = normalizePoints(startPoint, endPoint);
    const cropArea = clampCropArea(normalized, bitmap.width, bitmap.height);
    console.log("cropArea", cropArea);

    const canvas = drawCroppedImage(bitmap, cropArea);

    const croppedFile = await canvasToFile(canvas, file.name, file.type);

    bitmap.close(); // 🚨 CRITICAL for iOS / Android

    return croppedFile;
  } catch (error) {
    console.error("Crop failed:", error);
    throw error;
  }
};

export default crop;
