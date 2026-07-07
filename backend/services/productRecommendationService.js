import { getAIResponse } from "./aiService.js";
import { searchProducts } from "../shopify/productService.js";

export async function recommendProducts(message) {

    const prompt = `
You are a Shopify shopping assistant.

Extract ONLY the product search keywords from the customer's message.

Examples:

Customer: I need running shoes under ₹3000
Output: running shoes

Customer: Recommend black t-shirts
Output: black t-shirts

Customer: Best Nike shoes
Output: Nike shoes

Customer:
${message}

Return only the keywords.
`;

    const keyword = (await getAIResponse(prompt)).trim();

    console.log("AI Keyword:", keyword);

    return await searchProducts(keyword);
}