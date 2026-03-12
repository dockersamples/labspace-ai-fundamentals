const OpenAI = require("openai");

const openai = new OpenAI({
    baseURL: process.env.OPENAI_BASE_URL,
    apiKey: process.env.OPENAI_API_KEY || "not-required",
});

const MODEL = process.env.OPENAI_MODEL;

async function run() {
    // TODO: Call openai.chat.completions.create() with a model, system message, and user message.
    // Return response.choices[0].message.content.trim()
}

run()
    .then(response => {
        console.log("Model response:");
        console.log(response);
    })
    .catch(err => console.error(err));
