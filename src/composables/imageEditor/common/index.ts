const createCanvasElement = (
  width: number,
  height: number
): HTMLCanvasElement => {
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(width);
  canvas.height = Math.round(height);
  return canvas;
};

export default { createCanvasElement };
