import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
export const getGeminiResponse = async (prompt: string, history: { role: string; content: string }[]) => {
    if (!API_KEY || API_KEY.includes('YOUR_GEMINI_KEY') || API_KEY === '') {
        return "SYSTEM HALTED: GEMINI API KEY REQUIRED. Please configure your VITE_GEMINI_API_KEY environment variable to establish neural link.";
    }

    try {
        const genAI = new GoogleGenerativeAI(API_KEY);
        const geminiModel = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            systemInstruction: "You are the Command Center Strategic AI. Your responses must be concise, professional, and data-driven. Avoid military roleplay. Use uppercase for key technical terms. Provide analytical insights based on real-time data trends.",
        });

        const chat = geminiModel.startChat({
            history: history.map(h => ({
                role: h.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: h.content }],
            })),
        });

        const result = await chat.sendMessage(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Gemini API Error:", error);
        return "ERROR: DATA_LINK_FAILURE // UNABLE TO RETRIEVE ANALYTICAL STREAMS.";
    }
};
