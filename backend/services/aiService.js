import client from "./aiClient.js";

export async function getAIResponse(message, history = []) {

    const messages = [
        {
            role: "system",
            content: `You are a helpful AI shopping assistant for a Shopify store.
If the user asks about products, recommend products naturally.
Keep responses friendly and concise.`
        },

        ...history,

        {
            role: "user",
            content: message
        }
    ];

    try {

        const stream = await client.chat.completions.create({

            model: "llama-3.3-70b-versatile",

            messages,

            temperature: 0.7,

            max_tokens: 300,

            stream: true

        });

        // Process the stream and extract the text content
        let fullResponse = "";

        for await (const chunk of stream) {
            const content = chunk.choices?.[0]?.delta?.content || "";
            fullResponse += content;
        }

        return fullResponse;

    } catch (error) {

        console.error(error);

        throw error;

    }

}