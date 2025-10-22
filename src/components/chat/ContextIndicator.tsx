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
    <div className="border-t border-border px-5 py-3 bg-muted/20 flex items-center gap-3 text-[11px] font-mono">
      <Eye className="h-3.5 w-3.5 text-muted-foreground" />
      <span className="text-muted-foreground">AI Context:</span>
      
      <Badge variant="outline" className="text-[10px] font-mono h-6 px-2.5">
        {getViewLabel(currentView)}
      </Badge>
      
      {totalEntries > 0 && (
        <>
          <Database className="h-3.5 w-3.5 text-muted-foreground ml-1" />
          <span className="text-muted-foreground">{totalEntries} entries</span>
        </>
      )}
      
      {totalEntries > 0 && (
        <Badge 
          variant={isBalanced ? "default" : "destructive"} 
          className="text-[10px] font-mono h-6 px-2.5 ml-auto"
        >
          {isBalanced ? "✓ Balanced" : "✗ Unbalanced"}
        </Badge>
      )}
    </div>
  );
};
