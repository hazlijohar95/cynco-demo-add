import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface SuggestedPromptsProps {
  currentView: string;
  hasData: boolean;
  onSelectPrompt: (prompt: string) => void;
}

export const SuggestedPrompts = ({ currentView, hasData, onSelectPrompt }: SuggestedPromptsProps) => {
  const getPrompts = () => {
    if (!hasData) {
      return [
        "Run simulation to generate sample data",
        "What kind of reports can you generate?",
        "How do I record a sales transaction?",
        "Explain double-entry bookkeeping",
      ];
    }

    switch (currentView) {
      case "balance-sheet":
        return [
          "What's my current financial position?",
          "Analyze my assets vs liabilities",
          "Is my equity healthy for my business?",
          "Show me the debt-to-equity ratio",
        ];
      case "profit-loss":
        return [
          "What's my net profit this period?",
          "Which expenses are highest?",
          "Calculate my profit margin",
          "Compare revenue vs expenses",
        ];
      case "trial-balance":
        return [
          "Is my trial balance correct?",
          "Find any unbalanced entries",
          "Show total debits and credits",
          "Verify all accounts balance",
        ];
      case "journal":
        return [
          "Explain the last 3 transactions",
          "Find duplicate entries",
          "Show me revenue transactions",
          "Which entries affect cash?",
        ];
      case "opening":
        return [
          "Are opening balances balanced?",
          "What accounts have opening balances?",
          "Verify opening balance total",
          "How do opening balances work?",
        ];
      default:
        return [
          "What's my cash balance?",
          "Show me a financial summary",
          "Are there any accounting errors?",
          "Analyze my business performance",
        ];
    }
  };

  const prompts = getPrompts();

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 mb-2">
        <Sparkles className="h-3 w-3 text-muted-foreground" />
        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
          Suggested
        </span>
      </div>
      <div className="grid grid-cols-1 gap-1.5">
        {prompts.map((prompt, idx) => (
          <Button
            key={idx}
            variant="outline"
            size="sm"
            onClick={() => onSelectPrompt(prompt)}
            className="h-auto py-2 px-3 text-left justify-start font-mono text-[10px] leading-relaxed hover:bg-muted/50 transition-colors"
          >
            {prompt}
          </Button>
        ))}
      </div>
    </div>
  );
};
