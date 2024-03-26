import { Rect } from "fabric";

// This function creates a clip path for a circular image
export function createRoundClipPaths(
  dimension: number,
  borderRadius: number
) {
  return createClipPaths(dimension, dimension, borderRadius, borderRadius, 'white')
}

// This function creates a generic clip path
// can be extended to circular as done above
export function createClipPaths(
  dimensionX: number,
  dimensionY: number,
  borderRadiusX: number,
  borderRadiusY: number,
  fill: string
) {
  return new Rect({
    width: dimensionX,
    height: dimensionY,
    rx: borderRadiusX,
    ry: borderRadiusY,
    left: -dimensionX / 2,
    top: -dimensionY / 2,
    fill
  });
}

// A higher order function to provide layout for a grid for all the cards
export function getLayoutInfo(itemsPerColumn: number, interRowGap: number, interColumnGap: number) {
  return (index: number, width: number, height: number) => {
    const columnNumber = Math.floor(index / itemsPerColumn);
    const rowNumber = index % itemsPerColumn;
    return {
      x: (interColumnGap * columnNumber) + (columnNumber * width),
      y: (rowNumber * height) + (rowNumber * interRowGap),
    }
  }
}
