import { useCallback, useTransition } from "react";
import { Button } from "./ui/button";
import { SearchIcon } from "./ui/icons/SearchIcon";
import { Input } from "./ui/input";
import { useFabricCanvas } from "../hooks/useFabricCanvas";
import { useKeyboardShortcut } from "../hooks/useKeyboardShortcut";
import { useScreenshotResults } from "../hooks/useScreenshotResults";
import { ExportIcon } from "./ui/icons/ExportIcon";
import { QuestionMarkIcon } from "./ui/icons/QuestionMarkIcon";
import { useHelpSection } from "../hooks/useHelpSection";

// This component is the main stage of the application where the canvas is rendered
// and the main UI is displayed
// it also serves as a container for the screenshot results and the help section
export function ApplicationStage() {
  const {
    setCanvasRef,
    setCanvasContainerRef,
    search,
    setSearch,
    exportToScreenshots,
  } = useFabricCanvas();

  const {
    show: showScreenshotResults,
    setScreenshots,
    bottomSheetContent,
  } = useScreenshotResults();
  const { modalContent: helpModalContent, show: showHelpSection } =
    useHelpSection();

  const handleScreenshotSave = useCallback(() => {
    startTransition(() => {
      setScreenshots(exportToScreenshots());
      showScreenshotResults();
    });
  }, [exportToScreenshots, showScreenshotResults, setScreenshots]);

  const handleHelpSection = useCallback(() => {
    startTransition(() => {
      showHelpSection();
    });
  }, [showHelpSection]);

  useKeyboardShortcut(
    (e) => e.key === "s" && (e.ctrlKey || e.metaKey),
    handleScreenshotSave
  );

  useKeyboardShortcut(
    (e) => e.key === "i" && (e.ctrlKey || e.metaKey),
    handleHelpSection
  );

  // This is done to not block the UI and still make the state update happen
  // This would make the transition smoother and make the canvas stuff appear
  // with eventual consistency which is better than having a janky UI
  const [, startTransition] = useTransition();
  return (
    <>
      {bottomSheetContent}
      {helpModalContent}
      <div className="flex w-full h-full">
        <div className="flex-1 flex flex-col">
          <header className="flex items-center gap-8 p-4">
            <h1 className="font-semibold text-base">Moz Explorer</h1>
            <div className="flex justify-center items-center gap-2 flex-grow">
              <SearchIcon className="h-4 w-4 opacity-50" />
              <Input
                className={
                  "w-full bg-white shadow-none appearance-none border-0 p-0"
                }
                placeholder="Search"
                type="search"
                value={search}
                onChange={(e) => {
                  startTransition(() => {
                    setSearch(e.target.value);
                  });
                }}
              />
            </div>
            <Button
              onClick={handleScreenshotSave}
              className="h-8 w-8"
              size="icon"
              variant="outline"
            >
              <ExportIcon className="h-4 w-4" />
              <span className="sr-only">Export</span>
            </Button>
            <Button
              onClick={handleHelpSection}
              className="h-8 w-8"
              size="icon"
              variant="outline"
            >
              <QuestionMarkIcon className="h-4 w-4" />
              <span className="sr-only">Help</span>
            </Button>
          </header>

          <main
            ref={setCanvasContainerRef}
            className="flex-1 bg-gray-100 dark:bg-gray-800 w-screen gap-4"
          >
            <canvas
              autoFocus
              ref={setCanvasRef}
              className="w-full h-full"
            ></canvas>
          </main>
        </div>
      </div>
    </>
  );
}
