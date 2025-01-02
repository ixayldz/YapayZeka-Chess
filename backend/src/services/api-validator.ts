import OpenAI from 'openai';

export class APIValidator {
  public async validateApiKey(modelType: string, apiKey: string): Promise<boolean> {
    try {
      if (modelType.includes('gpt')) {
        const openai = new OpenAI({ apiKey });
        await openai.models.list();
        return true;
      }

      // Diğer API servisleri için doğrulama eklenecek
      return true;
    } catch (error) {
      console.error('API key validation error:', error);
      return false;
    }
  }
} 