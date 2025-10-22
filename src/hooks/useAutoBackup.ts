import { useEffect, useRef } from "react";

export interface BackupData {
  timestamp: string;
  journalEntries: any[];
  openingBalances: any[];
  knowledgeEntries: any[];
  version: string;
}

const BACKUP_KEY = "cynco-auto-backups";
const MAX_BACKUPS = 10;
const BACKUP_INTERVAL = 5 * 60 * 1000; // 5 minutes

export const useAutoBackup = (
  journalEntries: any[],
  openingBalances: any[],
  knowledgeEntries: any[]
) => {
  const lastBackupRef = useRef<string>("");
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const createBackup = () => {
      const currentData = JSON.stringify({
        journalEntries,
        openingBalances,
        knowledgeEntries,
      });

      // Only backup if data has changed
      if (currentData === lastBackupRef.current) return;

      const backup: BackupData = {
        timestamp: new Date().toISOString(),
        journalEntries,
        openingBalances,
        knowledgeEntries,
        version: "1.0",
      };

      try {
        const existingBackups = getBackups();
        const newBackups = [backup, ...existingBackups].slice(0, MAX_BACKUPS);
        localStorage.setItem(BACKUP_KEY, JSON.stringify(newBackups));
        lastBackupRef.current = currentData;
      } catch (error) {
        console.error("Failed to create backup:", error);
      }
    };

    // Create initial backup if data exists
    if (
      journalEntries.length > 0 ||
      openingBalances.length > 0 ||
      knowledgeEntries.length > 0
    ) {
      createBackup();
    }

    // Set up interval for auto-backup
    intervalRef.current = setInterval(createBackup, BACKUP_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [journalEntries, openingBalances, knowledgeEntries]);
};

export const getBackups = (): BackupData[] => {
  try {
    const backupsStr = localStorage.getItem(BACKUP_KEY);
    return backupsStr ? JSON.parse(backupsStr) : [];
  } catch (error) {
    console.error("Failed to get backups:", error);
    return [];
  }
};

export const deleteBackup = (timestamp: string) => {
  try {
    const backups = getBackups();
    const filtered = backups.filter((b) => b.timestamp !== timestamp);
    localStorage.setItem(BACKUP_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error("Failed to delete backup:", error);
  }
};

export const clearAllBackups = () => {
  try {
    localStorage.removeItem(BACKUP_KEY);
  } catch (error) {
    console.error("Failed to clear backups:", error);
  }
};

export const createManualBackup = (
  journalEntries: any[],
  openingBalances: any[],
  knowledgeEntries: any[]
): string => {
  const backup: BackupData = {
    timestamp: new Date().toISOString(),
    journalEntries,
    openingBalances,
    knowledgeEntries,
    version: "1.0",
  };

  const dataStr = JSON.stringify(backup, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `cynco-backup-${new Date().toISOString().split("T")[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return backup.timestamp;
};
