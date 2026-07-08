import { getProducts } from "../shopify/productService.js";

export async function getProductDetails(productName) {

    const products = await getProducts();

    const product = products.find(p =>
        p.title.toLowerCase().includes(productName.toLowerCase())
    );

    return product || null;
}