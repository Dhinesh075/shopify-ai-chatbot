import express from "express";
import { getProducts } from "../shopify/productService.js";

const router = express.Router();

router.get("/", async (req, res) => {

    const products = await getProducts();

    res.json(products);

});

export default router;