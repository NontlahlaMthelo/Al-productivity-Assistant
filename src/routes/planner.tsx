import { createFileRoute } from "@tanstack/react-router";
import { Brain, ChevronLeft, ChevronRight, Plus, Wand2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AiOutput } from "@/components/AiOutput";
import { AppLayout, PageHeader } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { planTasks } from "@/lib/ai.functions";

export const Route = createFileRoute("/planner")({
  head: () => ({ meta: [{ title: "AI Task Planner — AI Workplace" }] }),
  component: Planner,
});

const COLUMNS = ["To Do", "In Progress", "Review", "Completed"] as const;
type Column = (typeof COLUMNS)[number];
type Card = { id: string; title: string; column: Column };

function Planner() {
  const [taskName, setTaskName] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [project, setProject] = useState("");
  const [team, setTeam] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [cards, setCards] = useState<Card[]>([
    { id: "1", title: "Define success metrics", column: "To Do" },
    { id: "2", title: "Draft project brief", column: "In Progress" },
    { id: "3", title: "Review wireframes with design", column: "Review" },
    { id: "4", title: "Kickoff meeting scheduled", column: "Completed" },
  ]);

  const run = async () => {
    if (!taskName.trim()) {
      toast.error("Add a task name first");
      return;
    }
    setLoading(true);
    try {
      const res = await planTasks({
        data: { taskName, deadline, priority, project, team },
      });
      setOutput(res.text);
      // Extract suggested tasks
      const lines = res.text.split("\n");
      const start = lines.findIndex((l) => /suggested kanban/i.test(l));
      if (start >= 0) {
        const added: Card[] = [];
        for (let i = start + 1; i < lines.length; i++) {
          const m = lines[i].match(/^\s*[-*]\s*(?:\[(.+?)\]\s*)?(.+?)(?:\s+—|$)/);
          if (!m) {
            if (/^##\s/.test(lines[i])) break;
            continue;
          }
          const status = (m[1] || "").toLowerCase();
          const col: Column = status.includes("progress")
            ? "In Progress"
            : status.includes("review")
              ? "Review"
              : status.includes("complete") || status.includes("done")
                ? "Completed"
                : "To Do";
          added.push({ id: crypto.randomUUID(), title: m[2].trim(), column: col });
          if (added.length >= 12) break;
        }
        if (added.length) setCards(added);
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  };

  const move = (id: string, dir: -1 | 1) => {
    setCards((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const idx = COLUMNS.indexOf(c.column);
        const next = Math.max(0, Math.min(COLUMNS.length - 1, idx + dir));
        return { ...c, column: COLUMNS[next] };
      }),
    );
  };
  const remove = (id: string) => setCards((p) => p.filter((c) => c.id !== id));
  const addCard = () => {
    const title = prompt("New task title");
    if (!title?.trim()) return;
    setCards((p) => [...p, { id: crypto.randomUUID(), title: title.trim(), column: "To Do" }]);
  };

  return (
    <AppLayout>
      <PageHeader
        title="AI Task Planner"
        subtitle="Generate a roadmap and organize your work on a beautiful kanban."
        icon={Brain}
      />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-soft">
          <Field label="Task Name">
            <Input value={taskName} onChange={(e) => setTaskName(e.target.value)} placeholder="e.g. Launch new pricing page" />
          </Field>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Deadline">
              <Input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
            </Field>
            <Field label="Priority">
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["Low", "Medium", "High", "Critical"].map((p) => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Project">
              <Input value={project} onChange={(e) => setProject(e.target.value)} placeholder="e.g. Growth Q4" />
            </Field>
            <Field label="Team Members">
              <Input value={team} onChange={(e) => setTeam(e.target.value)} placeholder="e.g. Sarah, Alex, Mei" />
            </Field>
          </div>
          <Button
            onClick={run}
            disabled={loading}
            className="mt-6 h-11 w-full rounded-xl gradient-primary text-white shadow-elegant hover:opacity-95"
          >
            <Wand2 className="h-4 w-4" />
            {loading ? "Planning…" : "Generate AI Plan"}
          </Button>
        </div>
        <AiOutput
          value={output}
          onChange={setOutput}
          loading={loading}
          onRegenerate={run}
          filename="task-plan.md"
          kind="task"
          title={taskName || "Task plan"}
          placeholder="Roadmap, suggested tasks, and risks will appear here."
        />
      </div>

      <div className="mt-10">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Kanban board</h2>
          <Button variant="outline" size="sm" onClick={addCard} className="rounded-xl">
            <Plus className="h-4 w-4" /> Add task
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {COLUMNS.map((col) => {
            const items = cards.filter((c) => c.column === col);
            return (
              <div key={col} className="rounded-2xl border border-border/70 bg-card/60 p-4 shadow-soft">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold">{col}</h3>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                    {items.length}
                  </span>
                </div>
                <div className="space-y-2">
                  {items.map((c) => (
                    <div
                      key={c.id}
                      className="group rounded-xl border border-border/60 bg-background p-3 shadow-soft transition-all hover:border-primary/40"
                    >
                      <p className="text-sm">{c.title}</p>
                      <div className="mt-2 flex items-center justify-between opacity-0 transition-opacity group-hover:opacity-100">
                        <div className="flex gap-1">
                          <button
                            onClick={() => move(c.id, -1)}
                            disabled={c.column === COLUMNS[0]}
                            className="rounded-md p-1 text-muted-foreground hover:bg-muted disabled:opacity-30"
                            aria-label="Move left"
                          >
                            <ChevronLeft className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => move(c.id, 1)}
                            disabled={c.column === COLUMNS[COLUMNS.length - 1]}
                            className="rounded-md p-1 text-muted-foreground hover:bg-muted disabled:opacity-30"
                            aria-label="Move right"
                          >
                            <ChevronRight className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <button
                          onClick={() => remove(c.id)}
                          className="rounded-md p-1 text-muted-foreground hover:bg-destructive/15 hover:text-destructive"
                          aria-label="Delete"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {items.length === 0 && (
                    <p className="rounded-xl border border-dashed border-border/60 py-6 text-center text-xs text-muted-foreground">
                      No tasks
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
