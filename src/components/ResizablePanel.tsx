import { useState, useRef, useEffect, ReactNode } from "react";
import { GripVertical } from "lucide-react";

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
  const [leftWidth, setLeftWidth] = useState(defaultWidth);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isDragging, minWidth, maxWidth]);

  return (
    <div ref={containerRef} className="flex flex-1 min-h-0 relative">
      {/* Left Panel */}
      <div
        style={{ width: `${leftWidth}px` }}
        className="flex-shrink-0 h-full"
      >
        {leftPanel}
      </div>

      {/* Draggable Divider */}
      <div
        onMouseDown={() => setIsDragging(true)}
        className="w-1 h-full bg-border hover:bg-foreground transition-colors cursor-col-resize flex items-center justify-center group relative flex-shrink-0"
      >
        <div className="absolute inset-y-0 -left-1 -right-1 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 h-full min-w-0">
        {rightPanel}
      </div>
    </div>
  );
};
