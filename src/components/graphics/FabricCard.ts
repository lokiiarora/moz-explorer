import { Group, util, runningAnimations, FabricObject, ClipPathLayout, TPointerEventInfo } from "fabric";
import { GithubUser, LayoutInfo } from "../../types";
import { RoundedCornerImage } from "./RoundedCornerImage";
import { CustomTitleText } from "./CustomTitleText";
import { CustomFabricSubtitleText } from "./CustomFabricSubtitleText";
import { ResourceRegistry } from "../../utils/resourceRegistry";

// Main card class that represents the user card
export class FabricProfileCard extends Group {

  public name: string;

  constructor(private user: GithubUser, layoutInfo: LayoutInfo) {
    super([], {
      subTargetCheck: false,
      visible: false,
      absolutePositioned: false,
      hoverCursor: "pointer",
      height: layoutInfo.height,
      width: layoutInfo.width,
      top: layoutInfo.y,
      left: layoutInfo.x,
      backgroundColor: 'rgba(255, 255, 0, 0.75)',
    });
    this.set('opacity', 0);
    this.name = user.login;
    ResourceRegistry.addLoadable(FabricProfileCard.getObjectsfromGithubUser(user, layoutInfo)).then((objects) => {
      this.add(...objects);
      this.width = layoutInfo.width;
      this.height = layoutInfo.height;
      this.top = layoutInfo.y;
      this.left = layoutInfo.x;
      this.setCoords();
      this.dirty = true;
      this.canvas?.requestRenderAll();
      this.triggerLayout({
        strategy: new ClipPathLayout()
      })
      
    });
    this.on('mousedown', this.onMouseDown.bind(this));
    this.on('mouseover', this.onMouseOver.bind(this));
    this.on('mouseout', this.onMouseOut.bind(this));
  }

  private onMouseDown({ e: evt }: TPointerEventInfo<MouseEvent>) {
    if (evt.ctrlKey || evt.metaKey) {
      this.openProfile();
    }
  }

  private onMouseOver({ e: evt }: TPointerEventInfo<MouseEvent>) {
    if (evt.ctrlKey || evt.metaKey) {
      this.canvas?.setCursor('pointer')
    } else if (evt.altKey) {
      this.canvas?.setCursor("drag");
    } else {
      this.canvas?.setCursor('default')
    }
  }

  private onMouseOut() {
    this.canvas?.setCursor('default')
  }

  public openProfile() {
    window.open(this.user.html_url, '_blank')
  }

  public animateIn() {
    runningAnimations.find((anim) => anim.target === this)?.abort();
    this.set('visible', true);
    util.animate({
      startValue: this.get('opacity'),
      endValue: 1,
      duration: 500,
      onChange: (value) => {
        this.set('opacity', value);
        this.canvas?.requestRenderAll();
      },
      easing: util.ease.easeInOutExpo,
    })
  }

  public animateOut() {
    runningAnimations.find((anim) => anim.target === this)?.abort();
      util.animate({
        startValue: this.get('opacity'),
        endValue: 0,
        duration: 500,
        onChange: (value) => {
          this.set('opacity', value);
          this.canvas?.requestRenderAll();
        },
        easing: util.ease.easeInOutExpo,
        onComplete: () => {
          this.set('visible', false);
        }
      })
  }

  static async getObjectsfromGithubUser(user: GithubUser, layoutInfo: LayoutInfo): Promise<FabricObject[]> {
    const objects: FabricObject[] = [];
    objects.push(new CustomTitleText(user.login, layoutInfo), new CustomFabricSubtitleText(`@${user.login}`, layoutInfo));
    return new Promise<FabricObject[]>((resolve) => {
      util.loadImage(user.avatar_url, { crossOrigin: 'anonymous' }).then(img => {
        objects.push(new RoundedCornerImage(img, layoutInfo));
        resolve(objects);
      });
    });
  }

}
