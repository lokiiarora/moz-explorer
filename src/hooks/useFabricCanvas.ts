import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useFilteredGithubUsers } from "./useFilteredGithubUsers";
import { FabricProfileCard } from "../components/graphics/FabricCard";
import { CustomFabricCanvas } from "../components/graphics/CustomFabricCanvas";
import { getLayoutInfo } from "../utils/fabric";
import { ResourceRegistry } from "../utils/resourceRegistry";

const layoutInfoHelper = getLayoutInfo(10, 12, 8);

// Utility hook that powers the fabric canvas
// All fabric specific logic is handled here
export function useFabricCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLElement>(null);
  const { data, additiveDeletiveState, ...args } = useFilteredGithubUsers();
  const groupsRef = useRef<Map<string, FabricProfileCard>>(new Map());
  const [loading, setLoading] = useState(true);

  const fabricCanvasRef = useRef<CustomFabricCanvas | null>(null);

  // The initial setup of fabric canvas is handled in this effect
  // hence using layout effect so that the HTML node is rendered to the dom
  // before the canvas is initialized
  useLayoutEffect(() => {
    if (!canvasRef.current) return;
    const { width, height } = canvasRef.current.getBoundingClientRect();
    canvasRef.current.focus();
    fabricCanvasRef.current = new CustomFabricCanvas(canvasRef.current, {
      enableRetinaScaling: true,
      renderOnAddRemove: true,
      width,
      height,
      containerClass: "fabric-canvas-container",
      stopContextMenu: true,
      allowTouchScrolling: false,
      enablePointerEvents: false,
      skipOffscreen: true,
      selection: false,
      fireRightClick: false,
    });
    // Resize Handler for the canvas
    function resizeHandler() {
      if (canvasContainerRef.current === null) return;
      if (fabricCanvasRef.current === null) return;
      if (canvasRef.current === null) return;
      const { width: containerWidth, height: containerHeight } = canvasContainerRef.current.getBoundingClientRect();
      const scaleX = (containerWidth / fabricCanvasRef.current.getWidth()) * fabricCanvasRef.current.getZoom();
      const scaleY = (containerHeight / fabricCanvasRef.current.getHeight()) * fabricCanvasRef.current.getZoom();
      fabricCanvasRef.current.setDimensions({ width: containerWidth, height: containerHeight }, {
        cssOnly: false
      });
      fabricCanvasRef.current.setViewportTransform([scaleX, 0, 0, scaleY, 0, 0]);
      canvasRef.current.width = containerWidth;
      canvasRef.current.height = containerHeight;
      fabricCanvasRef.current.calcOffset()
      fabricCanvasRef.current.renderAll();
    }

    window.addEventListener("resize", resizeHandler)
    return () => {
      window.removeEventListener("resize", resizeHandler);
      fabricCanvasRef.current?.dispose();
      fabricCanvasRef.current = null;
    };
  }, [canvasRef]);

  // This effect helps in setting up the cards in the canvas
  // whenever data is available
  // it also calculates the layout for the cards
  // using the layoutInfoHelper function
  // it also calculates the max username length to set the width of the card
  useEffect(() => {
    if (fabricCanvasRef.current === null) return;
    const maxUsernameLength = data.reduce((acc, user) =>
      Math.max(acc, user.login.length), 0) + 1;
    const textMetrics = fabricCanvasRef.current.getTextMetrics(
      16,
      "M".repeat(maxUsernameLength),
    );
    data.forEach((user, index) => {
      // Static as there's no multiline text
      const height = 72,
        width = 74 + textMetrics.width;
      const extraLayoutInfo = layoutInfoHelper(index, width, height);
      const layoutInfo = {
        ...textMetrics,
        ...extraLayoutInfo,
        height,
        width,
        textWidth: textMetrics.width,
      };
      const card = new FabricProfileCard(user, layoutInfo);
      groupsRef.current.set(user.login, card);
    });
    fabricCanvasRef.current.clear();
    groupsRef.current.forEach((group) => {
      fabricCanvasRef.current?.add(group);
    });
    ResourceRegistry.whenAllLoaded().then(() => {
      fabricCanvasRef.current?.zoomToFit([...groupsRef.current.values()]).then(
        () => {
          setLoading(false);
        },
      );
    });
  }, [data]);

  // This effect reacts to the changes in the additive deletive state
  // and animates cards accordingly
  useEffect(() => {
    if (fabricCanvasRef.current === null) return;
    const { additive, subtractive } = additiveDeletiveState;
    additive.forEach((user) => {
      groupsRef.current.get(user)?.animateIn();
    });
    subtractive.forEach((user) => {
      groupsRef.current.get(user)?.animateOut();
    });
  }, [additiveDeletiveState]);

  return {
    setCanvasRef: canvasRef,
    setCanvasContainerRef: canvasContainerRef,
    loading,
    ...args,
    // This function is used to export the cards in canvas to screenshots
    // It only exports the visible cards
    exportToScreenshots: () => {
      const screenshots = Array.from(groupsRef.current.values()).filter((g) =>
        g.visible
      ).map((group) => group.toDataURL());
      return screenshots;
    },
  };
}
