import { createFileRoute } from "@tanstack/react-router";
import { Bell, Cog, Lock, Palette, Shield, User } from "lucide-react";
import { AppLayout, PageHeader } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/lib/theme";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — AI Workplace" }] }),
  component: Settings,
});

function Settings() {
  const { theme, toggle } = useTheme();
  return (
    <AppLayout>
      <PageHeader title="Settings" subtitle="Tune your workspace, identity, and AI preferences." icon={Cog} />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <Card icon={User} title="Profile">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Full name"><Input defaultValue="Sarah Anderson" /></Field>
            <Field label="Email"><Input defaultValue="sarah@acme.com" /></Field>
            <Field label="Job title"><Input defaultValue="Head of Operations" /></Field>
            <Field label="Timezone"><Input defaultValue="America/New_York" /></Field>
          </div>
          <Button className="mt-4 rounded-xl gradient-primary text-white">Save changes</Button>
        </Card>

        <Card icon={Cog} title="Workspace Preferences">
          <Row label="Auto-save outputs" desc="Save generated content to history automatically." defaultChecked />
          <Row label="Compact layout" desc="Reduce padding for power users." />
          <Row label="Show pro tips" desc="Display productivity hints in the sidebar." defaultChecked />
        </Card>

        <Card icon={Bell} title="Notifications">
          <Row label="Email digests" desc="Weekly productivity summary." defaultChecked />
          <Row label="Task reminders" desc="Get pinged before deadlines." defaultChecked />
          <Row label="Product updates" desc="Hear about new AI tools." />
        </Card>

        <Card icon={Palette} title="Appearance">
          <Row
            label="Dark mode"
            desc="Use a darker color scheme."
            checked={theme === "dark"}
            onCheckedChange={toggle}
          />
          <Row label="High contrast" desc="Increase contrast for accessibility." />
        </Card>

        <Card icon={Lock} title="Security">
          <Row label="Two-factor authentication" desc="Add an extra layer of security." defaultChecked />
          <Row label="Session timeout" desc="Auto sign-out after inactivity." />
          <Button variant="outline" className="mt-2 rounded-xl">Change password</Button>
        </Card>

        <Card icon={Shield} title="Responsible AI">
          <div className="rounded-2xl border border-border/60 gradient-soft p-5">
            <p className="text-sm font-semibold">Responsible AI Notice</p>
            <p className="mt-2 text-sm text-foreground/80">
              AI-generated content is intended to assist workplace productivity. Outputs may
              occasionally contain inaccuracies, omissions, or outdated information. Users should
              review and verify all generated content before making business decisions.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {["✓ Transparency", "✓ Human Review Recommended", "✓ Privacy First", "✓ Ethical AI Usage"].map(
                (t) => (
                  <span
                    key={t}
                    className="rounded-full bg-card px-3 py-1 text-xs font-medium text-foreground shadow-soft"
                  >
                    {t}
                  </span>
                ),
              )}
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}

function Card({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof User;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border/70 bg-card p-6 shadow-soft">
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl gradient-soft text-primary">
          <Icon className="h-5 w-5" />
        </span>
        <h2 className="font-semibold">{title}</h2>
      </div>
      <div className="space-y-3">{children}</div>
    </section>
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

function Row({
  label,
  desc,
  defaultChecked,
  checked,
  onCheckedChange,
}: {
  label: string;
  desc: string;
  defaultChecked?: boolean;
  checked?: boolean;
  onCheckedChange?: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border/60 bg-background/60 p-4">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
      {checked !== undefined ? (
        <Switch checked={checked} onCheckedChange={onCheckedChange} />
      ) : (
        <Switch defaultChecked={defaultChecked} />
      )}
    </div>
  );
}
