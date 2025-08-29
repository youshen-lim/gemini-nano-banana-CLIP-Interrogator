import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generatePromptFromImage, generateImage } from '../../services/geminiService';

// Mock the GoogleGenAI class
const mockGenerateContent = vi.fn();
vi.mock('@google/genai', () => ({
  GoogleGenAI: vi.fn().mockImplementation(() => ({
    models: {
      generateContent: mockGenerateContent,
    }
  })),
  Type: {
    OBJECT: 'object',
    STRING: 'string',
  }
}));

describe('geminiService', () => {
  const mockApiKey = 'test-api-key';
  const mockImageData = 'data:image/png;base64,mockdata';
  const mockStyle = 'Photorealistic';
  const mockCreativity = 0.8;
  const mockNegativePrompt = '';

  beforeEach(() => {
    vi.clearAllMocks();
    mockGenerateContent.mockReset();
  });

  describe('generatePromptFromImage', () => {
    it('should throw error when API key is missing', async () => {
      await expect(
        generatePromptFromImage(mockImageData, mockStyle, '', mockCreativity, mockNegativePrompt)
      ).rejects.toThrow('API key is missing.');
    });

    it('should throw error when image data format is invalid', async () => {
      await expect(
        generatePromptFromImage('invalid-data', mockStyle, mockApiKey, mockCreativity, mockNegativePrompt)
      ).rejects.toThrow('Invalid image data format.');
    });

    it('should handle API key errors', async () => {
      mockGenerateContent.mockRejectedValue(
        new Error('API key unauthorized')
      );

      await expect(
        generatePromptFromImage(mockImageData, mockStyle, mockApiKey, mockCreativity, mockNegativePrompt)
      ).rejects.toThrow('Invalid API key. Please check your Gemini API key in Advanced Settings.');
    });

    it('should handle rate limit errors', async () => {
      mockGenerateContent.mockRejectedValue(
        new Error('Rate limit exceeded')
      );

      await expect(
        generatePromptFromImage(mockImageData, mockStyle, mockApiKey, mockCreativity, mockNegativePrompt)
      ).rejects.toThrow('API rate limit exceeded. Please wait a moment and try again.');
    });

    it('should handle network errors', async () => {
      mockGenerateContent.mockRejectedValue(
        new Error('Network connection failed')
      );

      await expect(
        generatePromptFromImage(mockImageData, mockStyle, mockApiKey, mockCreativity, mockNegativePrompt)
      ).rejects.toThrow('Network error. Please check your internet connection and try again.');
    });

    it('should successfully generate prompt with valid inputs', async () => {
      const mockResponse = {
        text: JSON.stringify({
          subject: 'A detailed scene',
          setting: 'in a vibrant environment',
          action: 'captured in motion',
          style: 'photorealistic',
          lighting: 'natural lighting',
          composition: 'well-framed shot',
          atmosphere: 'serene mood',
          details: 'high quality details'
        })
      };

      mockGenerateContent.mockResolvedValue(mockResponse);

      const result = await generatePromptFromImage(mockImageData, mockStyle, mockApiKey, mockCreativity, mockNegativePrompt);

      expect(result).toContain('A detailed scene');
      expect(result).toContain('photorealistic');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('generateImage', () => {
    it('should throw error when API key is missing', async () => {
      await expect(
        generateImage('test prompt', '')
      ).rejects.toThrow('API key is missing.');
    });

    it('should handle API errors appropriately', async () => {
      mockGenerateContent.mockRejectedValue(
        new Error('Content policy violation')
      );

      await expect(
        generateImage('test prompt', mockApiKey)
      ).rejects.toThrow('The prompt was blocked by content policy. Please try a different description.');
    });

    it('should successfully generate image with valid inputs', async () => {
      const mockResponse = {
        candidates: [{
          content: {
            parts: [{
              inlineData: {
                data: 'mockbase64imagedata'
              }
            }]
          }
        }]
      };

      mockGenerateContent.mockResolvedValue(mockResponse);

      const result = await generateImage('test prompt', mockApiKey);

      expect(result).toBe('data:image/png;base64,mockbase64imagedata');
    });
  });
});
