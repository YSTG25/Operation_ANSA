import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { db } from '@/lib/db'; // Ensure this matches your export

const ollama = createOpenAI({
    baseURL: 'http://localhost:11434/v1',
    apiKey: 'ollama',
});

async function getLiveUserData() {
    try {
        // Fetch goals and include their recent entries
        const goals = await db.goal.findMany({
            take: 5,
            include: {
                entries: {
                    take: 5,
                    orderBy: { date: 'desc' },
                },
            },
        });

        return goals
        .map((g) => {
            const lastEntry = g.entries[0];
            return `- Goal: ${g.title} | Target: ${g.targetValue || 'N/A'} ${g.unit || ''} | Last Status: ${lastEntry ? (lastEntry.completed ? 'Completed' : 'Not Completed') : 'No entries'}`;
        })
        .join('\n');
    } catch (error) {
        console.error("Database fetch failed:", error);
        return "No goal data found.";
    }
}

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();
        const liveContext = await getLiveUserData();

        const result = await streamText({
            model: ollama('llama3.2'),
                                        system: `You are a personal AI collaborator. You have access to his goal tracking data.
                                        Answer using this live data: ${liveContext}.`,
                                        messages,
        });

        return result.toTextStreamResponse();
    } catch (error) {
        console.error("API Error:", error);
        return new Response("Error processing request", { status: 500 });
    }
}
