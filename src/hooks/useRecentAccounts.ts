import { useState, useEffect, useCallback } from "react";

const RECENT_ACCOUNTS_KEY = "cynco-recent-accounts";
const MAX_RECENT = 10;

export const useRecentAccounts = () => {
  const [recentAccounts, setRecentAccounts] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_ACCOUNTS_KEY);
      if (stored) {
        setRecentAccounts(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to load recent accounts:", error);
    }
  }, []);

  const addRecentAccount = useCallback((account: string) => {
    if (!account || account.trim() === "") return;

    setRecentAccounts((prev) => {
      // Remove if already exists
      const filtered = prev.filter((a) => a !== account);
      // Add to front
      const updated = [account, ...filtered].slice(0, MAX_RECENT);
      
      try {
        localStorage.setItem(RECENT_ACCOUNTS_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error("Failed to save recent accounts:", error);
      }

      return updated;
    });
  }, []);

  const clearRecentAccounts = useCallback(() => {
    setRecentAccounts([]);
    try {
      localStorage.removeItem(RECENT_ACCOUNTS_KEY);
    } catch (error) {
      console.error("Failed to clear recent accounts:", error);
    }
  }, []);

  return {
    recentAccounts,
    addRecentAccount,
    clearRecentAccounts,
  };
};
