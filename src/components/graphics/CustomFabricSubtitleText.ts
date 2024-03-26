import { FabricText } from "fabric";
import { LayoutInfo } from "../../types";


// Custom Subtitle class for the FabricText
export class CustomFabricSubtitleText extends FabricText {
  constructor(text: string, layoutInfo: LayoutInfo) {
    super(text, {
      left: (-layoutInfo.width / 2) + 64,
      top: (-layoutInfo.height / 2) + 32,
      width: layoutInfo.textWidth,
      height: 16,
      fontSize: 12,
      fontFamily: 'Inter',
      absolutePositioned: false,
      fontWeight: "normal",
      textAlign: 'left',
      fill: 'red'
    });
  }
}