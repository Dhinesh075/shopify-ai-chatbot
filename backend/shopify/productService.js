import { shopifyRequest } from "./shopify.js";

export async function getProducts() {
    try {
        const data = await shopifyRequest("/products.json");
        console.log(`✓ Fetched ${data.products.length} products from Shopify`);
        return data.products || [];
    } catch (error) {
        console.error("❌ Error fetching products:", error.message);
        return [];
    }
}

export async function searchProducts(keyword) {
    try {
        const products = await getProducts();
        
        if (!keyword || keyword.trim() === "") {
            return products;
        }

        const filtered = products.filter(product => {
            const title = product.title?.toLowerCase() || "";
            const description = product.body_html?.toLowerCase() || "";
            const vendor = product.vendor?.toLowerCase() || "";
            const productType = product.product_type?.toLowerCase() || "";
            const keyword_lower = keyword.toLowerCase();
            
            return title.includes(keyword_lower) || 
                   description.includes(keyword_lower) ||
                   vendor.includes(keyword_lower) ||
                   productType.includes(keyword_lower);
        });

        console.log(`🔍 Searched for "${keyword}": found ${filtered.length} products`);
        return filtered;
    } catch (error) {
        console.error("❌ Error searching products:", error.message);
        return [];
    }
}