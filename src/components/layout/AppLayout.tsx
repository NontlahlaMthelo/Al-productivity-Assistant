import { Link, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  Brain,
  ChevronsLeft,
  ClipboardList,
  Cog,
  History,
  LayoutDashboard,
  Mail,
  Menu,
  MessageSquare,
  Moon,
  Plus,
  Search,
  Sparkles,
  Sun,
  X,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard };

const NAV: NavItem[] = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/email", label: "Smart Email Generator", icon: Mail },
  { to: "/summarizer", label: "Meeting Notes Summarizer", icon: ClipboardList },
  { to: "/planner", label: "AI Task Planner", icon: Brain },
  { to: "/research", label: "AI Research Assistant", icon: Sparkles },
  { to: "/chat", label: "AI Chat Assistant", icon: MessageSquare },
  { to: "/history", label: "History", icon: History },
  { to: "/settings", label: "Settings", icon: Cog },
];

export function AppLayout({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Decorative gradient orbs */}
      <div
        aria-hidden
        className="pointer-events-none fixed -top-40 -right-40 h-[500px] w-[500px] rounded-full opacity-30 blur-3xl gradient-primary"
      />
      <div
        aria-hidden
        className="pointer-events-none fixed bottom-0 left-1/3 h-[400px] w-[400px] rounded-full opacity-20 blur-3xl gradient-accent"
      />

      <div className="relative flex">
        {/* Desktop sidebar */}
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 lg:block">
          <Sidebar />
        </aside>

        {/* Mobile sidebar */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <aside className="absolute left-0 top-0 h-full w-72 animate-in slide-in-from-left">
              <Sidebar onNavigate={() => setMobileOpen(false)} />
            </aside>
          </div>
        )}

        <div className="min-w-0 flex-1">
          <TopBar onOpenMobile={() => setMobileOpen(true)} />
          <main className="px-4 pb-24 pt-6 sm:px-6 lg:px-10">{children}</main>
        </div>
      </div>
    </div>
  );
}

function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="flex h-full flex-col gap-2 border-r border-border/60 glass p-4">
      <div className="flex items-center justify-between px-2 pb-2 pt-1">
        <Link to="/" onClick={onNavigate} className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary text-white shadow-elegant">
            <Sparkles className="h-5 w-5" />
          </span>
          <span className="text-base font-semibold tracking-tight">
            <span className="text-gradient">AI Workplace</span>
          </span>
        </Link>
        {onNavigate && (
          <button
            onClick={onNavigate}
            aria-label="Close menu"
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted lg:hidden"
          >
            <ChevronsLeft className="h-4 w-4" />
          </button>
        )}
      </div>
      <nav className="mt-2 flex flex-col gap-1">
        {NAV.map((item) => {
          const active = pathname === item.to;
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                active
                  ? "gradient-primary text-white shadow-elegant"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="h-4.5 w-4.5 h-4 w-4 shrink-0" />
              <span className="truncate">{item.label}</span>
              {active && (
                <span className="absolute right-3 h-1.5 w-1.5 rounded-full bg-white/80" />
              )}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto rounded-2xl p-4 gradient-soft">
        <p className="text-xs font-medium text-foreground/80">Pro tip</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Use natural language — your AI Workplace understands context across all tools.
        </p>
      </div>
    </div>
  );
}

function TopBar({ onOpenMobile }: { onOpenMobile: () => void }) {
  const { theme, toggle } = useTheme();
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 glass px-4 py-3 sm:px-6 lg:px-10">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobile}
          aria-label="Open menu"
          className="rounded-lg p-2 text-muted-foreground hover:bg-muted lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="relative hidden flex-1 max-w-md md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search workspace, tools, history…"
            className="h-10 rounded-xl border-border/70 bg-background/70 pl-9"
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button className="hidden items-center gap-2 rounded-xl border border-border/70 bg-background/70 px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted sm:flex">
            <span className="h-2 w-2 rounded-full bg-accent" />
            Acme Workspace
          </button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            aria-label="Toggle theme"
            className="rounded-xl"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" aria-label="Notifications" className="relative rounded-xl">
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive" />
          </Button>
          <Link
            to="/chat"
            className="hidden items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold text-white shadow-elegant transition-transform hover:scale-[1.02] sm:inline-flex gradient-primary"
          >
            <Plus className="h-4 w-4" />
            New AI Task
          </Link>
          <div className="ml-1 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-sm font-semibold text-white shadow-elegant">
            SA
          </div>
        </div>
      </div>
    </header>
  );
}

export function PageHeader({
  title,
  subtitle,
  icon: Icon,
  actions,
}: {
  title: string;
  subtitle?: string;
  icon?: typeof LayoutDashboard;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        {Icon && (
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl gradient-soft text-primary">
            <Icon className="h-5 w-5" />
          </span>
        )}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export { X };
