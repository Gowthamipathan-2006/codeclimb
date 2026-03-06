import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { language, code, problem } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are a friendly coding tutor for a programming learning platform called CodeClimb. 
Your role is to help students learn by:
1. Detecting errors in their code
2. Explaining WHY the error occurs (not just what it is)
3. Providing hints to fix the issue — NEVER give the full solution
4. Suggesting improvements to their approach

Keep responses concise (under 200 words), encouraging, and educational.
Use simple language. Add relevant emojis occasionally.
Always end with an encouraging note.

IMPORTANT: Never provide the complete solution code. Only give hints and explanations.`;

    const userPrompt = `The student is working on a ${language.toUpperCase()} coding challenge.

Problem: ${problem}

Their code:
\`\`\`${language}
${code}
\`\`\`

Analyze their code. If there are errors, explain them and give hints. If the code looks correct, suggest improvements. Remember: hints only, never the full solution.`;

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!aiRes.ok) {
      if (aiRes.status === 429) {
        return new Response(JSON.stringify({ response: "I'm a bit busy right now! Please try again in a moment. ⏳" }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiRes.status === 402) {
        return new Response(JSON.stringify({ response: "AI credits are currently unavailable. Please try again later. 💳" }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${aiRes.status}`);
    }

    const data = await aiRes.json();
    const response = data.choices?.[0]?.message?.content || "I couldn't analyze your code right now. Try again!";

    return new Response(JSON.stringify({ response }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("AI assistant error:", err);
    return new Response(JSON.stringify({ response: "Something went wrong. Please try again! 🔧" }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
