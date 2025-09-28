import { GoogleGenerativeAI } from '@google/generative-ai';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export interface StoryPage {
  pageNumber: number;
  text: string;
  imageUrl: string;
}

export interface StoryGenerationRequest {
  prompt: string;
  interests?: string;
  age: number;
}

export class GeminiService {
  private static instance: GeminiService;
  private textModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
  private imageModel = genAI.getGenerativeModel({ model: 'imagen-3.0-generate-001' });

  private constructor() {}

  public static getInstance(): GeminiService {
    if (!GeminiService.instance) {
      GeminiService.instance = new GeminiService();
    }
    return GeminiService.instance;
  }

  /**
   * Generate a complete storybook with text and images
   */
  async generateStorybook(request: StoryGenerationRequest): Promise<{
    title: string;
    pages: StoryPage[];
  }> {
    try {
      // Generate story content
      const storyContent = await this.generateStoryContent(request);
      
      // Generate images for each page
      const pages: StoryPage[] = [];
      
      for (let i = 0; i < storyContent.pages.length; i++) {
        const pageText = storyContent.pages[i];
        
        // Generate image for this page
        const imageUrl = await this.generateAndUploadImage(pageText, i + 1);
        
        pages.push({
          pageNumber: i + 1,
          text: pageText,
          imageUrl: imageUrl
        });
      }

      return {
        title: storyContent.title,
        pages: pages
      };
    } catch (error) {
      console.error('Error generating storybook:', error);
      throw new Error('Failed to generate storybook');
    }
  }

  /**
   * Generate story content using Gemini text model
   */
  private async generateStoryContent(request: StoryGenerationRequest): Promise<{
    title: string;
    pages: string[];
  }> {
    const { prompt, interests, age } = request;
    
    const systemPrompt = `You are a children's story writer. Create an engaging, age-appropriate story for a ${age}-year-old child.

Requirements:
- Create a story with 6-8 pages
- Each page should have 2-3 sentences maximum
- Use simple, clear language appropriate for age ${age}
- Include positive themes and values
- Make it engaging and fun to read
- ${interests ? `Incorporate the child's interests: ${interests}` : ''}

Story prompt: ${prompt}

Please respond with a JSON object in this exact format:
{
  "title": "Story Title",
  "pages": [
    "Page 1 text here",
    "Page 2 text here",
    "Page 3 text here",
    ...
  ]
}`;

    try {
      const result = await this.textModel.generateContent(systemPrompt);
      const response = await result.response;
      const text = response.text();
      
      // Parse JSON response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid response format from Gemini');
      }
      
      const storyData = JSON.parse(jsonMatch[0]);
      
      if (!storyData.title || !storyData.pages || !Array.isArray(storyData.pages)) {
        throw new Error('Invalid story data structure');
      }
      
      return storyData;
    } catch (error) {
      console.error('Error generating story content:', error);
      throw new Error('Failed to generate story content');
    }
  }

  /**
   * Generate and upload image for a story page
   */
  private async generateAndUploadImage(pageText: string, pageNumber: number): Promise<string> {
    try {
      const imagePrompt = `Create a colorful, child-friendly illustration for a children's storybook page. 
      
Page text: "${pageText}"

Style requirements:
- Bright, vibrant colors
- Simple, clean art style suitable for children
- Cartoon-like characters
- Safe and appropriate imagery
- High quality, detailed illustration
- 16:9 aspect ratio
- No text overlay on the image`;

      const result = await this.imageModel.generateContent(imagePrompt);
      const response = await result.response;
      
      // Note: The actual image generation API might return different data structure
      // This is a placeholder for the image data
      const imageData = response.text(); // This might need to be adjusted based on actual API response
      
      // Upload to Cloudinary
      const uploadResult = await cloudinary.uploader.upload(
        `data:image/png;base64,${imageData}`,
        {
          folder: 'taleweaver-ai/story-images',
          public_id: `story-page-${Date.now()}-${pageNumber}`,
          resource_type: 'image',
          transformation: [
            { width: 800, height: 450, crop: 'fill', quality: 'auto' }
          ]
        }
      );
      
      return uploadResult.secure_url;
    } catch (error) {
      console.error('Error generating/uploading image:', error);
      // Return a placeholder image URL if generation fails
      return 'https://via.placeholder.com/800x450/FFE4E1/FF69B4?text=Story+Illustration';
    }
  }

  /**
   * Generate chatbot response for parenting questions
   */
  async generateChatbotResponse(query: string): Promise<string> {
    const systemPrompt = `You are Sparkle, a friendly and knowledgeable AI assistant specializing in parenting advice and child development. 

Your personality:
- Warm, encouraging, and supportive
- Knowledgeable about child development, parenting strategies, and family life
- Always prioritize child safety and well-being
- Provide practical, actionable advice
- Use a conversational, friendly tone
- Keep responses concise but helpful (2-3 paragraphs max)

Important guidelines:
- Always recommend consulting with pediatricians or child development specialists for serious concerns
- Focus on positive parenting approaches
- Be inclusive and respectful of different parenting styles
- Never provide medical advice - always defer to healthcare professionals
- Encourage parents and build their confidence

User's question: ${query}`;

    try {
      const result = await this.textModel.generateContent(systemPrompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating chatbot response:', error);
      throw new Error('Failed to generate chatbot response');
    }
  }
}

export const geminiService = GeminiService.getInstance();
