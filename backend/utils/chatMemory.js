const conversations = new Map();

export function getConversation(userId) {
    if (!conversations.has(userId)) {
        conversations.set(userId, []);
    }

    return conversations.get(userId);
}

export function addMessage(userId, role, content) {
    const history = getConversation(userId);

    history.push({
        role,
        content
    });

    // Keep only the last 10 messages
    if (history.length > 10) {
        history.shift();
    }
}

export function clearConversation(userId) {
    conversations.delete(userId);
}