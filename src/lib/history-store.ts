import { useCallback, useEffect, useState } from "react";

export type HistoryKind = "email" | "summary" | "task" | "research" | "chat";

export type HistoryItem = {
  id: string;
  kind: HistoryKind;
  title: string;
  preview: string;
  content: string;
  createdAt: number;
};

const KEY = "aiwp.history.v1";

function load(): HistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as HistoryItem[]) : [];
  } catch {
    return [];
  }
}

export function useHistory() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setItems(load());
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(KEY, JSON.stringify(items));
  }, [items, ready]);

  const add = useCallback((item: Omit<HistoryItem, "id" | "createdAt">) => {
    setItems((prev) => [
      { ...item, id: crypto.randomUUID(), createdAt: Date.now() },
      ...prev,
    ].slice(0, 200));
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  return { items, ready, add, remove, clear };
}

export function addHistoryItem(item: Omit<HistoryItem, "id" | "createdAt">) {
  if (typeof window === "undefined") return;
  const items = load();
  const next = [
    { ...item, id: crypto.randomUUID(), createdAt: Date.now() },
    ...items,
  ].slice(0, 200);
  localStorage.setItem(KEY, JSON.stringify(next));
}
