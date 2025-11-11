
import { GoogleGenAI, Modality } from "@google/genai";

// Fix: Per coding guidelines, initialize GoogleGenAI directly with process.env.API_KEY and assume it's set.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateStyledImage = async (base64Image: string, mimeType: string, prompt: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: base64Image,
                            mimeType: mimeType,
                        },
                    },
                    {
                        text: prompt,
                    },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return part.inlineData.data;
            }
        }

        throw new Error("No image data found in the API response.");
    } catch (error) {
        console.error("Error generating image with Gemini:", error);
        // Fix: Per coding guidelines, removed specific API key error message to avoid prompting user about it.
        // Provide a more user-friendly error message
        throw new Error("Failed to generate image. The AI model may be busy or the request could not be processed.");
    }
};
