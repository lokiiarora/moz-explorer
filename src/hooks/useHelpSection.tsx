import { useMemo, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "../components/ui/sheet";
import { isTouchBasedDevice } from "../utils/isTouchBasedDevice";

// Utility hook that powers the help section
export function useHelpSection() {
  const [isOpen, setIsOpen] = useState(false);
  const touchDevice = isTouchBasedDevice();

  const modalContent = useMemo(() => {
    const contents = [
      <div key="mouse-help-section" className="grid gap-4 py-4">
        <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
          Keyboard shortcuts and gotchas for Mouse based devices
        </h2>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-4">
            <div className="text-2xl">Ctrl + S</div>
            <div className="text-lg">
              Save the current canvas as a screenshot / just use the download
              icon
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-2xl">Ctrl + I</div>
            <div className="text-lg">
              Open the help section / just use the question mark icon
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-2xl">Alt + Move</div>
            <div className="text-lg">
              This pans the canvas
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-2xl">Scroll</div>
            <div className="text-lg">
              Scroll on the canvas to zoom in and out
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-2xl">Cmd + Click</div>
            <div className="text-lg">
              This opens the profile of the user in a new tab
            </div>
          </div>
        </div>
      </div>,
      <div key="touch-help-section" className="grid gap-4 py-4">
        <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
          Gotchas for touch based devices
        </h2>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-4">
            <div className="text-lg">Panning is not supported ❌❌❌</div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-lg">Double tap to open user's profile in a new tab</div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-lg">Click the download icon to get screenshots in the sidebar</div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-lg">
              Click the question mark icon to open help section
            </div>
          </div>
        </div>
      </div>,
    ];
    if (touchDevice) {
      contents.reverse();
    }
    return (
      <Sheet modal open={isOpen} onOpenChange={() => setIsOpen(false)}>
        <SheetContent side={"bottom"} className="w-full max-h-[60%] min-h-[300px] sm:min-h-[400px] overflow-auto">
          <SheetHeader>
            <SheetTitle>Help Section</SheetTitle>
            <SheetDescription>
              All instructions to use this app are supplied below:
            </SheetDescription>
          </SheetHeader>
          {contents}
        </SheetContent>
      </Sheet>
    );
  }, [isOpen, touchDevice]);

  return {
    modalContent,
    show: () => setIsOpen(true),
  };
}
