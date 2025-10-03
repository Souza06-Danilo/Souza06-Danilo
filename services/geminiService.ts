import { GoogleGenAI, Type } from "@google/genai";
import { Video } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        explanation: {
            type: Type.STRING,
            description: "A clear, concise, and simplified explanation of the programming concept or error, written for a beginner. Use markdown for formatting code snippets (e.g., ```javascript ... ```)."
        },
        videos: {
            type: Type.ARRAY,
            description: "An array of 1 to 2 relevant, high-quality YouTube videos that explain the topic.",
            items: {
                type: Type.OBJECT,
                properties: {
                    title: {
                        type: Type.STRING,
                        description: "The title of the YouTube video."
                    },
                    videoId: {
                        type: Type.STRING,
                        description: "The unique ID of the YouTube video (e.g., 'dQw4w9WgXcQ')."
                    },
                    startTimeInSeconds: {
                        type: Type.INTEGER,
                        description: "The best starting time in seconds to begin watching the video for the most relevant content. Default to 0 if the whole video is relevant."
                    }
                },
                required: ["title", "videoId", "startTimeInSeconds"]
            }
        }
    },
    required: ["explanation", "videos"]
};

export interface AiTutorResponse {
    explanation: string;
    videos: Video[];
}

export async function getAiTutorResponse(question: string): Promise<AiTutorResponse> {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `The user's question is: "${question}"`,
            config: {
                systemInstruction: "Você é o CodeMentor AI, um tutor de programação amigável e prestativo para iniciantes. Seu objetivo é tornar os conceitos de programação fáceis de entender. Quando um usuário faz uma pergunta, você deve fornecer uma explicação em texto simplificada e clara e encontrar 1 ou 2 vídeos tutoriais de alta qualidade no YouTube que abordem diretamente a questão. Responda APENAS com o formato JSON definido no schema.",
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                temperature: 0.5,
            },
        });

        const jsonText = response.text.trim();
        const parsedResponse: AiTutorResponse = JSON.parse(jsonText);
        return parsedResponse;

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Falha ao obter uma resposta do CodeMentor AI. Verifique sua chave de API e tente novamente.");
    }
}