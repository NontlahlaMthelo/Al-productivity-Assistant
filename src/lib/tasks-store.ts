import { useEffect, useState, useCallback } from "react";

export type Category = "personal" | "work" | "shopping" | "health";

export interface Task {
  id: string;
  title: string;
  category: Category;
  completed: boolean;
  createdAt: number;
}

const STORAGE_KEY = "tasks.v1";

export const CATEGORIES: { value: Category; label: string }[] = [
  { value: "personal", label: "Personal" },
  { value: "work", label: "Work" },
  { value: "shopping", label: "Shopping" },
  { value: "health", label: "Health" },
];

function load(): Task[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Task[]) : [];
  } catch {
    return [];
  }
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setTasks(load());
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks, ready]);

  const addTask = useCallback((title: string, category: Category) => {
    setTasks((t) => [
      { id: crypto.randomUUID(), title, category, completed: false, createdAt: Date.now() },
      ...t,
    ]);
  }, []);

  const toggleTask = useCallback((id: string) => {
    setTasks((t) => t.map((x) => (x.id === id ? { ...x, completed: !x.completed } : x)));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((t) => t.filter((x) => x.id !== id));
  }, []);

  return { tasks, addTask, toggleTask, deleteTask, ready };
}
