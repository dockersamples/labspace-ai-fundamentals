# Welcome to AI Fundamentals

Modern software applications increasingly include AI capabilities — answering questions, summarizing content, automating workflows, and more. But building AI apps that are reliable and useful requires understanding the underlying concepts.

In this lab, you'll learn the four core pillars of AI application development:

| Concept | What it means |
|---------|--------------|
| 🧠 **Models** | How LLMs work and how to talk to them via APIs |
| ✍️ **Prompt Engineering** | How to craft instructions that produce reliable, useful responses |
| 🔨 **Tool Calling** | How models can take action and access external data |
| 📚 **RAG** | How to ground models in your own data so they give accurate answers |

By the end, you'll have hands-on experience with each concept and a clear mental model for how they fit together in real AI apps.

## 🔧 Verifying your environment

This lab uses a language model running locally via the **Docker Model Runner** — no API key or cloud account required. Let's confirm it's working.

Run the following command in the terminal:

```bash
docker model run ai/llama3.2:3B-Q4_K_M "What is a large language model? Answer in one sentence."
```

After a moment, you should receive a one-sentence response from the model. The model may already be cached and start quickly, or it may take a short while to load.

> [!NOTE]
> This lab uses **Llama 3.2 3B**, a lightweight model optimized to run on most developer machines. It's great for learning, though it has limitations compared to larger models — particularly around complex reasoning and tool calling. We'll point out these limitations when relevant.

Once you have a response, your environment is ready. Move on to the next section!
