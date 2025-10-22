import { EmptyState } from "@/components/EmptyState";
import { FileSpreadsheet } from "lucide-react";

interface EmptyStateJournalProps {
  onAddNew: () => void;
  onRunSimulation: () => void;
}

export const EmptyStateJournal = ({ onAddNew, onRunSimulation }: EmptyStateJournalProps) => {
  return (
    <EmptyState
      icon={FileSpreadsheet}
      title="No Journal Entries Yet"
      description="Journal entries are the foundation of your accounting system. They record every financial transaction affecting your business. Start by creating your first entry or run a simulation to see how it works."
      actions={[
        {
          label: "Add First Entry",
          onClick: onAddNew,
          variant: "default",
        },
        {
          label: "Run Sample Simulation",
          onClick: onRunSimulation,
          variant: "outline",
        },
      ]}
      tip="Each journal entry must balance (debits = credits). Use the AI assistant to upload documents and automatically create entries."
    />
  );
};
