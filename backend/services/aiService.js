import client from "./aiClient.js";

export async function getAIResponse(message, history = []) {

    const messages = [
        {
            role: "system",
            content: `
            You are an AI shopping assistant for a Shopify store.

            Rules:
            - Never invent products, discounts, promotions, stock, or new arrivals.
            - Only mention products when they are returned by the Shopify API.
            - If the user greets you, respond with a simple greeting.
            - If the user asks about products, help them search or recommend products based on available data.
            - If you don't know something, say you don't know instead of guessing.
            - Keep responses short, friendly, and professional.
            `
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

            temperature: 0.3,

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