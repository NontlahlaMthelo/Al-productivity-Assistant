import { createFileRoute } from "@tanstack/react-router";
import {
  Brain,
  ClipboardList,
  History as HistoryIcon,
  Mail,
  MessageSquare,
  Search,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { AppLayout, PageHeader } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useHistory, type HistoryKind } from "@/lib/history-store";

export const Route = createFileRoute("/history")({
  head: () => ({ meta: [{ title: "History — AI Workplace" }] }),
  component: HistoryPage,
});

const TABS: { value: "all" | HistoryKind; label: string; icon: typeof Mail }[] = [
  { value: "all", label: "All", icon: HistoryIcon },
  { value: "email", label: "Emails", icon: Mail },
  { value: "summary", label: "Summaries", icon: ClipboardList },
  { value: "task", label: "Tasks", icon: Brain },
  { value: "research", label: "Research", icon: Sparkles },
  { value: "chat", label: "Chats", icon: MessageSquare },
];

function HistoryPage() {
  const { items, remove, clear, ready } = useHistory();
  const [tab, setTab] = useState<"all" | HistoryKind>("all");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const base = tab === "all" ? items : items.filter((i) => i.kind === tab);
    if (!q.trim()) return base;
    const needle = q.toLowerCase();
    return base.filter(
      (i) => i.title.toLowerCase().includes(needle) || i.content.toLowerCase().includes(needle),
    );
  }, [items, tab, q]);

  return (
    <AppLayout>
      <PageHeader
        title="History"
        subtitle="Your recent AI activity across every tool."
        icon={HistoryIcon}
        actions={
          items.length > 0 && (
            <Button variant="outline" size="sm" onClick={clear} className="rounded-xl text-destructive">
              <Trash2 className="h-4 w-4" /> Clear all
            </Button>
          )
        }
      />

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search history…"
            className="h-11 rounded-xl pl-9"
          />
        </div>
        <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
          <TabsList className="rounded-xl">
            {TABS.map((t) => (
              <TabsTrigger key={t.value} value={t.value} className="rounded-lg text-xs">
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {!ready ? null : filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border/70 py-20 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl gradient-soft text-primary">
            <HistoryIcon className="h-6 w-6" />
          </span>
          <p className="mt-4 text-sm font-medium">No saved activity yet</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Generate and save outputs from any AI tool — they'll appear here.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {filtered.map((i) => {
            const T = TABS.find((t) => t.value === i.kind)!;
            const Icon = T.icon;
            return (
              <li
                key={i.id}
                className="group rounded-2xl border border-border/70 bg-card p-5 shadow-soft transition-all hover:border-primary/40 hover:shadow-elegant"
              >
                <div className="flex items-start gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl gradient-soft text-primary">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate text-sm font-semibold">{i.title}</h3>
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {T.label}
                      </span>
                      <span className="ml-auto text-xs text-muted-foreground">
                        {new Date(i.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{i.preview}</p>
                  </div>
                  <button
                    onClick={() => remove(i.id)}
                    className="rounded-lg p-2 text-muted-foreground opacity-0 transition-opacity hover:bg-destructive/15 hover:text-destructive group-hover:opacity-100"
                    aria-label="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </AppLayout>
  );
}
