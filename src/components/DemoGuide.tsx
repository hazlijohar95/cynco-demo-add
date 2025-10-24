import { useState, useEffect } from "react";
import { X, ChevronRight, Check, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";

interface DemoStep {
  id: number;
  view: string;
  title: string;
  description: string;
  completed: boolean;
}

interface DemoGuideProps {
  activeView: string;
  onViewChange: (view: string) => void;
  onDismiss: () => void;
}

const demoSteps: Omit<DemoStep, "completed">[] = [
  {
    id: 1,
    view: "opening",
    title: "Opening Balance",
    description: "Review the starting financial position (Jan 1, 2024)"
  },
  {
    id: 2,
    view: "knowledge",
    title: "Knowledge Base",
    description: "Company documentation, policies & business context"
  },
  {
    id: 3,
    view: "coa",
    title: "Chart of Accounts",
    description: "Account structure and classification"
  },
  {
    id: 4,
    view: "journal",
    title: "Journal Entries",
    description: "Review Q1 2024 transactions (Jan-Mar)"
  },
  {
    id: 5,
    view: "ledger",
    title: "General Ledger",
    description: "See detailed account activity by account"
  },
  {
    id: 6,
    view: "reconciliation",
    title: "Bank Reconciliation",
    description: "Match cash account to bank statement (March 31)"
  },
  {
    id: 7,
    view: "trial",
    title: "Trial Balance",
    description: "Verify all debits equal credits"
  },
  {
    id: 8,
    view: "pl",
    title: "Profit & Loss",
    description: "Q1 revenue and expenses summary"
  },
  {
    id: 9,
    view: "balance",
    title: "Balance Sheet",
    description: "Current financial position (March 31)"
  }
];

export function DemoGuide({ activeView, onViewChange, onDismiss }: DemoGuideProps) {
  const [visitedViews, setVisitedViews] = useState<Set<string>>(new Set([activeView]));
  const [steps, setSteps] = useState<DemoStep[]>(
    demoSteps.map(step => ({ ...step, completed: step.view === activeView }))
  );

  useEffect(() => {
    setVisitedViews(prev => new Set([...prev, activeView]));
    setSteps(prevSteps =>
      prevSteps.map(step => ({
        ...step,
        completed: visitedViews.has(step.view) || step.view === activeView
      }))
    );
  }, [activeView, visitedViews]);

  const currentStepIndex = steps.findIndex(step => step.view === activeView);
  const completedCount = steps.filter(s => s.completed).length;
  const progress = (completedCount / steps.length) * 100;
  const nextStep = steps[currentStepIndex + 1];

  return (
    <Card className="fixed bottom-6 right-6 w-96 shadow-2xl border-2 border-primary/20 bg-background/95 backdrop-blur-sm z-50 animate-in slide-in-from-bottom-5">
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-bold text-lg">🎓 Demo Tour</h3>
            <p className="text-sm text-muted-foreground">
              {completedCount} of {steps.length} steps completed
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 -mt-1"
            onClick={onDismiss}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
        </div>

        {/* Current Step */}
        <div className="bg-primary/10 rounded-lg p-3 border border-primary/20">
          <div className="flex items-center gap-2 mb-1">
            <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
              {currentStepIndex + 1}
            </div>
            <h4 className="font-semibold">{steps[currentStepIndex]?.title}</h4>
          </div>
          <p className="text-sm text-muted-foreground ml-8">
            {steps[currentStepIndex]?.description}
          </p>
        </div>

        {/* Next Step */}
        {nextStep && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ChevronRight className="h-4 w-4" />
              <span>Next step:</span>
            </div>
            <Button
              variant="outline"
              className="w-full justify-between group hover:bg-primary hover:text-primary-foreground"
              onClick={() => onViewChange(nextStep.view)}
            >
              <span className="flex items-center gap-2">
                <span className="h-5 w-5 rounded-full border border-current flex items-center justify-center text-xs">
                  {nextStep.id}
                </span>
                {nextStep.title}
              </span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        )}

        {/* All Steps List */}
        <div className="border-t pt-3 max-h-48 overflow-y-auto space-y-1">
          {steps.map((step, index) => (
            <button
              key={step.id}
              onClick={() => onViewChange(step.view)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center gap-2 ${
                step.view === activeView
                  ? "bg-primary/20 text-foreground font-medium"
                  : step.completed
                  ? "bg-muted/50 text-muted-foreground hover:bg-muted"
                  : "text-muted-foreground/60 hover:bg-muted/30"
              }`}
            >
              <div
                className={`h-5 w-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${
                  step.completed
                    ? "bg-green-600 text-white"
                    : "border border-current"
                }`}
              >
                {step.completed ? <Check className="h-3 w-3" /> : index + 1}
              </div>
              <span className="truncate">{step.title}</span>
            </button>
          ))}
        </div>

        {/* Completion Message */}
        {completedCount === steps.length && (
          <div className="bg-green-600/10 border border-green-600/20 rounded-lg p-3 text-center">
            <p className="text-sm font-medium text-green-600">
              🎉 Tour Complete! You've explored all features.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
