export type CropAmount = string; // "10%", "100px", "2in", "1cm"
const readFileAsBitmap = async (file: File): Promise<ImageBitmap> => {
  try {
    return await createImageBitmap(file);
  } catch {
    throw new Error("Failed to decode image");
  }
};
const parseCropAmountToPixels = (
  amount: CropAmount,
  imageWidth: number,
  imageHeight: number
): number => {
  const value = parseFloat(amount);
  if (!Number.isFinite(value)) {
    throw new Error("Invalid crop amount");
  }

  if (amount.endsWith("%")) {
    const percent = value / 100;
    return Math.min(imageWidth, imageHeight) * percent;
  }

  if (amount.endsWith("px")) {
    return value;
  }

  // Physical units → CSS pixels (96 DPI standard)
  const DPI = 96;

  if (amount.endsWith("in")) {
    return value * DPI;
  }

  if (amount.endsWith("cm")) {
    return (value / 2.54) * DPI;
  }

  if (amount.endsWith("mm")) {
    return (value / 25.4) * DPI;
  }

  throw new Error("Unsupported unit (use %, px, in, cm, mm)");
};
const clampCornerCrop = (
  cropPx: number,
  imageWidth: number,
  imageHeight: number
) => {
  const maxCropX = imageWidth / 2;
  const maxCropY = imageHeight / 2;

  const safeCrop = Math.min(cropPx, maxCropX, maxCropY);

  return {
    x: safeCrop,
    y: safeCrop,
    width: imageWidth - safeCrop * 2,
    height: imageHeight - safeCrop * 2,
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
    throw new Error("Crop amount too large");
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
export const cropFromCorners = async (
  file: File,
  amount: CropAmount
): Promise<File> => {
  try {
    if (!file.type.startsWith("image/")) {
      throw new Error("File is not an image");
    }

    const bitmap = await readFileAsBitmap(file);

    const cropPx = parseCropAmountToPixels(amount, bitmap.width, bitmap.height);

    const cropArea = clampCornerCrop(cropPx, bitmap.width, bitmap.height);

    const canvas = drawCroppedImage(bitmap, cropArea);

    const croppedFile = await canvasToFile(canvas, file.name, file.type);

    bitmap.close(); // 🚨 CRITICAL for iOS / Android

    return croppedFile;
  } catch (error) {
    console.error("cropFromCorners failed:", error);
    throw error;
  }
};
export default cropFromCorners;
