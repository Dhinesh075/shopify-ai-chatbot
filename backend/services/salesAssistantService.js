import { searchProducts } from "../shopify/productService.js";
import { getAIResponse } from "./aiService.js";

export async function salesAssistant(userMessage, history = []) {

    const products = await searchProducts("");

    const productSummary = products.slice(0, 10).map(product => ({
        title: product.title,
        price: product.variants?.[0]?.price || "",
        vendor: product.vendor,
        type: product.product_type
    }));

    const prompt = `
Customer Question:
${userMessage}

Available Products:
${JSON.stringify(productSummary, null, 2)}

Recommend the most suitable products.
Explain why they are good choices.
Keep the response short and friendly.
`;

    return await getAIResponse(prompt, history);
}