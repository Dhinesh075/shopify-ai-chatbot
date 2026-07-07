import express from "express";
import { verifyOrder } from "../shopify/orderService.js";

const router = express.Router();

router.post("/", async (req, res) => {

    try {

        const { orderNumber, email } = req.body;

        const order = await verifyOrder(orderNumber, email);

        if (!order) {

            return res.status(404).json({
                success: false,
                message: "Order not found or email doesn't match."
            });

        }

        res.json({
            success: true,
            order
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            error: err.message
        });

    }

});

export default router;