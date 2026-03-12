# Talking to Models

## 🎓 Learning objectives

By the end of this section, you will:

- Understand the Chat Completions API and message structure
- Know the difference between `system`, `user`, and `assistant` message roles
- Understand that models are stateless — all context must be sent on every request
- Make your first API call to a model using Node.js

---

## 💬 The Chat Completions API

When your code talks to an AI model, it almost always uses an endpoint called the **Chat Completions API**. This endpoint takes a list of messages and returns a new message from the model.

The core request looks like this:

```json no-copy-button
{
  "model": "ai/llama3.2:3B-Q4_K_M",
  "messages": [
    { "role": "system",    "content": "You are a helpful assistant." },
    { "role": "user",      "content": "Why is the sky blue?" }
  ]
}
```

And the response includes the model's reply:

```json no-copy-button
{
  "choices": [{
    "message": {
      "role": "assistant",
      "content": "The sky appears blue because of a phenomenon called Rayleigh scattering..."
    },
    "finish_reason": "stop"
  }]
}
```

### Message roles

Every message has a **role** that tells the model who wrote it:

| Role | Who it's from | When to use it |
|------|--------------|----------------|
| `system` | Your application | Instructions, persona, rules, context |
| `user` | The end user | Questions, requests, input data |
| `assistant` | The model | Previous responses (for multi-turn conversations) |
| `tool` | Your application | Results from tool executions (more on this in Section 4) |

---

## 🔍 Exploring the API with the Visual Chatbot

The Visual Chatbot is a tool that lets you see exactly what gets sent to the model and what comes back — perfect for understanding the API.

1. Open the :tabLink[Visual Chatbot]{id="chatbot" href="http://localhost:3050"}.

    You'll see a chat interface with a default system prompt already visible at the top. This is the `system` message.

2. Click **Add user message**, type the following, and click **Add user message** again:

    ```plaintext
    Why is the sky blue?
    ```

3. Click **Send messages to model** to submit the request.

    After a moment, you'll receive a response. Notice the model's reply has a blue background — that's the `assistant` message returned by the API.

4. Click on the assistant's response bubble to see the **raw API response**. You'll see the `role: "assistant"` field that gets added back to the message stack.

5. Add another message to continue the conversation:

    ```plaintext
    Are there times when it appears a different color?
    ```

    Before sending, notice that the entire conversation history is visible — the original system prompt, your first user message, the assistant's response, and now this new message. **All of these are sent to the API together** on every request.

6. Send the messages. The model correctly follows the thread of conversation because it received the full history.

> [!IMPORTANT]
> Models have **no memory of their own** — they are completely stateless. Every request must include the full conversation history. This is why context length matters: longer conversations consume more of the model's context window.

---

## 👩‍💻 Your first API call in code

Now it's time to write code that does the same thing. You'll use the `openai` npm package, which works with any OpenAI-compatible API — including the local Docker Model Runner.

1. Open the :fileLink[`01-models/index.js`]{path="01-models/index.js"} file in the editor.

2. The OpenAI client is already set up for you. Your job is to complete the `run()` function by adding the API call. Replace the `// TODO` comment with the following:

    ```javascript
    const response = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL,
        messages: [
            {
                role: "system",
                content: "You are a random fact generator. When given a topic, share one surprising and interesting fact about it. Keep your response to 2-3 sentences."
            },
            {
                role: "user",
                content: "The deep ocean"
            }
        ]
    });

    return response.choices[0].message.content.trim();
    ```

3. Open a terminal and install the dependencies:

    ```bash terminal-id=models
    cd 01-models && npm install
    ```

4. Run the app:

    ```bash terminal-id=models
    node index.js
    ```

    You should see a fact about the deep ocean returned by the model.

5. Try changing the `content` of the `user` message to a different topic and run it again:

    ```bash terminal-id=models
    node index.js
    ```

> [!TIP]
> The `OPENAI_BASE_URL` and `OPENAI_MODEL` environment variables are already set in your workspace to point to the local Docker Model Runner. This pattern makes it easy to swap in any OpenAI-compatible provider (including OpenAI itself) without changing your code.
