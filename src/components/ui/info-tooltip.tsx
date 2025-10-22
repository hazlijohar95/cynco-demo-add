import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface InfoTooltipProps {
  content: string | React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  className?: string;
}

export const InfoTooltip = ({ content, side = "right", className = "" }: InfoTooltipProps) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <button
            type="button"
            className={`inline-flex items-center justify-center hover:opacity-70 transition-opacity ${className}`}
          >
            <Info className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        </TooltipTrigger>
        <TooltipContent side={side} className="max-w-xs font-mono text-xs">
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

interface PageHeaderProps {
  title: string;
  description: string;
}

export const PageHeader = ({ title, description }: PageHeaderProps) => {
  return (
    <div className="border-b border-border pb-4 mb-6">
      <div className="flex items-center gap-2">
        <h2 className="text-2xl font-mono font-bold tracking-tight">{title}</h2>
        <InfoTooltip content={description} />
      </div>
    </div>
  );
};
