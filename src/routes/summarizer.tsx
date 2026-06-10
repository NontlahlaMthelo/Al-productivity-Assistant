import { createFileRoute } from "@tanstack/react-router";
import { ClipboardList, Upload, Wand2 } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { AiOutput } from "@/components/AiOutput";
import { AppLayout, PageHeader } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { summarizeNotes } from "@/lib/ai.functions";

export const Route = createFileRoute("/summarizer")({
  head: () => ({ meta: [{ title: "Meeting Notes Summarizer — AI Workplace" }] }),
  component: Summarizer,
});

function Summarizer() {
  const [notes, setNotes] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const run = async () => {
    if (notes.trim().length < 10) {
      toast.error("Paste a transcript or notes first");
      return;
    }
    setLoading(true);
    try {
      const res = await summarizeNotes({ data: { notes } });
      setOutput(res.text);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  };

  const onFile = async (f: File | null) => {
    if (!f) return;
    if (f.size > 1024 * 1024) {
      toast.error("File too large (1MB max)");
      return;
    }
    const text = await f.text();
    setNotes(text);
    toast.success("Imported transcript");
  };

  return (
    <AppLayout>
      <PageHeader
        title="Meeting Notes Summarizer"
        subtitle="Transform raw transcripts into structured, actionable summaries."
        icon={ClipboardList}
      />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="flex flex-col rounded-2xl border border-border/70 bg-card p-6 shadow-soft">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-medium">Transcript / notes</p>
            <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()} className="rounded-xl">
              <Upload className="h-4 w-4" /> Import file
            </Button>
            <input
              ref={fileRef}
              type="file"
              accept=".txt,.md,.vtt,.srt"
              className="hidden"
              onChange={(e) => onFile(e.target.files?.[0] ?? null)}
            />
          </div>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Paste your meeting transcript or rough notes here…"
            className="min-h-[380px] flex-1 rounded-xl"
          />
          <Button
            onClick={run}
            disabled={loading}
            className="mt-4 h-11 w-full rounded-xl gradient-primary text-white shadow-elegant hover:opacity-95"
          >
            <Wand2 className="h-4 w-4" />
            {loading ? "Summarizing…" : "Generate Summary"}
          </Button>
        </div>
        <AiOutput
          value={output}
          onChange={setOutput}
          loading={loading}
          onRegenerate={run}
          filename="meeting-summary.md"
          kind="summary"
          title={notes.slice(0, 60) || "Meeting summary"}
          placeholder="Executive summary, key points, action items, decisions and follow-ups will appear here."
        />
      </div>
    </AppLayout>
  );
}
