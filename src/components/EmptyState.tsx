import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actions?: {
    label: string;
    onClick: () => void;
    variant?: "default" | "outline" | "ghost";
  }[];
  tip?: string;
}

export const EmptyState = ({ icon: Icon, title, description, actions, tip }: EmptyStateProps) => {
  return (
    <div className="flex items-center justify-center min-h-[500px] p-8">
      <div className="max-w-md text-center space-y-6">
        <div className="flex justify-center">
          <div className="h-16 w-16 border-2 border-border flex items-center justify-center">
            <Icon className="h-8 w-8 text-muted-foreground" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="font-mono text-sm font-bold">{title}</h3>
          <p className="font-mono text-xs text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>

        {actions && actions.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            {actions.map((action, index) => (
              <Button
                key={index}
                onClick={action.onClick}
                variant={action.variant || "default"}
                size="sm"
                className="font-mono text-xs"
              >
                {action.label}
              </Button>
            ))}
          </div>
        )}

        {tip && (
          <div className="mt-6 p-3 bg-muted/30 border border-border">
            <p className="font-mono text-[10px] text-muted-foreground">
              <strong>Tip:</strong> {tip}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
