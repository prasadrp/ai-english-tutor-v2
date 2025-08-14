import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from 'dotenv';

// Load environment variables
config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

// Create a conversation model
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

export interface ConversationContext {
  userLevel: string;
  focusArea: string;
  previousExchanges: string[];
}

export class GeminiService {
  private chat;
  private context: ConversationContext;

  constructor(context: ConversationContext) {
    this.chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{
            text: `You are an English language tutor. The student's level is ${context.userLevel}. 
            They want to focus on ${context.focusArea}. Please adjust your responses accordingly.`
          }],
        },
        {
          role: 'model',
          parts: [{
            text: "I'll help you improve your English, focusing on your specific needs and level."
          }],
        },
      ],
    });
    this.context = context;
  }

  async sendMessage(message: string): Promise<string> {
    try {
      const result = await this.chat.sendMessage(message);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error communicating with Gemini:', error);
      return 'I apologize, but I encountered an error. Please try again.';
    }
  }

  async getPronunciationFeedback(audioTranscript: string): Promise<string> {
    try {
      const prompt = `As an English tutor, analyze this speech: "${audioTranscript}"
      Provide specific feedback on:
      1. Pronunciation accuracy
      2. Common mistakes
      3. Improvement suggestions
      Keep the response concise and encouraging.`;

      const result = await this.chat.sendMessage(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error getting pronunciation feedback:', error);
      return 'I apologize, but I encountered an error analyzing your pronunciation.';
    }
  }

  async getGrammarFeedback(text: string): Promise<string> {
    try {
      const prompt = `As an English tutor, analyze this text: "${text}"
      Provide feedback on:
      1. Grammar accuracy
      2. Sentence structure
      3. Suggested improvements
      Keep the response concise and encouraging.`;

      const result = await this.chat.sendMessage(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error getting grammar feedback:', error);
      return 'I apologize, but I encountered an error analyzing your grammar.';
    }
  }
}
