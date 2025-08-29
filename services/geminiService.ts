import { GoogleGenAI, Type } from "@google/genai";

const PROMPT_OPTIMIZER_MODEL = 'gemini-2.5-flash';
const IMAGE_GENERATION_MODEL = 'gemini-2.5-flash-image-preview';

const OPTIMIZER_SYSTEM_INSTRUCTION = `You are an expert visual analyst and prompt engineer specifically for Gemini 2.5 Flash Image (nano-banana). Your task is to analyze an uploaded image and create optimized prompts that leverage nano-banana's unique strengths:

1. NARRATIVE DESCRIPTIONS: Describe scenes, don't just list keywords. Use descriptive paragraphs that tell a story.
2. PHOTOREALISTIC EXCELLENCE: For realistic images, use photography terminology (camera angles, lens types, lighting setups, technical details).
3. HIGH-FIDELITY TEXT RENDERING: When text is involved, be explicit about font styles, placement, and integration.
4. DETAILED SCENE COMPOSITION: Include specific details about foreground, background, lighting conditions, and atmospheric elements.
5. STYLE CONSISTENCY: Ensure all elements work cohesively within the chosen artistic style.

Analyze the uploaded image thoroughly and populate the JSON schema with rich, descriptive content that will produce high-quality, coherent images when used with Gemini 2.5 Flash Image.`;

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        subject: {
            type: Type.STRING,
            description: "The main subject described narratively with rich detail, e.g., 'a weathered elderly craftsman with calloused hands and gentle eyes', 'a sleek modern building with glass facades reflecting the sky'."
        },
        setting: {
            type: Type.STRING,
            description: "The environment described as a complete scene with atmospheric details, e.g., 'in a sun-drenched workshop filled with the scent of wood shavings and golden dust motes dancing in the air', 'against a backdrop of towering mountains shrouded in morning mist'."
        },
        action: {
            type: Type.STRING,
            description: "What's happening in the scene described with movement and emotion, e.g., 'carefully examining a delicate piece with focused concentration', 'standing confidently with arms crossed, surveying the landscape'."
        },
        style: {
            type: Type.STRING,
            description: "The artistic approach with specific technical details, e.g., 'photorealistic with studio-quality lighting and sharp focus', 'impressionistic watercolor with soft, flowing brushstrokes and vibrant color bleeding'."
        },
        lighting: {
            type: Type.STRING,
            description: "Detailed lighting setup using photography terminology, e.g., 'soft, diffused natural light from a large window creating gentle shadows', 'dramatic three-point studio lighting with rim lighting to separate the subject from background'."
        },
        composition: {
            type: Type.STRING,
            description: "Camera angle and framing described with technical precision, e.g., 'medium shot captured with an 85mm lens creating natural perspective and shallow depth of field', 'wide-angle establishing shot from a low angle to emphasize grandeur'."
        },
        atmosphere: {
            type: Type.STRING,
            description: "The mood and feeling of the scene, e.g., 'serene and contemplative with a sense of timeless craftsmanship', 'dynamic and energetic with vibrant colors and movement'."
        },
        details: {
            type: Type.STRING,
            description: "Specific visual elements that enhance realism and quality, e.g., 'fine texture details in fabric and skin, subtle color variations, professional color grading', 'intricate architectural details, realistic material properties, high-resolution clarity'."
        },
    },
    required: ["subject", "setting", "style", "details", "action", "lighting", "composition", "atmosphere"]
};


