import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const MODEL = "google/gemini-3-flash-preview";

async function runAi(system: string, prompt: string) {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("Missing LOVABLE_API_KEY");
  const gateway = createLovableAiGatewayProvider(key);
  const { text } = await generateText({
    model: gateway(MODEL),
    system,
    prompt,
  });
  return text;
}

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({
        recipient: z.string().default(""),
        subject: z.string().default(""),
        purpose: z.string().min(1),
        tone: z.string().default("Professional"),
        instructions: z.string().default(""),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const text = await runAi(
      `You are an executive communications assistant. Write polished workplace emails. Output ONLY the email body, no preamble, no markdown fences. Start with a greeting line and end with a sign-off.`,
      `Recipient: ${data.recipient || "(unspecified)"}
Subject: ${data.subject || "(unspecified)"}
Tone: ${data.tone}
Purpose: ${data.purpose}
Extra instructions: ${data.instructions || "(none)"}`,
    );
    return { text };
  });

export const summarizeNotes = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ notes: z.string().min(10) }).parse(d))
  .handler(async ({ data }) => {
    const text = await runAi(
      `You are a meeting notes summarizer. Produce a clean markdown summary with EXACTLY these sections in this order, each as an H2:
## Executive Summary
## Key Discussion Points
## Action Items
## Decisions Made
## Follow-Ups
Use bullet points. Be concise and professional.`,
      data.notes,
    );
    return { text };
  });

export const planTasks = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({
        taskName: z.string().min(1),
        deadline: z.string().default(""),
        priority: z.string().default("Medium"),
        project: z.string().default(""),
        team: z.string().default(""),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const text = await runAi(
      `You are an expert project planner. Output markdown with these H2 sections: ## Overview, ## Recommended Roadmap (numbered phases with dates if possible), ## Suggested Kanban Tasks (a bulleted list of 8-12 atomic tasks each in the form "[Status] Title — owner — est"), ## Risks & Mitigations.`,
      `Task: ${data.taskName}
Deadline: ${data.deadline || "(flexible)"}
Priority: ${data.priority}
Project: ${data.project || "(general)"}
Team: ${data.team || "(unspecified)"}`,
    );
    return { text };
  });

export const researchTopic = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({
        topic: z.string().min(1),
        keywords: z.string().default(""),
        depth: z.enum(["Quick Summary", "Detailed Report", "Executive Brief"]).default("Detailed Report"),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const text = await runAi(
      `You are a senior workplace research analyst. Output markdown with EXACTLY these H2 sections in order: ## Overview, ## Key Findings, ## Opportunities, ## Risks, ## Recommendations. Adjust depth based on the requested format.`,
      `Topic: ${data.topic}
Keywords: ${data.keywords || "(none)"}
Format: ${data.depth}`,
    );
    return { text };
  });

const ChatMessage = z.object({
  role: z.enum(["user", "assistant", "system"]),
  content: z.string(),
});

export const chatAssistant = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ messages: z.array(ChatMessage).min(1) }).parse(d))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");
    const gateway = createLovableAiGatewayProvider(key);
    const { text } = await generateText({
      model: gateway(MODEL),
      system: `You are AI Workplace Assistant — a friendly, sharp, professional productivity copilot. Help with emails, planning, research, summaries, and workplace questions. Use markdown when helpful. Be concise and warm.`,
      messages: data.messages.map((m) => ({ role: m.role, content: m.content })),
    });
    return { text };
  });
