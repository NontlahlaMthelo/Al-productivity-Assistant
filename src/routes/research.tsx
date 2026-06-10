import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, Wand2 } from "lucide-react";
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
import { researchTopic } from "@/lib/ai.functions";

export const Route = createFileRoute("/research")({
  head: () => ({ meta: [{ title: "AI Research Assistant — AI Workplace" }] }),
  component: Research,
});

const DEPTHS = ["Quick Summary", "Detailed Report", "Executive Brief"] as const;

function Research() {
  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState("");
  const [depth, setDepth] = useState<(typeof DEPTHS)[number]>("Detailed Report");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const run = async () => {
    if (!topic.trim()) {
      toast.error("Add a research topic");
      return;
    }
    setLoading(true);
    try {
      const res = await researchTopic({ data: { topic, keywords, depth } });
      setOutput(res.text);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <PageHeader
        title="AI Research Assistant"
        subtitle="Generate workplace research, briefs, and reports in seconds."
        icon={Sparkles}
      />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-soft">
          <Field label="Research Topic">
            <Input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. Hybrid work productivity trends" />
          </Field>
          <Field label="Keywords" className="mt-4">
            <Input value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="comma-separated" />
          </Field>
          <Field label="Research Depth" className="mt-4">
            <Select value={depth} onValueChange={(v) => setDepth(v as (typeof DEPTHS)[number])}>
              <SelectTrigger className="rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DEPTHS.map((d) => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Button
            onClick={run}
            disabled={loading}
            className="mt-6 h-11 w-full rounded-xl gradient-primary text-white shadow-elegant hover:opacity-95"
          >
            <Wand2 className="h-4 w-4" />
            {loading ? "Researching…" : "Generate Research"}
          </Button>
          <p className="mt-4 text-xs text-muted-foreground">
            AI-generated research is for assistance only — always verify facts before sharing externally.
          </p>
        </div>
        <AiOutput
          value={output}
          onChange={setOutput}
          loading={loading}
          onRegenerate={run}
          filename="research-report.md"
          kind="research"
          title={topic || "Research report"}
          placeholder="Overview, findings, opportunities, risks and recommendations will appear here."
        />
      </div>
    </AppLayout>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`space-y-1.5 ${className ?? ""}`}>
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
