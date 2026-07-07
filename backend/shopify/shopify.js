import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const BASE_URL = `https://${process.env.SHOPIFY_STORE}.myshopify.com/admin/api/2024-10`;

export async function shopifyRequest(endpoint) {
    const response = await axios.get(
        `${BASE_URL}${endpoint}`,
        {
            headers: {
                "X-Shopify-Access-Token": process.env.SHOPIFY_ACCESS_TOKEN,
                "Content-Type": "application/json"
            }
        }
    );

    return response.data;
}