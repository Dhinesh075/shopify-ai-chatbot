import express from "express";
import { getOrderByNumber } from "../shopify/orderService.js";

const router = express.Router();

router.get("/:orderNumber", async (req, res) => {

    const order = await getOrderByNumber(req.params.orderNumber);

    if (!order) {
        return res.status(404).json({
            success: false,
            message: "Order not found"
        });
    }

    res.json({
        success: true,
        order
    });

});

export default router;