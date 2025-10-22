import { Badge } from "@/components/ui/badge";
import { Eye, Database, TrendingUp } from "lucide-react";

interface ContextIndicatorProps {
  currentView: string;
  totalEntries: number;
  isBalanced: boolean;
}

export const ContextIndicator = ({ currentView, totalEntries, isBalanced }: ContextIndicatorProps) => {
  const getViewLabel = (view: string) => {
    const labels: Record<string, string> = {
      "coa": "Chart of Accounts",
      "journal": "Journal Entries",
      "ledger": "Ledger",
      "trial-balance": "Trial Balance",
      "balance-sheet": "Balance Sheet",
      "profit-loss": "P&L Statement",
      "opening": "Opening Balances",
      "knowledge": "Knowledge Base",
    };
    return labels[view] || view;
  };

  return (
    <div className="border-t border-border px-3 py-2.5 bg-muted/20 flex items-center gap-2 text-[11px] font-mono flex-wrap">
      <div className="flex items-center gap-2">
        <Eye className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
        <span className="text-muted-foreground hidden sm:inline">AI Context:</span>
      </div>
      
      <Badge variant="outline" className="text-[10px] font-mono h-6 px-2.5 flex-shrink-0">
        {getViewLabel(currentView)}
      </Badge>
      
      {totalEntries > 0 && (
        <div className="flex items-center gap-1.5">
          <Database className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
          <span className="text-muted-foreground whitespace-nowrap">{totalEntries}</span>
        </div>
      )}
      
      {totalEntries > 0 && (
        <Badge 
          variant={isBalanced ? "default" : "destructive"} 
          className="text-[10px] font-mono h-6 px-2.5 ml-auto flex-shrink-0"
        >
          <span className="hidden sm:inline">{isBalanced ? "✓ Balanced" : "✗ Unbalanced"}</span>
          <span className="sm:hidden">{isBalanced ? "✓" : "✗"}</span>
        </Badge>
      )}
    </div>
  );
};
