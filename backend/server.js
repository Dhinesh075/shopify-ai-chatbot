import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import chatRoutes from "./routes/chat.js";
import productRoutes from "./routes/products.js";
import searchRoutes from "./routes/search.js";
import orderRoutes from "./routes/orders.js";
import verifyOrderRoutes from "./routes/verifyOrder.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/chat", chatRoutes);
app.use("/api/products", productRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/verify-order", verifyOrderRoutes);

app.get("/", (req, res) => {
    res.send("🚀 Shopify AI Chatbot API is running...");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});