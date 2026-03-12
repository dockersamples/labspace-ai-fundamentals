# Wrap-up

Congratulations — you've completed **AI Fundamentals for Developers**! 🎉

## ✅ What you learned

Here's a recap of the four core concepts you explored:

### 🧠 Models & the Chat API
- Models communicate through the **Chat Completions API**, which accepts a list of messages
- Messages have **roles**: `system` (your instructions), `user` (input), `assistant` (model output), and `tool` (tool results)
- Models are **stateless** — every request must include the full conversation history

### ✍️ Prompt Engineering
- The **system prompt** is your most powerful lever — it shapes the model's persona, rules, and output format
- **Few-shot examples** teach the model by demonstration, producing more consistent and accurate results
- Models can return **structured output** (JSON) when instructed to do so in the system prompt

### 🔨 Tool Calling
- Tools extend what models can do — fetching real-time data, calling APIs, or taking actions
- The model **requests** tool execution; your application **performs** it and returns the result
- The **agentic loop** keeps the conversation going until the model produces a final text response

### 📚 RAG
- Models don't know your private data, and their training has a knowledge cutoff
- **RAG** solves this by retrieving relevant chunks from your knowledge base and injecting them into the prompt
- The "answer using only the context" instruction prevents hallucinations by grounding the model in your data

---

## 🚀 What's next?

Now that you understand the fundamentals, here are some directions to explore:

- **Agentic frameworks** (LangChain, LlamaIndex, Mastra, Vercel AI SDK) — higher-level abstractions for building agents and RAG pipelines
- **Production RAG** — embedding models, vector databases, and reranking for semantic retrieval at scale
- **Streaming responses** — use `stream: true` in the Chat Completions API to stream tokens as they're generated
- **Evaluation** — how to measure and improve the accuracy and reliability of your AI app
- **Docker's AI tooling** — if you want to see how Docker Model Runner and the MCP Gateway can simplify running models and connecting MCP tools in containerized environments, check out the next lab in this series

---

## 📚 Resources

- [OpenAI Chat Completions API reference](https://platform.openai.com/docs/api-reference/chat)
- [Prompt engineering guide (OpenAI)](https://platform.openai.com/docs/guides/prompt-engineering)
- [Model Context Protocol documentation](https://modelcontextprotocol.io)
- [Docker Model Runner documentation](https://docs.docker.com/ai/model-runner/)
