import { shopifyRequest } from "./shopify.js";

export async function getOrders() {
    const data = await shopifyRequest("/orders.json?status=any");
    return data.orders;
}

export async function getOrderByNumber(orderNumber) {

    const orders = await getOrders();

    return orders.find(order =>
        order.name.replace("#", "") === orderNumber.replace("#", "") ||
        order.order_number.toString() === orderNumber.replace("#", "")
    );
}

export async function verifyOrder(orderNumber, email) {

    const order = await getOrderByNumber(orderNumber);

    if (!order) return null;

    if (!order.email) return null;

    if (order.email.toLowerCase() !== email.toLowerCase()) {
        return null;
    }

    return order;
}