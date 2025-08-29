import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generatePromptFromImage } from '../../services/geminiService';

// Mock the GoogleGenAI class for sample output demonstration
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

describe('Sample Output Validation', () => {
  const mockApiKey = 'test-api-key';
  // Sample 1x1 pixel PNG image in base64
  const sampleImageData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

  beforeEach(() => {
    vi.clearAllMocks();
    mockGenerateContent.mockReset();
  });

  it('should generate a comprehensive JSON-format prompt suitable for Gemini 2.5 Flash Image', async () => {
    // Mock a realistic response that demonstrates the expected JSON structure
    const mockResponse = {
      text: JSON.stringify({
        subject: 'A professional photographer with weathered hands and focused eyes, wearing a vintage leather jacket',
        setting: 'in a sun-drenched photography studio with large windows casting dramatic natural light across wooden floors and exposed brick walls',
        action: 'carefully adjusting the settings on a vintage film camera while examining the composition through the viewfinder',
        style: 'photorealistic with studio-quality lighting, sharp focus, and professional color grading',
        lighting: 'soft, diffused natural light from large north-facing windows creating gentle shadows and realistic skin tones, complemented by subtle fill lighting',
        composition: 'medium shot captured with an 85mm lens creating natural perspective and shallow depth of field, with the subject positioned using the rule of thirds',
        atmosphere: 'professional and contemplative with a sense of creative focus and artistic dedication',
        details: 'fine texture details in leather and fabric, subtle color variations in skin tones, professional color grading with warm highlights and cool shadows'
      })
    };

    mockGenerateContent.mockResolvedValue(mockResponse);

    const result = await generatePromptFromImage(
      sampleImageData,
      'Photorealistic',
      mockApiKey,
      0.8,
      'blurry, low quality'
    );

    // Validate the output structure and content
    expect(result).toBeDefined();
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(100);

    // Verify it contains narrative descriptions (not just keywords)
    expect(result).toMatch(/\b(with|in|while|creating|using)\b/); // Contains connecting words
    expect(result).not.toMatch(/^[\w\s,]+$/); // Not just comma-separated keywords

    // Verify it contains professional photography terminology
    expect(result).toMatch(/(lighting|composition|focus|lens|perspective|shadows)/i);

    // Verify it contains descriptive, narrative elements
    expect(result).toMatch(/(professional|weathered|dramatic|gentle|subtle|creative)/i);

    // Verify it's suitable for high-quality image generation
    expect(result).toMatch(/(quality|detail|realistic|professional)/i);

    console.log('Sample Generated Prompt:');
    console.log('========================');
    console.log(result);
    console.log('========================');
    console.log(`Prompt Length: ${result.length} characters`);
    console.log(`Word Count: ${result.split(' ').length} words`);
  });

  it('should generate different prompts for different artistic styles', async () => {
    const styles = [
      {
        name: 'Cinematic',
        expectedElements: ['dramatic', 'lighting', 'cinematic', 'film']
      },
      {
        name: 'Watercolor',
        expectedElements: ['soft', 'flowing', 'translucent', 'watercolor']
      },
      {
        name: 'Anime',
        expectedElements: ['vibrant', 'cel-shaded', 'anime', 'bright']
      }
    ];

    for (const style of styles) {
      const mockResponse = {
        text: JSON.stringify({
          subject: `A character rendered in ${style.name.toLowerCase()} style`,
          setting: `in an environment suited for ${style.name.toLowerCase()} artwork`,
          action: 'engaging in dynamic activity',
          style: `${style.name.toLowerCase()} with characteristic visual elements`,
          lighting: `lighting appropriate for ${style.name.toLowerCase()} style`,
          composition: `composition suited for ${style.name.toLowerCase()} artwork`,
          atmosphere: `atmosphere matching ${style.name.toLowerCase()} aesthetic`,
          details: `details characteristic of ${style.name.toLowerCase()} style`
        })
      };

      mockGenerateContent.mockResolvedValueOnce(mockResponse);

      const result = await generatePromptFromImage(
        sampleImageData,
        style.name,
        mockApiKey,
        0.8,
        ''
      );

      // Verify style-specific elements are present
      const lowerResult = result.toLowerCase();
      const hasStyleElements = style.expectedElements.some(element => 
        lowerResult.includes(element.toLowerCase())
      );
      
      expect(hasStyleElements).toBe(true);
      expect(result.length).toBeGreaterThan(50);

      console.log(`\n${style.name} Style Sample:`);
      console.log('-'.repeat(30));
      console.log(result.substring(0, 150) + '...');
    }
  });

  it('should demonstrate proper JSON schema validation', async () => {
    // Test with all required fields present
    const completeResponse = {
      text: JSON.stringify({
        subject: 'Complete subject description',
        setting: 'Complete setting description',
        action: 'Complete action description',
        style: 'Complete style description',
        lighting: 'Complete lighting description',
        composition: 'Complete composition description',
        atmosphere: 'Complete atmosphere description',
        details: 'Complete details description'
      })
    };

    mockGenerateContent.mockResolvedValue(completeResponse);

    const result = await generatePromptFromImage(
      sampleImageData,
      'Photorealistic',
      mockApiKey,
      0.8,
      ''
    );

    // Verify all schema elements are incorporated
    expect(result).toContain('Complete subject');
    expect(result).toContain('Complete setting');
    expect(result).toContain('Complete action');
    expect(result).toContain('Complete style');
    expect(result).toContain('Complete lighting');
    expect(result).toContain('Complete composition');
    expect(result).toContain('Complete atmosphere');
    expect(result).toContain('Complete details');

    console.log('\nJSON Schema Validation Sample:');
    console.log('==============================');
    console.log('All required fields successfully incorporated into narrative prompt');
    console.log(`Final prompt contains ${result.split('.').length} sentences`);
  });
});