export async function generatePromptFromImage(
  imageData: string, 
  style: string, 
  apiKey: string, 
  creativity: number,
  negativePrompt: string
): Promise<string> {
  if (!apiKey) {
    throw new Error("API key is missing.");
  }
  const ai = new GoogleGenAI({ apiKey });

  const match = imageData.match(/^data:(image\/\w+);base64,(.*)$/);
  if (!match) {
      throw new Error("Invalid image data format.");
  }
  const [, mimeType, base64Data] = match;

  const imagePart = {
      inlineData: {
          mimeType,
          data: base64Data,
      },
  };
  
  let analysisText = `Analyze this image with the precision of a professional photographer and art director. Create a comprehensive scene description optimized for Gemini 2.5 Flash Image generation.

Focus on:
- NARRATIVE DESCRIPTION: Tell the story of what you see, don't just list elements
- PHOTOGRAPHIC DETAILS: Include camera angles, lighting setups, and technical specifications
- ATMOSPHERIC ELEMENTS: Describe the mood, feeling, and environmental conditions
- STYLE CONSISTENCY: Ensure all elements align with the "${style}" aesthetic
- COMPOSITIONAL ELEMENTS: Detail the framing, perspective, and visual hierarchy

Fill out all JSON schema fields with rich, descriptive content that will produce a high-quality, coherent image when used with Gemini 2.5 Flash Image. Each field should contain complete, descriptive sentences rather than keyword lists.`;

  if (negativePrompt && negativePrompt.trim() !== '') {
    analysisText += `

IMPORTANT: Avoid including these concepts or elements in your description: "${negativePrompt}". Instead, focus on positive descriptions of what should be present.`;
  }
  const textPart = {
      text: analysisText,
  };

  try {
    const response = await ai.models.generateContent({
      model: PROMPT_OPTIMIZER_MODEL,
      contents: { parts: [imagePart, textPart] },
      config: {
        systemInstruction: OPTIMIZER_SYSTEM_INSTRUCTION,
        temperature: creativity,
        topP: 0.95,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      }
    });

    const jsonText = response.text?.trim();
    if (!jsonText) {
        throw new Error("The model returned an empty response.");
    }

    const sceneData = JSON.parse(jsonText);
    
    const getLightingDefault = (selectedStyle: string): string => {
        switch (selectedStyle) {
            case 'Cinematic':
                return 'dramatic three-point lighting setup with strong key light, subtle fill light, and rim lighting for depth and separation';
            case 'Photorealistic':
                return 'natural, soft window light with gentle shadows, creating realistic skin tones and material textures';
            case 'Watercolor':
                return 'soft, diffused ambient lighting that enhances the translucent quality of watercolor pigments';
            case 'Anime':
                return 'vibrant, high-contrast cel-shaded lighting with clean shadow edges and bright highlights';
            case 'Digital Painting':
                return 'rich, painterly lighting with visible brush stroke textures and artistic color temperature variations';
            default:
                return 'balanced, professional lighting that enhances the subject and mood';
        }
    };

    const getAtmosphereDefault = (selectedStyle: string): string => {
        switch (selectedStyle) {
            case 'Cinematic':
                return 'dramatic and emotionally engaging with a sense of narrative tension and visual storytelling';
            case 'Photorealistic':
                return 'authentic and lifelike with natural, believable environmental conditions';
            case 'Watercolor':
                return 'soft and dreamy with an ethereal, flowing quality that evokes gentle emotions';
            case 'Anime':
                return 'vibrant and energetic with bold colors and dynamic visual impact';
            case 'Digital Painting':
                return 'artistic and expressive with rich textures and painterly aesthetic appeal';
            default:
                return 'harmonious and visually appealing with appropriate mood for the subject';
        }
    };
    
    const defaults = {
        subject: "A carefully composed scene with rich visual detail",
        action: "captured in a moment of natural, engaging activity",
        setting: "set in an atmospheric environment that complements the subject",
        style: style,
        lighting: getLightingDefault(style),
        composition: "professionally framed with balanced composition and appropriate depth of field",
        atmosphere: getAtmosphereDefault(style),
        details: "rendered with high-fidelity detail, realistic textures, and professional color grading"
    };

    const finalSceneData = {
        subject: sceneData.subject?.trim() || defaults.subject,
        setting: sceneData.setting?.trim() || defaults.setting,
        action: sceneData.action?.trim() || defaults.action,
        style: sceneData.style?.trim() || defaults.style,
        lighting: sceneData.lighting?.trim() || defaults.lighting,
        composition: sceneData.composition?.trim() || defaults.composition,
        atmosphere: sceneData.atmosphere?.trim() || defaults.atmosphere,
        details: sceneData.details?.trim() || defaults.details,
    };

    // Create a narrative-style prompt optimized for Gemini 2.5 Flash Image
    const optimizedPrompt = `${finalSceneData.subject} ${finalSceneData.action}, ${finalSceneData.setting}. ${finalSceneData.atmosphere}. The scene is rendered in ${finalSceneData.style} with ${finalSceneData.lighting}. ${finalSceneData.composition}. ${finalSceneData.details}.`;

    if (!optimizedPrompt) {
        throw new Error("The generated scene description was empty.");
    }

    return optimizedPrompt;
  } catch (error) {
    console.error("Error analyzing image:", error);

    // Handle specific error types with user-friendly messages
    if (error instanceof SyntaxError) {
        throw new Error("The AI model returned an invalid response format. Please try again.");
    }

    // Handle network and API errors
    if (error instanceof Error) {
        const errorMessage = error.message.toLowerCase();

        if (errorMessage.includes('api key') || errorMessage.includes('unauthorized') || errorMessage.includes('403')) {
            throw new Error("Invalid API key. Please check your Gemini API key in Advanced Settings.");
        }

        if (errorMessage.includes('quota') || errorMessage.includes('rate limit') || errorMessage.includes('429')) {
            throw new Error("API rate limit exceeded. Please wait a moment and try again.");
        }

        if (errorMessage.includes('network') || errorMessage.includes('fetch') || errorMessage.includes('connection')) {
            throw new Error("Network error. Please check your internet connection and try again.");
        }

        if (errorMessage.includes('timeout')) {
            throw new Error("Request timed out. The image analysis is taking too long. Please try with a smaller image.");
        }

        if (errorMessage.includes('image') && errorMessage.includes('size')) {
            throw new Error("Image is too large. Please try with a smaller image (under 4MB).");
        }

        // Return the original error message if it's already user-friendly
        if (error.message.length < 200 && !error.message.includes('stack') && !error.message.includes('TypeError')) {
            throw error;
        }
    }

    throw new Error("Failed to analyze the image. Please try again or contact support if the problem persists.");
  }
}

