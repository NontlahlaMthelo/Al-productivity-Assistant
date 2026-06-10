import { createFileRoute } from "@tanstack/react-router";
import { Mail, Send } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { generateEmail } from "@/lib/ai.functions";

export const Route = createFileRoute("/email")({
  head: () => ({ meta: [{ title: "Smart Email Generator — AI Workplace" }] }),
  component: EmailPage,
});

const TONES = ["Professional", "Friendly", "Executive", "Persuasive", "Follow-Up"];

function EmailPage() {
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [purpose, setPurpose] = useState("");
  const [tone, setTone] = useState("Professional");
  const [instructions, setInstructions] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const run = async () => {
    if (!purpose.trim()) {
      toast.error("Add the purpose of the email");
      return;
    }
    setLoading(true);
    try {
      const res = await generateEmail({
        data: { recipient, subject, purpose, tone, instructions },
      });
      setOutput(res.text);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to generate");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <PageHeader
        title="Smart Email Generator"
        subtitle="Draft polished, on-brand emails in seconds."
        icon={Mail}
      />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-soft">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Recipient">
              <Input value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="e.g. Alex from Product" />
            </Field>
            <Field label="Subject">
              <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Q4 launch update" />
            </Field>
          </div>
          <Field label="Purpose" className="mt-4">
            <Textarea
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="What is this email about?"
              rows={3}
            />
          </Field>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Tone">
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TONES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <div />
          </div>
          <Field label="Additional instructions" className="mt-4">
            <Textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Anything specific to mention? Length, CTA, references…"
              rows={3}
            />
          </Field>
          <Button
            onClick={run}
            disabled={loading}
            className="mt-6 h-11 w-full rounded-xl gradient-primary text-white shadow-elegant hover:opacity-95"
          >
            <Send className="h-4 w-4" />
            {loading ? "Generating…" : "Generate Email"}
          </Button>
        </div>
        <AiOutput
          value={output}
          onChange={setOutput}
          loading={loading}
          onRegenerate={run}
          filename="email.txt"
          kind="email"
          title={subject || purpose.slice(0, 60) || "Email draft"}
          placeholder="Your generated email will appear here. You can edit it before sending."
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
