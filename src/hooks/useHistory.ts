import { useState, useCallback } from "react";

export type ActionType =
  | "ADD_JOURNAL_ENTRY"
  | "EDIT_JOURNAL_ENTRY"
  | "DELETE_JOURNAL_ENTRY"
  | "ADD_OPENING_BALANCE"
  | "EDIT_OPENING_BALANCE"
  | "DELETE_OPENING_BALANCE"
  | "UPLOAD_OPENING_BALANCE_CSV"
  | "ADD_KNOWLEDGE_ENTRY"
  | "DELETE_KNOWLEDGE_ENTRY"
  | "RUN_SIMULATION";

export interface HistoryAction<T = any> {
  type: ActionType;
  timestamp: Date;
  data: T;
  inverseData?: T;
  description: string;
}

const MAX_HISTORY_SIZE = 50;

export const useHistory = <T = any>() => {
  const [history, setHistory] = useState<HistoryAction<T>[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const addAction = useCallback((action: HistoryAction<T>) => {
    setHistory((prev) => {
      // Remove any actions after current index (when user undoes then makes new action)
      const newHistory = prev.slice(0, currentIndex + 1);
      newHistory.push(action);
      
      // Keep only last MAX_HISTORY_SIZE actions
      if (newHistory.length > MAX_HISTORY_SIZE) {
        newHistory.shift();
        return newHistory;
      }
      
      return newHistory;
    });
    setCurrentIndex((prev) => Math.min(prev + 1, MAX_HISTORY_SIZE - 1));
  }, [currentIndex]);

  const undo = useCallback(() => {
    if (currentIndex < 0) return null;
    
    const action = history[currentIndex];
    setCurrentIndex((prev) => prev - 1);
    return action;
  }, [currentIndex, history]);

  const redo = useCallback(() => {
    if (currentIndex >= history.length - 1) return null;
    
    const action = history[currentIndex + 1];
    setCurrentIndex((prev) => prev + 1);
    return action;
  }, [currentIndex, history]);

  const canUndo = currentIndex >= 0;
  const canRedo = currentIndex < history.length - 1;

  const getLastAction = useCallback(() => {
    return currentIndex >= 0 ? history[currentIndex] : null;
  }, [currentIndex, history]);

  const clear = useCallback(() => {
    setHistory([]);
    setCurrentIndex(-1);
  }, []);

  return {
    addAction,
    undo,
    redo,
    canUndo,
    canRedo,
    getLastAction,
    clear,
    history,
    currentIndex,
  };
};
