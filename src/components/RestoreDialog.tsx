import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getBackups, BackupData, deleteBackup } from "@/hooks/useAutoBackup";
import { toast } from "sonner";
import { Upload, Trash2, RefreshCw } from "lucide-react";

interface RestoreDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRestore: (data: BackupData) => void;
}

export const RestoreDialog = ({ open, onOpenChange, onRestore }: RestoreDialogProps) => {
  const [backups, setBackups] = useState<BackupData[]>(getBackups());
  const [selectedBackup, setSelectedBackup] = useState<BackupData | null>(null);
  const [showUpload, setShowUpload] = useState(false);

  const handleRefresh = () => {
    setBackups(getBackups());
    toast.success("Backup list refreshed");
  };

  const handleDelete = (timestamp: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteBackup(timestamp);
    setBackups(getBackups());
    toast.success("Backup deleted");
  };

  const handleRestore = () => {
    if (!selectedBackup) return;
    onRestore(selectedBackup);
    onOpenChange(false);
    toast.success("Data restored successfully");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.journalEntries && data.openingBalances && data.knowledgeEntries) {
          onRestore(data);
          onOpenChange(false);
          toast.success("Backup file restored successfully");
        } else {
          toast.error("Invalid backup file format");
        }
      } catch (error) {
        toast.error("Failed to parse backup file");
      }
    };
    reader.readAsText(file);
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const getSummary = (backup: BackupData) => {
    return `${backup.journalEntries.length} journal entries, ${backup.openingBalances.length} opening balances, ${backup.knowledgeEntries.length} knowledge items`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl font-mono">
        <DialogHeader>
          <DialogTitle className="text-sm font-bold">Restore from Backup</DialogTitle>
          <DialogDescription className="text-xs">
            Select a backup to restore or upload a backup file
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="text-xs gap-2"
            >
              <RefreshCw className="h-3 w-3" />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => document.getElementById("backup-file-input")?.click()}
              className="text-xs gap-2"
            >
              <Upload className="h-3 w-3" />
              Upload Backup
            </Button>
            <input
              id="backup-file-input"
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>

          <ScrollArea className="h-[400px] border border-border">
            {backups.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-xs text-muted-foreground">No backups found</p>
                <p className="text-[10px] text-muted-foreground mt-2">
                  Backups are created automatically every 5 minutes
                </p>
              </div>
            ) : (
              <div className="p-2 space-y-2">
                {backups.map((backup) => (
                  <div
                    key={backup.timestamp}
                    className={`border border-border p-3 cursor-pointer transition-colors ${
                      selectedBackup?.timestamp === backup.timestamp
                        ? "bg-foreground text-background"
                        : "hover:bg-muted"
                    }`}
                    onClick={() => setSelectedBackup(backup)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="text-xs font-semibold">
                          {formatDate(backup.timestamp)}
                        </p>
                        <p className="text-[10px] opacity-70 mt-1">
                          {getSummary(backup)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => handleDelete(backup.timestamp, e)}
                        className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} size="sm">
            Cancel
          </Button>
          <Button onClick={handleRestore} disabled={!selectedBackup} size="sm">
            Restore Selected
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
