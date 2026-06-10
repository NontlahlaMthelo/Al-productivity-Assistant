import { Copy, Download, RefreshCw, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { addHistoryItem, type HistoryKind } from "@/lib/history-store";

export function AiOutput({
  value,
  onChange,
  loading,
  onRegenerate,
  filename = "ai-output.txt",
  kind,
  title,
  placeholder = "Your AI-generated output will appear here…",
}: {
  value: string;
  onChange: (v: string) => void;
  loading: boolean;
  onRegenerate?: () => void;
  filename?: string;
  kind: HistoryKind;
  title: string;
  placeholder?: string;
}) {
  const [local, setLocal] = useState(value);
  useEffect(() => setLocal(value), [value]);

  const update = (v: string) => {
    setLocal(v);
    onChange(v);
  };

  const copy = async () => {
    await navigator.clipboard.writeText(local);
    toast.success("Copied to clipboard");
  };

  const download = () => {
    const blob = new Blob([local], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const save = () => {
    if (!local.trim()) return;
    addHistoryItem({
      kind,
      title,
      preview: local.slice(0, 140),
      content: local,
    });
    toast.success("Saved to history");
  };

  return (
    <div className="flex h-full flex-col rounded-2xl border border-border/70 bg-card shadow-soft">
      <div className="flex flex-wrap items-center gap-2 border-b border-border/60 p-3">
        <span className="mr-auto text-sm font-medium text-muted-foreground">AI Output</span>
        <Button variant="ghost" size="sm" onClick={copy} disabled={!local}>
          <Copy className="h-4 w-4" /> Copy
        </Button>
        {onRegenerate && (
          <Button variant="ghost" size="sm" onClick={onRegenerate} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Regenerate
          </Button>
        )}
        <Button variant="ghost" size="sm" onClick={download} disabled={!local}>
          <Download className="h-4 w-4" /> Download
        </Button>
        <Button variant="ghost" size="sm" onClick={save} disabled={!local}>
          <Save className="h-4 w-4" /> Save
        </Button>
      </div>
      <div className="relative flex-1">
        {loading && !local && (
          <div className="absolute inset-0 flex flex-col gap-3 p-5">
            <div className="h-4 w-3/4 animate-pulse rounded-full bg-muted" />
            <div className="h-4 w-full animate-pulse rounded-full bg-muted" />
            <div className="h-4 w-5/6 animate-pulse rounded-full bg-muted" />
            <div className="h-4 w-2/3 animate-pulse rounded-full bg-muted" />
            <div className="mt-4 h-4 w-1/2 animate-pulse rounded-full bg-muted" />
            <div className="h-4 w-4/5 animate-pulse rounded-full bg-muted" />
          </div>
        )}
        <Textarea
          value={local}
          onChange={(e) => update(e.target.value)}
          placeholder={placeholder}
          className="h-full min-h-[420px] resize-none rounded-none border-0 bg-transparent p-5 font-mono text-[13px] leading-relaxed shadow-none focus-visible:ring-0"
        />
      </div>
    </div>
  );
}
