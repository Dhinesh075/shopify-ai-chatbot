import { askAI } from "../services/openaiService.js";
import {
    getConversation,
    addMessage
} from "../utils/chatMemory.js";

export async function chat(req, res) {

    try {

        const { message } = req.body;

        if (!message) {

            return res.status(400).json({
                success: false,
                error: "Message is required"
            });

        }

        // Temporary user id
        const userId = "guest";

        // Save user message
        addMessage(userId, "user", message);

        // Get previous conversation
        const history = getConversation(userId);

        // Send message + history to AI
        const result = await askAI(message, history);

        // Save bot reply
        if (result.reply) {
            addMessage(userId, "assistant", result.reply);
        }

        res.json({
            success: true,
            ...result
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            error: error.message
        });

    }

}