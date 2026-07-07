import faq from "../data/faq.json" with { type: "json" };

export function getFAQAnswer(message) {

    const lower = message.toLowerCase();

    const item = faq.find(f =>
        lower.includes(f.question.toLowerCase().replace("?", ""))
    );

    return item || null;
}