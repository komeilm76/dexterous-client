export type Point = {
  x: number;
  y: number;
};

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

const isSVGGraphicsElement = (el: unknown): el is SVGGraphicsElement => {
  return el instanceof SVGGraphicsElement;
};

const getSafeBBox = (element: SVGGraphicsElement): DOMRect => {
  try {
    return element.getBBox();
  } catch {
    throw new Error("Unable to calculate SVG bounding box");
  }
};

const bboxToPoints = (bbox: DOMRect): BBoxPoints => {
  const startX = bbox.x;
  const startY = bbox.y;
  const endX = bbox.x + bbox.width;
  const endY = bbox.y + bbox.height;

  return {
    startX,
    startY,
    endX,
    endY,
    width: bbox.width,
    height: bbox.height,
    topLeft: { x: startX, y: startY },
    topRight: { x: endX, y: startY },
    bottomRight: { x: endX, y: endY },
    bottomLeft: { x: startX, y: endY },
  };
};

export const getSvgBBoxPoints = (element: SVGElement): BBoxPoints => {
  if (!isSVGGraphicsElement(element)) {
    throw new Error("Element is not a valid SVG graphics element");
  }

  const bbox = getSafeBBox(element);
  return bboxToPoints(bbox);
};
