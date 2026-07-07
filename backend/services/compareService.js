import { searchProducts } from "../shopify/productService.js";

export async function compareProducts(name1, name2) {

    const first = await searchProducts(name1);
    const second = await searchProducts(name2);

    if (first.length === 0 || second.length === 0) {
        return null;
    }

    return {
        first: first[0],
        second: second[0]
    };
}