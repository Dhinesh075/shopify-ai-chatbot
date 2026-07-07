import express from "express";
import { searchProducts } from "../shopify/productService.js";

const router = express.Router();

router.get("/", async (req, res) => {

    const keyword = req.query.q || "";

    const products = await searchProducts(keyword);

    res.json(products);

});

export default router;