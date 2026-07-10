'use client';
import { useState } from 'react';

export function Chat() {
    const [messages, setMessages] = useState<{ id: string; role: string; content: string }[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { id: Date.now().toString(), role: 'user', content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                body: JSON.stringify({ messages: [...messages, userMessage] }),
            });

            if (!response.body) throw new Error("No response body");

            // Handle the streaming response manually
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let aiMessage = { id: (Date.now() + 1).toString(), role: 'assistant', content: '' };
            setMessages((prev) => [...prev, aiMessage]);

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value);
                aiMessage.content += chunk;
                setMessages((prev) => [...prev.slice(0, -1), { ...aiMessage }]);
            }
        } catch (err) {
            console.error("Chat Error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-4 p-4 border border-zinc-800 rounded-xl bg-zinc-900/60">
        <div className="flex flex-col gap-2 h-64 overflow-y-auto">
        {messages.map((m) => (
            <div key={m.id} className={`p-2 rounded ${m.role === 'user' ? 'bg-indigo-900/50' : 'bg-zinc-800'}`}>
            <span className="font-bold">{m.role === 'user' ? 'You: ' : 'AI: '}</span>
            {m.content}
            </div>
        ))}
        </div>

        <div className="flex gap-2">
        <input
        className="flex-1 p-2 bg-zinc-950 border border-zinc-700 rounded text-white"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        placeholder={isLoading ? "Thinking..." : "Ask about your progress..."}
        />
        <button
        onClick={sendMessage}
        disabled={isLoading}
        className="px-4 py-2 bg-indigo-600 rounded text-white"
        >
        {isLoading ? "..." : "Send"}
        </button>
        </div>
        </div>
    );
}
