import { createRoundClipPaths } from '../../utils/fabric';
import { LayoutInfo } from './../../types.d';
import { FabricImage, ImageSource, filters } from "fabric";
const { Resize } = filters;


export class RoundedCornerImage extends FabricImage {
  constructor(img: ImageSource, layoutInfo: LayoutInfo) {
    const resizeFilter = new Resize();
    resizeFilter.resizeType = 'lanczos';
    super(img, {
      width: 48,
      height: 48,
      clipPath: createRoundClipPaths(48, 0.5 * 48),
      resizeFilter: resizeFilter,
      left: (-layoutInfo.width / 2) + 12,
      top: (-layoutInfo.height / 2) + 12,
    })
    this.dirty = true;
  }
}