import { minMax } from "../../utils/maths";
import { log } from "../../utils/logger";
import {
  Canvas,
  CanvasOptions,
  FabricObject,
  Point,
  TMat2D,
  TOptions,
  TPointerEventInfo,
  util,
} from "fabric";
import Hammer from "hammerjs";
import { FabricProfileCard } from "./FabricCard";

export enum DraggingStates {
  IDLE = "IDLE",
  PANNING = "PANNING",
}

// This is the custom fabric class to include custom behaviour which
// isn't included in fabric by default
export class CustomFabricCanvas extends Canvas {
  private dragState: DraggingStates = DraggingStates.IDLE;
  private _cacheViewportTransform: TMat2D;

  private lastPosX: number = 0;
  private lastPosY: number = 0;
  private hammerManager: HammerManager;

  constructor(
    element: string | HTMLCanvasElement | undefined,
    options: TOptions<CanvasOptions>,
  ) {
    super(element, options);
    this._onDblClick = this._onDblClick.bind(this);
    this._onMouseWheelCustom = this._onMouseWheelCustom.bind(this);
    this._onMouseDownCustom = this._onMouseDownCustom.bind(this);
    this._onMouseUpCustom = this._onMouseUpCustom.bind(this);
    this._onMouseMoveCustom = this._onMouseMoveCustom.bind(this);
    this.on("mouse:dblclick", this._onDblClick);
    this.on("mouse:wheel", this._onMouseWheelCustom);
    this.on("mouse:down", this._onMouseDownCustom);
    this.on("mouse:move", this._onMouseMoveCustom);
    this.on("mouse:up", this._onMouseUpCustom);
    // Utilising hammer to understand pinch and doubletap on touch devices
    this.hammerManager = new Hammer.Manager(this.upperCanvasEl, {
      domEvents: true,
    });
    this.hammerManager.add(new Hammer.Pinch({ enable: true }));
    this.hammerManager.add(new Hammer.Tap({ taps: 2, event: "doubletap" }));
    this.hammerManager.on("pinch", this.onPinch.bind(this));
    this.hammerManager.on("doubletap", this.onDoubleTapMobile.bind(this));
    this._cacheViewportTransform = this.viewportTransform.slice() as TMat2D;
  }

  private onPinch(event: HammerInput) {
    if (this.getActiveObjects().length !== 0) return;
    event.preventDefault();
    const zoom = minMax(this.getZoom() * event.scale ** 0.5, 0.3, 20);
    this.zoomToPoint(
      new Point(event.center.x, event.center.y),
      zoom,
    );
  }

  private onDoubleTapMobile(event: HammerInput) {
    const cards = this.getObjects().filter((f) =>
        f.containsPoint(new Point(event.center.x, event.center.y))
      ).filter((f) => f instanceof FabricProfileCard) as FabricProfileCard[];
      cards[0]?.openProfile();
  }

  private _onPanStart() {
    log("pan:before:start");
    this.defaultCursor = "grab";
  }

  private _onPanMove() {
    this.defaultCursor = "grabbing";
  }

  private _onPanEnd() {
    log("pan:end");
    this.defaultCursor = "default";
  }

  private _onDblClick() {
    this.setViewportTransform(this._cacheViewportTransform);
    this._cacheViewportTransform = this.viewportTransform.slice() as TMat2D;
    this.requestRenderAll();
  }

  public zoomToFit(
    objects: FabricObject[] = this.getObjects(),
    paddingFactor: number = 1.1,
  ): Promise<void> {
    if (objects.length === 0) return Promise.resolve();
    const { x, y } = this.calcViewportBoundaries().br.scalarDivide(
      this.getZoom(),
    );
    const boundingBoxes = objects.map((o) => o.getBoundingRect());
    const maxX = Math.max(...boundingBoxes.map((bb) => bb.top + bb.height));
    const maxY = Math.max(...boundingBoxes.map((bb) => bb.left + bb.width));
    const zoom = Math.min(x / maxX, y / maxY) * this.getRetinaScaling() /
      paddingFactor;
    this.setZoom(zoom);
    return new Promise((resolve) => {
      util.animate({
        startValue: this.getZoom(),
        endValue: zoom,
        duration: 200,
        onChange: (z) => {
          this.setZoom(z);
          this.requestRenderAll();
        },
        onComplete: () => {
          this._cacheViewportTransform = this.viewportTransform
            .slice() as TMat2D;
          resolve();
        },
      });
    });
  }

  private _onMouseWheelCustom(opt: TPointerEventInfo<WheelEvent>) {
    const zoom = minMax(this.getZoom() * 0.999 ** opt.e.deltaY, 0.3, 20);
    this.zoomToPoint(
      new Point(opt.e.offsetX, opt.e.offsetY),
      zoom,
    );
    opt.e.preventDefault();
    opt.e.stopPropagation();
  }

  private _onMouseDownCustom(
    { e: evt, scenePoint }: TPointerEventInfo<MouseEvent>,
  ) {
    if (evt.altKey) {
      this.dragState = DraggingStates.PANNING;
      this._onPanStart();
      this.selection = false;
      this.lastPosX = scenePoint.x;
      this.lastPosY = scenePoint.y;
    }
  }

  private _onMouseMoveCustom({ scenePoint }: TPointerEventInfo<MouseEvent>) {
    const vpt = this.viewportTransform;
    if (this.dragState === DraggingStates.PANNING && vpt) {
      vpt[4] += scenePoint.x - this.lastPosX;
      vpt[5] += scenePoint.y - this.lastPosY;
      this.requestRenderAll();
      this._onPanMove();
    }
  }

  private _onMouseUpCustom() {
    // on mouse up we want to recalculate new interaction
    // for all objects, so we call setViewportTransform
    if (this.viewportTransform && this.dragState === DraggingStates.PANNING) {
      this.setViewportTransform(this.viewportTransform);
      this.dragState = DraggingStates.IDLE;
      this.selection = true;
      this._onPanEnd();
    }
  }

  public getTextMetrics(
    fontSize: number,
    stringToMeasure: string,
  ): TextMetrics {
    const ctx = this.getTopContext();

    // Max font we want
    ctx.font = `${fontSize}px Inter`;
    return ctx.measureText(stringToMeasure);
  }
}
