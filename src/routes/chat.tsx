import { createFileRoute } from "@tanstack/react-router";
import { Copy, MessageSquare, Send, Sparkles, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { AppLayout, PageHeader } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { chatAssistant } from "@/lib/ai.functions";
import { addHistoryItem } from "@/lib/history-store";

export const Route = createFileRoute("/chat")({
  head: () => ({ meta: [{ title: "AI Chat Assistant — AI Workplace" }] }),
  component: Chat,
});

type Msg = { role: "user" | "assistant"; content: string };
const KEY = "aiwp.chat.v1";
const WELCOME: Msg = {
  role: "assistant",
  content: "Hello! I'm your AI Workplace Assistant. How can I help you today?",
};

const SUGGESTIONS = [
  "Draft a follow-up email to a client",
  "Summarize the key points of agile sprint planning",
  "Help me prioritize my week",
  "Outline a Q4 strategy memo",
];

function Chat() {
  const [messages, setMessages] = useState<Msg[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setMessages(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(messages));
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    taRef.current?.focus();
  }, [loading]);

  const send = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    const next: Msg[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await chatAssistant({ data: { messages: next } });
      setMessages([...next, { role: "assistant", content: res.text }]);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
      setMessages(next);
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setMessages([WELCOME]);
    toast.success("Chat cleared");
  };

  const saveChat = () => {
    const transcript = messages
      .map((m) => `${m.role === "user" ? "You" : "AI"}: ${m.content}`)
      .join("\n\n");
    addHistoryItem({
      kind: "chat",
      title: messages.find((m) => m.role === "user")?.content.slice(0, 60) || "Conversation",
      preview: transcript.slice(0, 140),
      content: transcript,
    });
    toast.success("Conversation saved to history");
  };

  return (
    <AppLayout>
      <PageHeader
        title="AI Chat Assistant"
        subtitle="Your conversational workplace copilot."
        icon={MessageSquare}
        actions={
          <>
            <Button variant="outline" size="sm" onClick={saveChat} className="rounded-xl">
              Save chat
            </Button>
            <Button variant="outline" size="sm" onClick={clear} className="rounded-xl text-destructive">
              <Trash2 className="h-4 w-4" /> Clear
            </Button>
          </>
        }
      />

      <div className="flex flex-col rounded-3xl border border-border/70 bg-card shadow-soft" style={{ height: "calc(100vh - 220px)" }}>
        <div ref={scrollRef} className="flex-1 space-y-5 overflow-y-auto p-6">
          {messages.map((m, i) => (
            <Bubble key={i} msg={m} />
          ))}
          {loading && (
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-2xl gradient-primary text-white shadow-elegant">
                <Sparkles className="h-4 w-4" />
              </span>
              <div className="flex gap-1 rounded-2xl bg-muted px-4 py-3">
                <Dot /><Dot delay={0.15} /><Dot delay={0.3} />
              </div>
            </div>
          )}
          {messages.length === 1 && (
            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="group rounded-2xl border border-border/70 bg-background p-4 text-left text-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-elegant"
                >
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary">Try</p>
                  <p className="mt-1 text-sm">{s}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-border/60 p-4">
          <div className="flex items-end gap-2 rounded-2xl border border-border/70 bg-background p-2 shadow-soft focus-within:border-primary/50">
            <Textarea
              ref={taRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder="Ask anything about your workplace…"
              rows={1}
              className="max-h-40 min-h-[44px] resize-none border-0 bg-transparent shadow-none focus-visible:ring-0"
            />
            <Button
              onClick={() => send()}
              disabled={loading || !input.trim()}
              size="icon"
              className="h-10 w-10 shrink-0 rounded-xl gradient-primary text-white"
              aria-label="Send"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function Bubble({ msg }: { msg: Msg }) {
  const isUser = msg.role === "user";
  const copy = async () => {
    await navigator.clipboard.writeText(msg.content);
    toast.success("Copied");
  };
  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl text-white shadow-elegant ${isUser ? "bg-gradient-to-br from-indigo-500 to-violet-500" : "gradient-primary"}`}
      >
        {isUser ? <span className="text-xs font-bold">SA</span> : <Sparkles className="h-4 w-4" />}
      </span>
      <div className={`group max-w-[80%] ${isUser ? "items-end" : "items-start"} flex flex-col gap-1`}>
        <div
          className={`whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed ${isUser ? "gradient-primary text-white shadow-elegant" : "border border-border/60 bg-background"}`}
        >
          {msg.content}
        </div>
        {!isUser && (
          <button
            onClick={copy}
            className="flex items-center gap-1 text-xs text-muted-foreground opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100"
          >
            <Copy className="h-3 w-3" /> Copy
          </button>
        )}
      </div>
    </div>
  );
}

function Dot({ delay = 0 }: { delay?: number }) {
  return (
    <span
      className="inline-block h-2 w-2 animate-bounce rounded-full bg-muted-foreground"
      style={{ animationDelay: `${delay}s` }}
    />
  );
}
