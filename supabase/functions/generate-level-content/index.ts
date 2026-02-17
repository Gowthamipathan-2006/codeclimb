import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { language, level, topic, difficulty } = await req.json();

    if (!language || !level || !topic) {
      return new Response(JSON.stringify({ error: "Missing params" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Check cache first
    const { data: cached } = await supabase
      .from("level_content_cache")
      .select("content")
      .eq("language", language.toLowerCase())
      .eq("level", level)
      .maybeSingle();

    if (cached) {
      return new Response(JSON.stringify(cached.content), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Generate via AI
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    const prompt = buildPrompt(language, level, topic, difficulty || "Beginner");

    const aiRes = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            {
              role: "system",
              content:
                "You are a programming education content creator. Return ONLY valid JSON with no markdown formatting, no code fences, no extra text.",
            },
            { role: "user", content: prompt },
          ],
          temperature: 0.7,
        }),
      }
    );

    if (!aiRes.ok) {
      throw new Error(`AI gateway error: ${aiRes.status}`);
    }

    const aiData = await aiRes.json();
    let raw = aiData.choices?.[0]?.message?.content || "";

    // Strip markdown code fences if present
    raw = raw.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```\s*$/i, "").trim();

    let content;
    try {
      content = JSON.parse(raw);
    } catch {
      throw new Error("Failed to parse AI response as JSON");
    }

    // Validate structure
    if (!content.theory || !content.quiz || !Array.isArray(content.quiz)) {
      throw new Error("Invalid content structure from AI");
    }

    // Cache it
    await supabase.from("level_content_cache").upsert(
      { language: language.toLowerCase(), level, content },
      { onConflict: "language,level" }
    );

    return new Response(JSON.stringify(content), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error:", err);
    return new Response(
      JSON.stringify({ error: err.message || "Internal error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

function buildPrompt(
  language: string,
  level: number,
  topic: string,
  difficulty: string
): string {
  const isToolTrack = [
    "sql",
    "git",
    "linux",
    "dsa",
    "rest-apis",
    "json",
    "debugging",
    "regex",
  ].includes(language.toLowerCase());

  const lang = language.toUpperCase();

  return `Generate a complete learning level for the topic "${topic}" in ${lang}.
Difficulty: ${difficulty} (Level ${level} of 30).

${isToolTrack ? `This is a tools/technology track, not a programming language. Tailor examples to real-world usage of ${lang}.` : `This is a programming language track. Include actual ${lang} code in syntax and examples.`}

Return a JSON object with this EXACT structure:
{
  "theory": {
    "content": "2-4 paragraph explanation of ${topic}. Be specific, accurate, educational. No generic filler.",
    "syntax": "The actual syntax/command format for ${topic}. Real syntax only, no placeholders like 'refer to documentation'.",
    "codeExample": "A complete, working example demonstrating ${topic}. Must be real, runnable code."
  },
  "quiz": [
    {
      "question": "A specific question testing understanding of ${topic}",
      "options": ["option A", "option B", "option C", "option D"],
      "correctAnswer": "the correct option (must exactly match one of the options)"
    },
    {
      "question": "Second question about a different aspect of ${topic}",
      "options": ["option A", "option B", "option C", "option D"],
      "correctAnswer": "the correct option"
    },
    {
      "question": "Third question about ${topic}",
      "options": ["option A", "option B", "option C", "option D"],
      "correctAnswer": "the correct option"
    }
  ],
  "codingChallenge": {
    "problem": "A clear practical task related to ${topic}",
    "tasks": ["Step 1", "Step 2", "Step 3"],
    "constraints": ["Any constraints"],
    "testCases": [
      {"input": "sample input or None", "output": "expected output"}
    ],
    "hints": ["Hint 1", "Hint 2"]
  }
}

RULES:
- ALL content must be SPECIFIC to "${topic}" only. Do NOT include content from other topics.
- Quiz questions must test ONLY "${topic}" concepts.
- Correct answers must EXACTLY match one of the four options.
- Code examples must be real, correct ${lang} code.
- Do NOT include solution code in the coding challenge — only the problem, tasks, hints, and test cases.
- Return ONLY the JSON object, no other text.`;
}