export async function generateImage(prompt: string, apiKey: string): Promise<string> {
  if (!apiKey) {
    throw new Error("API key is missing.");
  }
  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
        model: IMAGE_GENERATION_MODEL,
        contents: [prompt],
    });

    // Extract image data from the response
    const imageParts = response.candidates?.[0]?.content?.parts?.filter(part => part.inlineData);

    if (!imageParts || imageParts.length === 0) {
        throw new Error("The model did not return any images.");
    }

    const base64ImageBytes = imageParts[0].inlineData?.data;
    if (!base64ImageBytes) {
        throw new Error("Invalid image data received from the model.");
    }

    return `data:image/png;base64,${base64ImageBytes}`;
  } catch (error) {
    console.error("Error generating image:", error);

    // Handle specific error types with user-friendly messages
    if (error instanceof Error) {
        const errorMessage = error.message.toLowerCase();

        if (errorMessage.includes('api key') || errorMessage.includes('unauthorized') || errorMessage.includes('403')) {
            throw new Error("Invalid API key. Please check your Gemini API key in Advanced Settings.");
        }

        if (errorMessage.includes('quota') || errorMessage.includes('rate limit') || errorMessage.includes('429')) {
            throw new Error("API rate limit exceeded. Please wait a moment and try again.");
        }

        if (errorMessage.includes('network') || errorMessage.includes('fetch') || errorMessage.includes('connection')) {
            throw new Error("Network error. Please check your internet connection and try again.");
        }

        if (errorMessage.includes('timeout')) {
            throw new Error("Request timed out. Image generation is taking too long. Please try again.");
        }

        if (errorMessage.includes('content policy') || errorMessage.includes('safety') || errorMessage.includes('blocked')) {
            throw new Error("The prompt was blocked by content policy. Please try a different description.");
        }

        if (errorMessage.includes('prompt') && errorMessage.includes('too long')) {
            throw new Error("The prompt is too long. Please try a shorter description.");
        }

        // Return the original error message if it's already user-friendly
        if (error.message.length < 200 && !error.message.includes('stack') && !error.message.includes('TypeError')) {
            throw error;
        }
    }

    throw new Error("Failed to generate the image. Please try again or contact support if the problem persists.");
  }
}