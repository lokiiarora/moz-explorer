import { useMemo, useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "../components/ui/sheet";

// Utility hook that powers the sidebar screenshot view
export function useScreenshotResults() {
  const [isOpen, setIsOpen] = useState(false);
  const [screenshots, setScreenshots] = useState<string[]>([]);

  const bottomSheetContent = useMemo(() => {
    return (
      <Sheet open={isOpen} onOpenChange={() => setIsOpen(false)}>
        <SheetContent side='right' className="w-[300px] sm:w-[540px] overflow-auto">
          <SheetHeader>
            <SheetTitle>Screenshots view</SheetTitle>
            <SheetDescription>You can view captured screenshots here</SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            {screenshots.map((screenshot) => {
              return (
                <img src={screenshot} key={screenshot} className="w-full h-[80px]" />
              )
            })}
          </div>
        </SheetContent>
      </Sheet>
    )
  }, [isOpen, screenshots]);

  return {
    bottomSheetContent,
    show: () => setIsOpen(true),
    setScreenshots,
  }

}