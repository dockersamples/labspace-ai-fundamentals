const OpenAI = require("openai");
const fs = require("fs");
const path = require("path");

const openai = new OpenAI({
    baseURL: process.env.OPENAI_BASE_URL,
    apiKey: process.env.OPENAI_API_KEY || "not-required",
});

const MODEL = process.env.OPENAI_MODEL;
const DOCS_DIR = path.join(__dirname, "documents");

// -------------------------------------------------------
// Load and chunk documents from the documents/ directory
// Each paragraph becomes a separate chunk for retrieval.
// -------------------------------------------------------
function loadDocuments(dir) {
    const docs = [];
    const files = fs.readdirSync(dir).filter(f => f.endsWith(".txt"));

    for (const file of files) {
        const title = file.replace(".txt", "").replace(/-/g, " ");
        const content = fs.readFileSync(path.join(dir, file), "utf8");

        // Split on blank lines to get paragraphs
        const chunks = content.split(/\n\n+/).filter(p => p.trim().length > 40);
        for (const chunk of chunks) {
            docs.push({ source: file, title, content: chunk.trim() });
        }
    }

    return docs;
}

// -------------------------------------------------------
// Simple keyword-based retrieval
// Scores each chunk by how many query words it contains.
// Production systems use embeddings for semantic similarity.
// -------------------------------------------------------
function retrieve(query, documents, k = 3) {
    const stopWords = new Set(["the", "is", "are", "was", "what", "how", "does", "do", "a", "an", "of", "for", "in", "on", "to"]);
    const queryWords = query.toLowerCase()
        .split(/\W+/)
        .filter(w => w.length > 2 && !stopWords.has(w));

    const scored = documents.map(doc => {
        const text = doc.content.toLowerCase();
        const score = queryWords.reduce((sum, word) => {
            const count = (text.match(new RegExp(word, "g")) || []).length;
            return sum + count;
        }, 0);
        return { ...doc, score };
    });

    return scored
        .filter(d => d.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, k);
}

// -------------------------------------------------------
// Answer without RAG — ask the model directly
// -------------------------------------------------------
async function answerWithoutRAG(question) {
    const response = await openai.chat.completions.create({
        model: MODEL,
        messages: [
            {
                role: "system",
                content: "You are a helpful assistant. Answer the user's question as best you can."
            },
            { role: "user", content: question }
        ]
    });
    return response.choices[0].message.content.trim();
}

// -------------------------------------------------------
// Answer with RAG — retrieve → augment → generate
// -------------------------------------------------------
async function answerWithRAG(question, documents) {
    // TODO: Implement the RAG pipeline here.
    // 1. Retrieve relevant chunks using retrieve(question, documents)
    // 2. Augment the system prompt with the retrieved context
    // 3. Generate a response, instructing the model to use ONLY the context
    return "RAG not yet implemented.";
}

// -------------------------------------------------------
// Main — compare answers with and without RAG
// -------------------------------------------------------
async function main() {
    const documents = loadDocuments(DOCS_DIR);
    console.log(`Loaded ${documents.length} document chunks from ${DOCS_DIR}\n`);
    console.log("=".repeat(60));

    const questions = [
        "How many vacation days do employees get per year?",
        "What is the code review process?",
        "What are the pricing tiers for the product?",
    ];

    for (const question of questions) {
        console.log(`\nQuestion: ${question}\n`);

        console.log("--- Without RAG ---");
        const directAnswer = await answerWithoutRAG(question);
        console.log(directAnswer);

        console.log("\n--- With RAG ---");
        const ragAnswer = await answerWithRAG(question, documents);
        console.log(ragAnswer);

        console.log("\n" + "=".repeat(60));
    }
}

main().catch(console.error);
