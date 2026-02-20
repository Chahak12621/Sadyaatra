import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

const SYSTEM_PROMPT = `
You are SadYaatra AI, a friendly Indian travel assistant.
You assist users with SadYaatra.AI – an end-to-end travel platform.
Help users plan destinations, flights, hotels, itineraries, and explain features.
Use friendly tone, some Hindi words like "Namaste", be polite and slightly funny.
`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const groqMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages.map((m: { role: string; text: string }) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.text,
      })),
    ];

    const completion = await groq.chat.completions.create({
       model: "llama-3.1-8b-instant",
      messages: groqMessages,
      temperature: 0.6,
    });

    return NextResponse.json({
      reply: completion.choices[0].message.content,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { reply: "Namaste 🙏 Thoda traffic hai, please try again!" },
      { status: 500 }
    );
  }
}
