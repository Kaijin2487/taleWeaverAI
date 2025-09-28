
import { GoogleGenAI, Type } from "@google/genai";
import type { StoryPage } from '../types';

if (!process.env.API_KEY) {
  // In a real app, you'd want to handle this more gracefully.
  // For this environment, we assume the key is present.
  console.warn("API_KEY environment variable not set. Using a placeholder. This will fail.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const generateStoryImage = async (prompt: string, age: number): Promise<string> => {
  try {
    const imagePrompt = `A whimsical, vibrant, simple, and joyful cartoon illustration for a children's storybook page. Style: modern animation, like Disney or Pixar. The scene: ${prompt}. Absolutely no scary, complex, or unsafe content. This is for a ${age}-year-old child.`;
    
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: imagePrompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: '1:1',
      },
    });

    const base64ImageBytes = response.generatedImages[0].image.imageBytes;
    return `data:image/jpeg;base64,${base64ImageBytes}`;
  } catch (error) {
    console.error("Error generating image:", error);
    // Return a placeholder image on error
    return `https://picsum.photos/512/512?random=${Math.random()}`;
  }
};

export const generateStory = async (prompt: string, interests: string, age: number): Promise<{ title: string; pages: Omit<StoryPage, 'imageUrl'>[] }> => {
  const systemInstruction = `You are a creative storyteller for children. Generate a short, happy, and simple story suitable for a ${age}-year-old child. The story should be about "${prompt}" and include elements of "${interests}". The tone must be positive, whimsical, and completely safe for children. Do not include any scary, complex, or negative themes. The story should have a clear beginning, middle, and end, and be around 6 pages long.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Generate the story now.`,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "A short, catchy title for the story." },
          story: {
            type: Type.ARRAY,
            description: "An array of story pages.",
            items: {
              type: Type.OBJECT,
              properties: {
                pageNumber: { type: Type.INTEGER },
                pageText: { type: Type.STRING, description: "1-3 sentences of text for this page." },
              },
              required: ["pageNumber", "pageText"],
            },
          },
        },
        required: ["title", "story"],
      },
    },
  });
  
  const jsonResponse = JSON.parse(response.text);

  return {
    title: jsonResponse.title,
    pages: jsonResponse.story.map((p: any) => ({ pageNumber: p.pageNumber, text: p.pageText }))
  };
};

export const generateStoryBook = async (prompt: string, interests: string, age: number, onProgress: (progress: number, message: string) => void): Promise<{ title: string; pages: StoryPage[] }> => {
    onProgress(0, 'Crafting your unique story...');
    const { title, pages: textPages } = await generateStory(prompt, interests, age);
    
    const totalPages = textPages.length;
    const storyPages: StoryPage[] = [];

    onProgress(10, `Story draft complete! Now, illustrating ${totalPages} pages...`);

    for (let i = 0; i < totalPages; i++) {
        const page = textPages[i];
        const progress = 10 + Math.round(((i + 1) / totalPages) * 85);
        onProgress(progress, `Illustrating page ${i + 1} of ${totalPages}...`);
        
        const imageUrl = await generateStoryImage(page.text, age);
        storyPages.push({ ...page, imageUrl });
    }

    onProgress(100, 'Your storybook is ready!');
    return { title, pages: storyPages.sort((a, b) => a.pageNumber - b.pageNumber) };
};

export const getChatbotResponse = async (query: string): Promise<string> => {
    const systemInstruction = "You are a friendly, patient, and knowledgeable chatbot for parents called 'Ask Sparkle'. You answer questions about child development, positive parenting, and fun activities. Your answers must be safe, supportive, concise, and easy to understand. Do not give medical advice. If asked about medical issues, gently suggest consulting a pediatrician.";
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: query,
        config: {
            systemInstruction
        }
    });

    return response.text;
};
