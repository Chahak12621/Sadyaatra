import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

const SYSTEM_PROMPT = `
You are SadYaatra Explore Assistant.
ONLY explain destinations.

Talk about:
- key places to visit
- culture
- food
- best time to visit

Do NOT talk about bookings, flights, hotels, pricing.
Use friendly tone, some Hindi words like Namaste, mast, zabardast.
`;

export async function POST(req: NextRequest) {
  const { messages, place } = await req.json();

  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    temperature: 0.6,
    messages: [
      {
        role: "system",
        content: SYSTEM_PROMPT + `\nCurrent place: ${place}`,
      },
      ...messages.map((m: any) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.text,
      })),
    ],
  });

  return NextResponse.json({
    reply: completion.choices[0].message.content,
  });
}
