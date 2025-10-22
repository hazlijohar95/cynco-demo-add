import { useState, useRef, useEffect, ReactNode } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";

interface ResizablePanelProps {
  leftPanel: ReactNode;
  rightPanel: ReactNode;
  defaultWidth?: number;
  minWidth?: number;
  maxWidth?: number;
}

export const ResizablePanel = ({
  leftPanel,
  rightPanel,
  defaultWidth = 400,
  minWidth = 300,
  maxWidth = 600,
}: ResizablePanelProps) => {
  const isMobile = useIsMobile();
  const [leftWidth, setLeftWidth] = useLocalStorage("cynco-panel-width", defaultWidth);
  const [isDragging, setIsDragging] = useState(false);
  const [showPulse, setShowPulse] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowPulse(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const newWidth = e.clientX - (containerRef.current?.getBoundingClientRect().left || 0);
      if (newWidth >= minWidth && newWidth <= maxWidth) {
        setLeftWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "[") {
          e.preventDefault();
          setLeftWidth((prev) => Math.max(minWidth, prev - 20));
        } else if (e.key === "]") {
          e.preventDefault();
          setLeftWidth((prev) => Math.min(maxWidth, prev + 20));
        }
      }
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isDragging, minWidth, maxWidth, setLeftWidth]);

  const handleDoubleClick = () => {
    setLeftWidth(defaultWidth);
  };

  // Mobile: Stack vertically
  if (isMobile) {
    return (
      <div className="flex flex-col flex-1 min-h-0">
        <div className="flex-1 min-h-0 overflow-hidden border-b-2 border-border">
          {rightPanel}
        </div>
        <div className="h-[45vh] min-h-[300px]">
          {leftPanel}
        </div>
      </div>
    );
  }

  // Desktop: Side-by-side with resizable divider
  return (
    <div ref={containerRef} className="flex flex-1 min-h-0 relative">
      <div style={{ width: `${leftWidth}px` }} className="flex-shrink-0 h-full">
        {leftPanel}
      </div>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              onMouseDown={() => setIsDragging(true)}
              onDoubleClick={handleDoubleClick}
              className="w-1 h-full bg-border hover:bg-foreground transition-colors cursor-col-resize flex items-center justify-center group relative flex-shrink-0"
            >
              <div className={`absolute inset-y-0 -left-1 -right-1 flex items-center justify-center opacity-30 group-hover:opacity-100 transition-opacity ${showPulse ? 'animate-pulse' : ''}`}>
                <div className="flex flex-col gap-0.5">
                  <div className="w-0.5 h-1 bg-current" />
                  <div className="w-0.5 h-1 bg-current" />
                  <div className="w-0.5 h-1 bg-current" />
                </div>
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent side="right" className="font-mono text-xs">
            <p>Width: {leftWidth}px</p>
            <p className="text-[10px] text-muted-foreground mt-1">
              Double-click to reset • Ctrl+[ / Ctrl+]
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div className="flex-1 h-full min-w-0">
        {rightPanel}
      </div>
    </div>
  );
};
