import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const tasks = body.tasks || [];

    const systemPrompt = `
You are an AI planner for an MBA student. You will receive a list of tasks with:
- title
- description
- category (academics, career, case_competition, personal)
- deadline
- effort_hours
- status

Create a realistic 7-day weekly plan. Distribute tasks wisely by priority, deadline, and workload.

Output strictly in Markdown with no tables or pipe characters. Use this structure:
## AI Weekly Plan
- Overview: one paragraph summary
- Dates: Monday through Sunday (include actual dates if provided)
- Daily plan (one section per day):
  - Day (e.g., Monday — Nov 25)
  - Focus: short summary
  - Tasks: bullet list; each item as "• Title (Xh) — short action"
  - Total effort: "Total: X hours"
- Weekly total effort at the end.
    `.trim();

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-flash-latest";
    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { plan: "GEMINI_API_KEY is missing." },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: systemPrompt + "\n\nTasks:\n" + JSON.stringify(tasks, null, 2)
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      const message = data?.error?.message || "Gemini request failed.";
      return NextResponse.json(
        { plan: `Gemini error: ${message}` },
        { status: response.status || 500 }
      );
    }

    const plan = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!plan) {
      return NextResponse.json(
        { plan: "No plan generated: Gemini returned an empty response." },
        { status: 502 }
      );
    }

    return NextResponse.json({ plan });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ plan: "Error generating plan." }, { status: 500 });
  }
}
