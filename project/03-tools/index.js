const OpenAI = require("openai");

const openai = new OpenAI({
    baseURL: process.env.OPENAI_BASE_URL,
    apiKey: process.env.OPENAI_API_KEY || "not-required",
});

const MODEL = process.env.OPENAI_MODEL;

// -------------------------------------------------------
// Tool implementations
// These are the actual functions your app executes.
// In a real app these would call external APIs, databases, etc.
// -------------------------------------------------------
const toolImplementations = {
    get_weather: ({ city }) => {
        const conditions = {
            "New York":    "cloudy with a chance of afternoon showers",
            "Los Angeles": "sunny and clear",
            "London":      "overcast with light drizzle",
            "Tokyo":       "clear skies",
            "Sydney":      "partly cloudy",
        };
        return conditions[city] || "mild and partly cloudy";
    },

    get_temperature: ({ city, unit = "celsius" }) => {
        const temps = {
            "New York":    { celsius: 14, fahrenheit: 57 },
            "Los Angeles": { celsius: 27, fahrenheit: 81 },
            "London":      { celsius: 11, fahrenheit: 52 },
            "Tokyo":       { celsius: 19, fahrenheit: 66 },
            "Sydney":      { celsius: 22, fahrenheit: 72 },
        };
        const data = temps[city] || { celsius: 20, fahrenheit: 68 };
        const value = unit === "fahrenheit" ? data.fahrenheit : data.celsius;
        const symbol = unit === "fahrenheit" ? "°F" : "°C";
        return `${value}${symbol}`;
    }
};

// -------------------------------------------------------
// Tool definitions (sent to the model with each request)
// The model uses the description and parameters to decide
// when and how to call each tool.
// -------------------------------------------------------
const toolDefinitions = [
    {
        type: "function",
        function: {
            name: "get_weather",
            description: "Get the current weather conditions for a given city",
            parameters: {
                type: "object",
                properties: {
                    city: {
                        type: "string",
                        description: "The name of the city (e.g. 'London', 'Tokyo')"
                    }
                },
                required: ["city"]
            }
        }
    },
    {
        type: "function",
        function: {
            name: "get_temperature",
            description: "Get the current temperature for a given city",
            parameters: {
                type: "object",
                properties: {
                    city: {
                        type: "string",
                        description: "The name of the city (e.g. 'London', 'Tokyo')"
                    },
                    unit: {
                        type: "string",
                        enum: ["celsius", "fahrenheit"],
                        description: "Temperature unit (default: celsius)"
                    }
                },
                required: ["city"]
            }
        }
    }
];

// -------------------------------------------------------
// The chat function with an agentic loop
// -------------------------------------------------------
async function chat(userMessage) {
    const messages = [
        {
            role: "system",
            content: "You are a helpful, concise weather assistant. Use the available tools to answer questions about weather. Always use tools to get the data — do not guess."
        },
        {
            role: "user",
            content: userMessage
        }
    ];

    console.log(`\nUser: ${userMessage}`);

    // TODO: Add the agentic loop here
}

// -------------------------------------------------------
// Run example queries
// -------------------------------------------------------
async function main() {
    await chat("What's the weather like in London right now?");
    await chat("Is it warmer in Los Angeles or Tokyo? Show temperatures in Fahrenheit.");
}

main().catch(console.error);
