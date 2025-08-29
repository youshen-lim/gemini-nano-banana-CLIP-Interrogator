import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generatePromptFromImage, generateImage } from '../../services/geminiService';

// Mock the GoogleGenAI class for integration tests
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

describe('Integration Tests - End-to-End Workflow', () => {
  const mockApiKey = 'test-api-key';
  const mockImageData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
  const mockStyle = 'Photorealistic';
  const mockCreativity = 0.8;
  const mockNegativePrompt = 'blurry, text';

  beforeEach(() => {
    vi.clearAllMocks();
    mockGenerateContent.mockReset();
  });

  describe('Complete Image-to-JSON-Prompt Workflow', () => {
    it('should successfully complete the full workflow from image analysis to JSON prompt generation', async () => {
      // Mock the prompt generation response
      const mockPromptResponse = {
        text: JSON.stringify({
          subject: 'A professional photographer with weathered hands and focused eyes',
          setting: 'in a sun-drenched studio filled with natural light streaming through large windows',
          action: 'carefully adjusting camera settings while examining the composition',
          style: 'photorealistic with studio-quality lighting and sharp focus',
          lighting: 'soft, diffused natural light from large windows creating gentle shadows and realistic skin tones',
          composition: 'medium shot captured with an 85mm lens creating natural perspective and shallow depth of field',
          atmosphere: 'professional and focused with a sense of creative concentration',
          details: 'fine texture details in skin and fabric, subtle color variations, professional color grading'
        })
      };

      // Mock the image generation response
      const mockImageResponse = {
        candidates: [{
          content: {
            parts: [{
              inlineData: {
                data: 'mockgeneratedimagebase64data'
              }
            }]
          }
        }]
      };

      // First call for prompt generation
      mockGenerateContent.mockResolvedValueOnce(mockPromptResponse);
      
      // Generate optimized prompt from image
      const optimizedPrompt = await generatePromptFromImage(
        mockImageData, 
        mockStyle, 
        mockApiKey, 
        mockCreativity, 
        mockNegativePrompt
      );

      // Verify the prompt was generated successfully
      expect(optimizedPrompt).toBeDefined();
      expect(typeof optimizedPrompt).toBe('string');
      expect(optimizedPrompt.length).toBeGreaterThan(0);
      expect(optimizedPrompt).toContain('professional photographer');
      expect(optimizedPrompt).toContain('photorealistic');
      expect(optimizedPrompt).toContain('studio-quality lighting');

      // Second call for image generation
      mockGenerateContent.mockResolvedValueOnce(mockImageResponse);

      // Generate image from the optimized prompt
      const generatedImageUrl = await generateImage(optimizedPrompt, mockApiKey);

      // Verify the image was generated successfully
      expect(generatedImageUrl).toBeDefined();
      expect(generatedImageUrl).toBe('data:image/png;base64,mockgeneratedimagebase64data');
      expect(generatedImageUrl.startsWith('data:image/png;base64,')).toBe(true);

      // Verify both API calls were made with correct parameters
      expect(mockGenerateContent).toHaveBeenCalledTimes(2);
    });

    it('should handle negative prompts correctly in the workflow', async () => {
      const mockPromptResponse = {
        text: JSON.stringify({
          subject: 'A clear, sharp portrait of a person',
          setting: 'in a well-lit environment with clean backgrounds',
          action: 'posing confidently with clear facial features',
          style: 'photorealistic with high clarity and definition',
          lighting: 'bright, even lighting that eliminates shadows and blur',
          composition: 'sharp focus with crisp details throughout the frame',
          atmosphere: 'clean and professional with excellent visibility',
          details: 'crystal clear textures, no artifacts, professional quality'
        })
      };

      mockGenerateContent.mockResolvedValueOnce(mockPromptResponse);

      const optimizedPrompt = await generatePromptFromImage(
        mockImageData, 
        mockStyle, 
        mockApiKey, 
        mockCreativity, 
        'blurry, text, watermarks, low quality'
      );

      // Verify that the negative prompt influenced the generation
      expect(optimizedPrompt).toContain('clear');
      expect(optimizedPrompt).toContain('sharp');
      expect(optimizedPrompt).not.toContain('blurry');
      expect(optimizedPrompt).not.toContain('watermarks');
    });

    it('should generate prompts suitable for different artistic styles', async () => {
      const styles = ['Photorealistic', 'Digital Painting', 'Watercolor', 'Anime', 'Cinematic'];
      
      for (const style of styles) {
        const mockPromptResponse = {
          text: JSON.stringify({
            subject: `A subject rendered in ${style.toLowerCase()} style`,
            setting: `in an environment suited for ${style.toLowerCase()} artwork`,
            action: 'engaging in appropriate activity for the style',
            style: style.toLowerCase(),
            lighting: `lighting appropriate for ${style.toLowerCase()} style`,
            composition: `composition suited for ${style.toLowerCase()} artwork`,
            atmosphere: `atmosphere matching ${style.toLowerCase()} aesthetic`,
            details: `details characteristic of ${style.toLowerCase()} style`
          })
        };

        mockGenerateContent.mockResolvedValueOnce(mockPromptResponse);

        const optimizedPrompt = await generatePromptFromImage(
          mockImageData, 
          style, 
          mockApiKey, 
          mockCreativity, 
          ''
        );

        expect(optimizedPrompt).toContain(style.toLowerCase());
        expect(optimizedPrompt.length).toBeGreaterThan(50);
      }
    });
  });

  describe('JSON Output Validation', () => {
    it('should generate valid JSON-structured prompts with all required fields', async () => {
      const mockPromptResponse = {
        text: JSON.stringify({
          subject: 'A detailed subject description',
          setting: 'A comprehensive setting description',
          action: 'A specific action description',
          style: 'A style specification',
          lighting: 'A lighting setup description',
          composition: 'A composition description',
          atmosphere: 'An atmosphere description',
          details: 'Specific detail descriptions'
        })
      };

      mockGenerateContent.mockResolvedValueOnce(mockPromptResponse);

      const optimizedPrompt = await generatePromptFromImage(
        mockImageData, 
        mockStyle, 
        mockApiKey, 
        mockCreativity, 
        mockNegativePrompt
      );

      // Verify the prompt contains elements from all required JSON fields
      expect(optimizedPrompt).toContain('detailed subject');
      expect(optimizedPrompt).toContain('comprehensive setting');
      expect(optimizedPrompt).toContain('specific action');
      expect(optimizedPrompt).toContain('style specification');
      expect(optimizedPrompt).toContain('lighting setup');
      expect(optimizedPrompt).toContain('composition');
      expect(optimizedPrompt).toContain('atmosphere');
      expect(optimizedPrompt).toContain('detail descriptions');
    });

    it('should handle malformed JSON responses gracefully', async () => {
      const mockPromptResponse = {
        text: 'invalid json response'
      };

      mockGenerateContent.mockResolvedValueOnce(mockPromptResponse);

      await expect(
        generatePromptFromImage(mockImageData, mockStyle, mockApiKey, mockCreativity, mockNegativePrompt)
      ).rejects.toThrow('The AI model returned an invalid response format');
    });

    it('should provide fallback values for missing JSON fields', async () => {
      const mockPromptResponse = {
        text: JSON.stringify({
          subject: 'A test subject',
          // Missing other required fields
        })
      };

      mockGenerateContent.mockResolvedValueOnce(mockPromptResponse);

      const optimizedPrompt = await generatePromptFromImage(
        mockImageData, 
        mockStyle, 
        mockApiKey, 
        mockCreativity, 
        mockNegativePrompt
      );

      // Should still generate a valid prompt with fallback values
      expect(optimizedPrompt).toBeDefined();
      expect(optimizedPrompt.length).toBeGreaterThan(0);
      expect(optimizedPrompt).toContain('A test subject');
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle empty API responses', async () => {
      mockGenerateContent.mockResolvedValueOnce({ text: '' });

      await expect(
        generatePromptFromImage(mockImageData, mockStyle, mockApiKey, mockCreativity, mockNegativePrompt)
      ).rejects.toThrow('The model returned an empty response');
    });

    it('should handle API timeout scenarios', async () => {
      mockGenerateContent.mockRejectedValueOnce(new Error('Request timeout'));

      await expect(
        generatePromptFromImage(mockImageData, mockStyle, mockApiKey, mockCreativity, mockNegativePrompt)
      ).rejects.toThrow('Request timed out');
    });

    it('should validate image data format before processing', async () => {
      await expect(
        generatePromptFromImage('invalid-image-data', mockStyle, mockApiKey, mockCreativity, mockNegativePrompt)
      ).rejects.toThrow('Invalid image data format');
    });
  });
});
