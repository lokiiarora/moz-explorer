import { FabricText } from "fabric";
import { LayoutInfo } from "../../types";

// Custom Title class for the FabricText
export class CustomTitleText extends FabricText {
  constructor(text: string, layoutInfo: LayoutInfo) {
    super(text, {
      left: (-layoutInfo.width / 2) + 64,
      top: (-layoutInfo.height / 2) + 14,
      width: layoutInfo.width,
      height: 20,
      fontSize: 16,
      fontFamily: 'Inter',
      absolutePositioned: false,
      textAlign: 'left',
      fontWeight: "bold",
      fill: 'red'
    });
  }
}