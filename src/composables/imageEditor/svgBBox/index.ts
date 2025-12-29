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
const fetchSvgText = async (src: string): Promise<string> => {
  const res = await fetch(src);
  if (!res.ok) {
    throw new Error("Failed to load SVG file");
  }
  return await res.text();
};
const parseSvg = (svgText: string): SVGSVGElement => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgText, "image/svg+xml");

  const svg = doc.querySelector("svg");
  if (!svg) {
    throw new Error("Invalid SVG file");
  }

  return svg;
};
const getSvgBBoxFromRoot = (svg: SVGSVGElement): DOMRect => {
  // SVG must be attached to DOM for getBBox() to work
  const wrapper = document.createElement("div");
  wrapper.style.position = "absolute";
  wrapper.style.visibility = "hidden";
  wrapper.style.width = "0";
  wrapper.style.height = "0";
  wrapper.style.overflow = "hidden";

  wrapper.appendChild(svg);
  document.body.appendChild(wrapper);

  try {
    return svg.getBBox();
  } finally {
    document.body.removeChild(wrapper); // 💥 no leaks
  }
};
export const svgBBox = async (element: Element): Promise<BBoxPoints> => {
  // CASE 1: Inline SVG
  if (element instanceof SVGGraphicsElement) {
    const bbox = element.getBBox();
    return bboxToPoints(bbox);
  }

  // CASE 2: <img src="*.svg">
  if (element instanceof HTMLImageElement) {
    const src = element.currentSrc || element.src;

    if (!src.endsWith(".svg")) {
      throw new Error("Image is not an SVG");
    }

    const svgText = await fetchSvgText(src);
    const svg = parseSvg(svgText);
    const bbox = getSvgBBoxFromRoot(svg);

    return bboxToPoints(bbox);
  }

  throw new Error("Unsupported element type");
};

export default svgBBox;
