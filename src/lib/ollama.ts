import { createOllama } from 'ollama-ai-provider';

export const ollama = createOllama({
    baseURL: 'http://localhost:11434/api',
});
