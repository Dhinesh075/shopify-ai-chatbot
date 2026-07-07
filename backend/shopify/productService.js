import { shopifyRequest } from "./shopify.js";

export async function getProducts() {
    const data = await shopifyRequest("/products.json");
    return data.products;
}

export async function searchProducts(keyword) {
    const products = await getProducts();
    return products.filter(product =>
        product.title.toLowerCase().includes(keyword.toLowerCase())
    );
}