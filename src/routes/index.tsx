import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, type FormEvent } from "react";
import { Check, Leaf, Moon, Plus, Sun, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIES, useTasks, type Category } from "@/lib/tasks-store";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sage — Calm task management" },
      {
        name: "description",
        content:
          "A minimal, calming task manager with categories and dark mode. Stay focused, stay grounded.",
      },
      { property: "og:title", content: "Sage — Calm task management" },
      {
        property: "og:description",
        content:
          "A minimal, calming task manager with categories and dark mode.",
      },
    ],
  }),
  component: Index,
});

type Filter = "all" | Category;

function Index() {
  const { tasks, addTask, toggleTask, deleteTask, ready } = useTasks();
  const { theme, toggle } = useTheme();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Category>("personal");
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = useMemo(
    () => (filter === "all" ? tasks : tasks.filter((t) => t.category === filter)),
    [tasks, filter],
  );

  const remaining = tasks.filter((t) => !t.completed).length;

  const handleAdd = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    addTask(trimmed, category);
    setTitle("");
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-2xl px-5 pt-12 pb-24 sm:pt-20">
        {/* Header */}
        <header className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <Leaf className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight">Sage</h1>
              <p className="text-xs text-muted-foreground">
                {ready ? `${remaining} task${remaining === 1 ? "" : "s"} remaining` : "\u00a0"}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle dark mode"
            onClick={toggle}
            className="rounded-full"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </header>

        {/* Add form */}
        <form
          onSubmit={handleAdd}
          className="mb-6 flex flex-col gap-2 rounded-2xl border bg-card p-3 shadow-sm sm:flex-row"
        >
          <Input
            placeholder="What needs doing?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border-0 bg-transparent shadow-none focus-visible:ring-0 sm:flex-1"
          />
          <div className="flex gap-2">
            <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
              <SelectTrigger className="w-36 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type="submit" className="rounded-xl" disabled={!title.trim()}>
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>
        </form>

        {/* Filters */}
        <div className="mb-4 flex flex-wrap gap-1.5">
          <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>
            All
          </FilterChip>
          {CATEGORIES.map((c) => (
            <FilterChip
              key={c.value}
              active={filter === c.value}
              onClick={() => setFilter(c.value)}
            >
              {c.label}
            </FilterChip>
          ))}
        </div>

        {/* Task list */}
        <ul className="space-y-2">
          {filtered.map((task) => (
            <li
              key={task.id}
              className="group flex items-center gap-3 rounded-xl border bg-card p-3 transition-colors hover:border-primary/40"
            >
              <button
                onClick={() => toggleTask(task.id)}
                aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
                className={cn(
                  "flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all",
                  task.completed
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-muted-foreground/30 hover:border-primary",
                )}
              >
                {task.completed && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
              </button>
              <div className="min-w-0 flex-1">
                <p
                  className={cn(
                    "truncate text-sm transition-all",
                    task.completed && "text-muted-foreground line-through",
                  )}
                >
                  {task.title}
                </p>
              </div>
              <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-accent-foreground">
                {CATEGORIES.find((c) => c.value === task.category)?.label}
              </span>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Delete task"
                onClick={() => deleteTask(task.id)}
                className="h-8 w-8 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>

        {ready && filtered.length === 0 && (
          <div className="mt-12 rounded-2xl border border-dashed py-16 text-center">
            <Leaf className="mx-auto h-8 w-8 text-primary/50" />
            <p className="mt-3 text-sm text-muted-foreground">
              {tasks.length === 0 ? "A clear mind. Add your first task." : "Nothing here yet."}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors",
        active
          ? "bg-primary text-primary-foreground"
          : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground",
      )}
    >
      {children}
    </button>
  );
}
