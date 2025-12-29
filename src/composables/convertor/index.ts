export const useConvertor = () => {
  // 🌐 Convert a Blob to a Buffer
  const blobToBuffer = async (blob: Blob): Promise<ArrayBuffer> => {
    const arrayBuffer = await blob.arrayBuffer();
    return arrayBuffer;
  };

  // 📁 Convert a Blob to a File
  const blobToFile = (blob: Blob, fileName: string): File => {
    return new File([blob], fileName, { type: blob.type });
  };

  // 🔗 Convert a Blob to a Blob URL
  const blobToBlobUrl = (blob: Blob): string => {
    return URL.createObjectURL(blob);
  };

  // 🌐 Convert a Buffer to a Blob
  const bufferToBlob = (
    buffer: ArrayBuffer | Buffer<ArrayBufferLike>,
    type: string = "application/octet-stream"
  ): Blob => {
    const uint8Array = new Uint8Array(buffer); // ✅ convert Buffer to Uint8Array
    return new Blob([uint8Array], { type });
  };

  // 📁 Convert a Buffer to a File
  const bufferToFile = (
    buffer: ArrayBuffer | Buffer<ArrayBufferLike>,
    fileName: string,
    type: string = "application/octet-stream"
  ): File => {
    const uint8Array = new Uint8Array(buffer); // ✅ convert Buffer to Uint8Array
    return new File([uint8Array], fileName, { type });
  };

  // 🔗 Convert a Buffer to a Blob URL
  const bufferToBlobUrl = (
    buffer: ArrayBuffer | Buffer<ArrayBufferLike>,
    type: string = "application/octet-stream"
  ): string => {
    const blob = bufferToBlob(buffer, type);
    return blobToBlobUrl(blob);
  };

  // 🌐 Convert a File to a Blob
  const fileToBlob = (file: File): Blob => {
    return new Blob([file], { type: file.type });
  };

  // 📁 Convert a File to a Buffer
  const fileToBuffer = async (file: File): Promise<ArrayBuffer> => {
    const arrayBuffer = await file.arrayBuffer();
    return arrayBuffer;
  };

  // 🔗 Convert a File to a Blob URL
  const fileToBlobUrl = (file: File): string => {
    return URL.createObjectURL(file);
  };

  // 📁 Convert a File to a Bitmap
  const fileToBitmap = async (file: File): Promise<ImageBitmap> => {
    try {
      return await createImageBitmap(file);
    } catch (err) {
      throw new Error("Failed to decode image");
    }
  };

  // 📁 Convert a Canvas to a File
  const canvasToFile = async (
    canvas: HTMLCanvasElement,
    fileName: string,
    type: string,
    quality = 0.99
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

  return {
    blobToBuffer,
    blobToFile,
    blobToBlobUrl,
    bufferToBlob,
    bufferToFile,
    bufferToBlobUrl,
    fileToBlob,
    fileToBuffer,
    fileToBlobUrl,
    fileToBitmap,
    canvasToFile,
  };
};
