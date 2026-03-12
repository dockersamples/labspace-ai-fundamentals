const OpenAI = require("openai");

const openai = new OpenAI({
    baseURL: process.env.OPENAI_BASE_URL,
    apiKey: process.env.OPENAI_API_KEY || "not-required",
});

const MODEL = process.env.OPENAI_MODEL;

// -------------------------------------------------------
// Example 1: Few-shot prompting
//
// Instead of describing the task, we show the model examples.
// This is especially useful for enforcing a specific output format.
// -------------------------------------------------------
async function fewShotExample() {
    const response = await openai.chat.completions.create({
        model: MODEL,
        messages: [
            {
                role: "system",
                content: "Classify customer reviews as positive, negative, or neutral. Respond with only the single classification word."
            },
            // Few-shot examples: input/output pairs that demonstrate the pattern
            { role: "user",      content: "This product is amazing! Works perfectly and arrived on time." },
            { role: "assistant", content: "positive" },
            { role: "user",      content: "It broke after two days. Complete waste of money." },
            { role: "assistant", content: "negative" },
            { role: "user",      content: "It does what it says on the box. Nothing special." },
            { role: "assistant", content: "neutral" },
            // The real request
            { role: "user",      content: "Shipping was slow but the product quality is excellent!" }
        ]
    });

    return response.choices[0].message.content.trim();
}

// -------------------------------------------------------
// Example 2: Structured output
//
// By instructing the model to return JSON and defining the
// schema in the system prompt, we can reliably extract
// structured data from unstructured text.
// -------------------------------------------------------
async function structuredOutputExample() {
    const userMessage = `Meeting notes from March 12th:
Attendees: Sarah, James, Priya

We reviewed Q1 metrics and discussed the upcoming product launch. Sarah will update the launch checklist by Friday. James needs to coordinate with the design team on the new landing page. Priya will schedule a follow-up meeting for next week to review progress.`;

    const response = await openai.chat.completions.create({
        model: MODEL,
        messages: [
            {
                role: "system",
                content: `Extract key information from meeting notes and return it as a JSON object with these fields:
- "summary": a one-sentence summary of the meeting (string)
- "attendees": list of people present (array of strings)
- "action_items": list of follow-up tasks with owner (array of strings)

Return only valid JSON. Do not include any other text.`
            },
            {
                role: "user",
                content: userMessage
            }
        ]
    });

    const raw = response.choices[0].message.content.trim();
    // Some models wrap JSON in markdown code fences — strip them if present
    const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "");
    return JSON.parse(cleaned);
}

// -------------------------------------------------------
// Main
// -------------------------------------------------------
async function main() {
    console.log("=== Few-shot classification ===");
    const classification = await fewShotExample();
    console.log(`Result: "${classification}"`);
    console.log("(Expected: positive, negative, or neutral)\n");

    console.log("=== Structured output from meeting notes ===");
    const extracted = await structuredOutputExample();
    console.log(JSON.stringify(extracted, null, 2));
}

main().catch(console.error);
