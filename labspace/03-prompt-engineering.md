# Prompt Engineering

## 🎓 Learning objectives

By the end of this section, you will:

- Understand how the system prompt shapes model behavior
- Know how to use few-shot examples to teach a model by demonstration
- Be able to request structured output (JSON) from a model

---

## ✍️ What is prompt engineering?

A model is like a very capable contractor who can do almost anything — but only if you give them clear instructions. **Prompt engineering** is the practice of crafting those instructions to reliably get the output you want.

The most impactful prompt you'll write is the **system prompt**. It tells the model:
- What role or persona it should take on
- What rules it must follow
- What format its output should be in
- Any additional context it needs

---

## 🧪 System prompt experiments

The Visual Chatbot lets you change the system prompt and see the effect on the same conversation.

### Part 1: Persona switching

1. Open the :tabLink[Visual Chatbot]{id="chatbot" href="http://localhost:3050"} and reset any existing conversation by clicking the **Reset messages** button at the bottom.

2. Click **Add user message**, add the following, and send it to the model:

    ```plaintext
    Why is the sky blue?
    ```

    Note the style and tone of the response.

3. Now open the **Settings** menu (top-right) and click **System prompt**.

4. Select the **Grumpy old man** persona from the _Quick persona chooser_. Enable the **Replay user messages on new system prompt** option and click **Save**.

    The same question now gets a very different answer — short, terse, and impatient. The model's knowledge hasn't changed; only the instructions changed.

> [!IMPORTANT]
> The same model can behave in radically different ways depending on the system prompt. This is why the system prompt is the most powerful lever in your application.

### Part 2: Structured input

Models aren't limited to conversational text — they can process any structured data you provide.

1. In the Settings menu, select the **Message summarizer** persona. Disable the **Replay user messages on new system prompt** option, then save.

2. Click **Reset messages** to start fresh.

3. Add a user message containing the following JSON:

    ```json
    [
        { "author": "Alice", "timestamp": "09:12", "message": "The staging deploy is failing — seeing 500 errors on the checkout endpoint." },
        { "author": "Bob",   "timestamp": "09:14", "message": "I'll take a look. Looks like the DB migration didn't run." },
        { "author": "Bob",   "timestamp": "09:31", "message": "Fixed. Migration ran successfully. Staging is healthy." },
        { "author": "Alice", "timestamp": "09:33", "message": "Confirmed — checkout is working. Thanks!" }
    ]
    ```

4. Send the message. The model should return a concise summary of the conversation thread.

> [!TIP]
> This pattern — where the system prompt defines a task and the user message contains data — is extremely common in production AI apps. Think: document analysis, data extraction, classification, translation, and more.

---

## 🎯 Few-shot examples

Sometimes the best way to explain what you want is to show the model examples. This is called **few-shot prompting**: you include example input/output pairs in the message history before the real request.

Few-shot prompting is useful when:
- You want a very specific output format
- The behavior is hard to describe in words
- You need consistent style across many requests

Here's what it looks like in a messages array. Instead of trying to describe "classify as positive, negative, or neutral", you just show it:

```json no-copy-button
[
  { "role": "system",    "content": "Classify customer reviews as positive, negative, or neutral. Respond with only the classification word." },

  { "role": "user",      "content": "This product is amazing! Works perfectly and arrived on time." },
  { "role": "assistant", "content": "positive" },

  { "role": "user",      "content": "It broke after two days. Complete waste of money." },
  { "role": "assistant", "content": "negative" },

  { "role": "user",      "content": "It does what it says on the box. Nothing special." },
  { "role": "assistant", "content": "neutral" },

  { "role": "user",      "content": "Shipping was slow but the product quality is excellent!" }
]
```

The model sees the pattern in the example `assistant` messages and follows it for the final input. No lengthy description of the format needed.

> [!TIP]
> Three examples is usually enough to establish a pattern. Adding more rarely improves results and increases your token usage.

---

## 👩‍💻 Structured output in code

Now you'll write code that uses two techniques: few-shot prompting and structured output (asking the model to return JSON).

1. Open the :fileLink[`02-prompts/index.js`]{path="02-prompts/index.js"} file.

    This file has two functions already scaffolded. Read through the code to understand what each one does.

2. Install the dependencies:

    ```bash terminal-id=prompts
    cd 02-prompts && npm install
    ```

3. Run the file as-is to see both techniques in action:

    ```bash terminal-id=prompts
    node index.js
    ```

    You should see:
    - A sentiment classification for a review (using few-shot examples)
    - A structured JSON object extracted from meeting notes

4. Try modifying the `userMessage` in `structuredOutputExample()` (at :fileLink[line 47]{path="02-prompts/index.js" line=47}) with different meeting notes and run again to see the extraction in action:

    ```bash terminal-id=prompts
    node index.js
    ```

> [!NOTE]
> Some models return JSON wrapped in a markdown code block (<code>\`\`\`json ... \`\`\`</code>). The code includes logic to strip these fences before parsing. When working with structured output, always validate and sanitize the model's response.
