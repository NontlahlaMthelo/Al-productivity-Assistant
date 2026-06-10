import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Brain,
  CheckCircle2,
  ClipboardList,
  Clock,
  FileText,
  Mail,
  MessageSquare,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — AI Workplace" },
      { name: "description", content: "Your AI productivity command center." },
    ],
  }),
  component: Dashboard,
});

const FEATURES = [
  {
    to: "/email",
    icon: Mail,
    title: "Smart Email Generator",
    desc: "Generate professional emails instantly.",
  },
  {
    to: "/summarizer",
    icon: ClipboardList,
    title: "Meeting Notes Summarizer",
    desc: "Turn lengthy meeting transcripts into concise summaries.",
  },
  {
    to: "/planner",
    icon: Brain,
    title: "AI Task Planner",
    desc: "Prioritize and organize work efficiently.",
  },
  {
    to: "/research",
    icon: Sparkles,
    title: "AI Research Assistant",
    desc: "Generate workplace research and reports.",
  },
  {
    to: "/chat",
    icon: MessageSquare,
    title: "AI Chat Assistant",
    desc: "Get instant workplace support and answers.",
  },
] as const;

const KPIS = [
  { label: "Tasks Completed", value: "128", icon: CheckCircle2, trend: "+12%" },
  { label: "Time Saved", value: "37h", icon: Clock, trend: "+4h" },
  { label: "Emails Generated", value: "246", icon: Mail, trend: "+18%" },
  { label: "Research Reports", value: "82", icon: FileText, trend: "+9" },
];

function Dashboard() {
  return (
    <AppLayout>
      {/* Hero */}
      <section className="relative mb-8 overflow-hidden rounded-3xl gradient-primary p-8 text-white shadow-elegant sm:p-10">
        <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute right-10 top-10 animate-pulse">
          <Sparkles className="h-6 w-6 text-white/40" />
        </div>
        <div className="relative">
          <p className="text-sm font-medium uppercase tracking-wider text-white/80">
            Welcome back
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Good Morning, Sarah <span className="inline-block animate-wave">👋</span>
          </h1>
          <p className="mt-2 max-w-xl text-white/85">
            Your AI productivity workspace is ready.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Stat label="Productivity score" value="92" suffix="/100" />
            <Stat label="Tasks due today" value="7" />
            <Stat label="Weekly performance" value="+18%" />
            <Stat label="Time saved with AI" value="37h" />
          </div>
        </div>
      </section>

      {/* KPIs */}
      <section className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {KPIS.map((k) => {
          const Icon = k.icon;
          return (
            <div
              key={k.label}
              className="group rounded-2xl border border-border/70 bg-card p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-elegant"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl gradient-soft text-primary">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[11px] font-semibold text-accent">
                  {k.trend}
                </span>
              </div>
              <p className="mt-4 text-2xl font-bold tracking-tight">{k.value}</p>
              <p className="text-xs text-muted-foreground">{k.label}</p>
            </div>
          );
        })}
      </section>

      {/* Feature grid */}
      <section className="mb-10">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Quick actions</h2>
            <p className="text-sm text-muted-foreground">
              Jump into any AI tool and start working in seconds.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <Link
                key={f.to}
                to={f.to}
                className="group relative overflow-hidden rounded-2xl border border-border/70 bg-card p-6 shadow-soft transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-elegant"
              >
                <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full gradient-soft opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="relative">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl gradient-primary text-white shadow-elegant">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
                  <span className="mt-6 inline-flex items-center gap-1.5 rounded-xl bg-foreground px-3.5 py-2 text-xs font-semibold text-background transition-all group-hover:gap-2.5">
                    Open
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Analytics / activity */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-soft lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold">Weekly productivity</h3>
            <span className="flex items-center gap-1 text-xs font-medium text-accent">
              <TrendingUp className="h-3.5 w-3.5" /> Trending up
            </span>
          </div>
          <BarChart />
        </div>
        <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-soft">
          <h3 className="mb-4 font-semibold">Today's focus</h3>
          <ul className="space-y-3 text-sm">
            {[
              { t: "Draft Q4 strategy email", c: true },
              { t: "Summarize sync with design", c: true },
              { t: "Research competitor pricing", c: false },
              { t: "Prep roadmap for review", c: false },
            ].map((i, idx) => (
              <li
                key={idx}
                className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/60 p-3"
              >
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${i.c ? "border-accent bg-accent text-white" : "border-muted-foreground/30"}`}
                >
                  {i.c && <CheckCircle2 className="h-3 w-3" />}
                </span>
                <span className={i.c ? "text-muted-foreground line-through" : ""}>{i.t}</span>
              </li>
            ))}
          </ul>
          <Link
            to="/planner"
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl gradient-primary px-3 py-2.5 text-sm font-semibold text-white shadow-elegant transition-transform hover:scale-[1.01]"
          >
            <Zap className="h-4 w-4" /> Open planner
          </Link>
        </div>
      </section>
    </AppLayout>
  );
}

function Stat({ label, value, suffix }: { label: string; value: string; suffix?: string }) {
  return (
    <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
      <p className="text-xs font-medium text-white/75">{label}</p>
      <p className="mt-1 text-2xl font-bold tracking-tight">
        {value}
        {suffix && <span className="text-sm font-medium text-white/70">{suffix}</span>}
      </p>
    </div>
  );
}

function BarChart() {
  const data = [42, 58, 49, 73, 65, 84, 92];
  const labels = ["M", "T", "W", "T", "F", "S", "S"];
  const max = Math.max(...data);
  return (
    <div className="flex h-48 items-end gap-3">
      {data.map((v, i) => (
        <div key={i} className="flex flex-1 flex-col items-center gap-2">
          <div className="relative flex w-full flex-1 items-end">
            <div
              className="w-full rounded-xl gradient-primary shadow-elegant transition-all hover:opacity-90"
              style={{ height: `${(v / max) * 100}%` }}
              title={`${v}%`}
            />
          </div>
          <span className="text-xs text-muted-foreground">{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}
