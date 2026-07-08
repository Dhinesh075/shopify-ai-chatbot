import { getProducts, searchProducts } from "../shopify/productService.js";
import { getOrderByNumber } from "../shopify/orderService.js";
import { getAIResponse } from "./aiService.js";
import { getFAQAnswer } from "./faqService.js";
import { compareProducts } from "./compareService.js";
import { salesAssistant } from "./salesAssistantService.js";
import { getProductDetails } from "./productDetailsService.js";
import { filterProducts } from "../utils/filterProducts.js";

export async function askAI(message, history = []) {

    const lower = message.toLowerCase();

    console.log("Message:", message);
    console.log("History:", history);

    // ===================================
    // AI Sales Assistant
    // ===================================

    const recommendationWords = [
        "recommend",
        "suggest",
        "best",
        "comfortable",
        "cheap",
        "budget",
        "running",
        "walking",
        "gym",
        "gift",
        "which",
        "good for"
    ];

    const isRecommendation =
        recommendationWords.some(word => lower.includes(word));

    if (isRecommendation) {

        const reply = await salesAssistant(message, history);

        return {
            type: "text",
            reply
        };
    }

    // ===================================
    // Product Search
    // ===================================

    const searchWords = [
        "show",
        "find",
        "search",
        "looking",
        "need",
        "buy"
    ];

    const isSearch =
        searchWords.some(word => lower.includes(word));

    if (isSearch) {

        let keyword = lower
            .replace("show", "")
            .replace("find", "")
            .replace("search", "")
            .replace("looking for", "")
            .replace("need", "")
            .replace("buy", "")
            .trim();

        // Parse price filters from keyword
        const filters = {};

        // Check for "under $XX" or "under XX"
        const underMatch = keyword.match(/under\s*\$?(\d+(?:\.\d{2})?)/i);
        if (underMatch) {
            filters.maxPrice = parseFloat(underMatch[1]);
            keyword = keyword.replace(/under\s*\$?\d+(?:\.\d{2})?/i, "").trim();
            console.log(`💰 Max Price Filter: $${filters.maxPrice}`);
        }

        // Check for "over $XX" or "above $XX" (for minPrice if needed)
        const overMatch = keyword.match(/(?:over|above)\s*\$?(\d+(?:\.\d{2})?)/i);
        if (overMatch) {
            filters.minPrice = parseFloat(overMatch[1]);
            keyword = keyword.replace(/(?:over|above)\s*\$?\d+(?:\.\d{2})?/i, "").trim();
            console.log(`💰 Min Price Filter: $${filters.minPrice}`);
        }

        const isGenericAllProducts = [
            "",
            "products",
            "product",
            "all",
            "all products"
        ].includes(keyword);

        console.log(`🔎 Search Query - Keyword: "${keyword}", Generic: ${isGenericAllProducts}`);

        let products = isGenericAllProducts
            ? await getProducts()
            : await searchProducts(keyword);

        console.log(`📦 Products before filter: ${products.length}`);

        // Apply price filters
        if (Object.keys(filters).length > 0) {
            const beforeFilter = products.length;
            products = filterProducts(products, filters);
            console.log(`📦 Products after filter: ${products.length} (removed ${beforeFilter - products.length})`);
        }

        if (products.length === 0) {
            console.log("⚠️ No products found matching criteria");
            return {
                type: "text",
                reply: "Sorry, I couldn't find any matching products."
            };
        }

        console.log(`✅ Returning ${products.length} products`);

        return {
            type: "products",
            products: products.map(product => ({
                id: product.id,
                variantId: product.variants?.[0]?.id || "",
                title: product.title,
                description: product.body_html || "",
                vendor: product.vendor,
                productType: product.product_type,
                available: product.variants?.[0]?.available,
                price: product.variants?.[0]?.price || "",
                image: product.image?.src || "",
                handle: product.handle,
                url: `https://${process.env.SHOPIFY_STORE}.myshopify.com/products/${product.handle}`
            }))
        };

    }

    // ===================================
    // Show All Products
    // ===================================

    if (
        lower.includes("product") ||
        lower.includes("products") ||
        lower.includes("shoe") ||
        lower.includes("shirt")
    ) {

        const products = await getProducts();

        return {
            type: "products",
            products: products.map(product => ({
                id: product.id,
                variantId: product.variants?.[0]?.id || "",
                title: product.title,
                description: product.body_html || "",
                vendor: product.vendor,
                productType: product.product_type,
                available: product.variants?.[0]?.available,
                price: product.variants?.[0]?.price || "",
                image: product.image?.src || "",
                handle: product.handle,
                url: `https://${process.env.SHOPIFY_STORE}.myshopify.com/products/${product.handle}`
            }))
        };

    }

    // ===================================
    // Track Order
    // ===================================

    if (lower.includes("track")) {

        const match = message.match(/\d+/);

        if (!match) {

            return {
                type: "text",
                reply: "Please provide your order number. Example: Track order #1002"
            };

        }

        const order = await getOrderByNumber(match[0]);

        if (!order) {

            return {
                type: "text",
                reply: "❌ Order not found."
            };

        }

        return {

            type: "text",

            reply: `📦 Order ${order.name}

Payment: ${order.financial_status}

Fulfillment: ${order.fulfillment_status || "Pending"}`
        };

    }

    // ===================================
    // FAQ
    // ===================================

    const faq = getFAQAnswer(message);

    if (faq) {

        return {

            type: "text",

            reply: faq.answer

        };

    }

    // ===================================
    // Wishlist
    // ===================================

    if (lower.includes("wishlist")) {

        return {

            type: "wishlist"

        };

    }

    // ===================================
    // Compare Products
    // ===================================

    if (lower.includes("compare")) {

        const match =
            message.match(/compare\s+(.*?)\s+and\s+(.*)/i);

        if (!match) {

            return {

                type: "text",

                reply:
                    "Please use:\nCompare Product A and Product B"

            };

        }

        const comparison =
            await compareProducts(
                match[1].trim(),
                match[2].trim()
            );

        if (!comparison) {

            return {

                type: "text",

                reply:
                    "Sorry, I couldn't find one or both products."

            };

        }

        return {

            type: "comparison",

            comparison: {

                first: {

                    title: comparison.first.title,

                    price:
                        comparison.first.variants?.[0]?.price || "",

                    vendor:
                        comparison.first.vendor,

                    type:
                        comparison.first.product_type,

                    available:
                        comparison.first.variants?.[0]?.available,

                    image:
                        comparison.first.image?.src || ""

                },

                second: {

                    title: comparison.second.title,

                    price:
                        comparison.second.variants?.[0]?.price || "",

                    vendor:
                        comparison.second.vendor,

                    type:
                        comparison.second.product_type,

                    available:
                        comparison.second.variants?.[0]?.available,

                    image:
                        comparison.second.image?.src || ""

                }

            }

        };

    }

    // ===================================
    // Recently Viewed
    // ===================================

    if (
        lower.includes("recent") ||
        lower.includes("recently viewed")
    ) {

        return {

            type: "recentlyViewed"

        };

    }

    const detailWords = [
        "tell me about",
        "details",
        "describe",
        "information about"
    ];

    const wantsDetails = detailWords.some(word =>
        lower.includes(word)
    );

    if (wantsDetails) {

        const productName = message
            .replace("tell me about", "")
            .replace("details of", "")
            .replace("describe", "")
            .replace("information about", "")
            .trim();

        const product = await getProductDetails(productName);

        if (!product) {
            return {
                type: "text",
                reply: "Sorry, I couldn't find that product."
            };
        }

        return {
            type: "text",
            reply:
    `📦 ${product.title}

    💲 Price: $${product.variants?.[0]?.price}

    🏷 Brand: ${product.vendor}

    📂 Category: ${product.product_type}

    ✅ Available: ${product.variants?.[0]?.available ? "Yes" : "No"}

    📝 Description:

    ${product.body_html.replace(/<[^>]+>/g, "")}`
        };
    }

    // ===================================
    // AI Fallback
    // ===================================

    try {

        const aiReply =
            await getAIResponse(message, history);

        return {

            type: "text",

            reply: aiReply

        };

    } catch (error) {

        console.error(error);

        return {

            type: "text",

            reply:
                "Sorry, I'm having trouble connecting to the AI service right now."

        };

    }

}