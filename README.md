# Reverse Engineer Images to Generate Prompts for Gemini 2.5 Flash Image (aka nano-banana)

Self-hosted CLIP Interrogator application that analyzes images and generates descriptive JSON-format prompts for high-quality image generation using Gemini 2.5 Flash Image (nano-banana) via the Gemini API.

## 🖼️ Application Preview

<div align="center">
  <img src="docs/images/screenshots/hero-interface.png" alt="Gemini nano-banana CLIP Interrogator - Clean, professional interface" width="800"/>
  <p><em>Clean, intuitive interface optimized for professional image analysis workflows</em></p>
</div>

## 🚀 Features

- **Advanced Image Analysis**: Upload images and get detailed, narrative-style prompts optimized for Gemini 2.5 Flash Image
- **Style-Aware Generation**: Choose from multiple artistic styles (Photorealistic, Digital Painting, Watercolor, Anime, Cinematic)
- **Professional Prompt Engineering**: Leverages nano-banana's strengths including high-fidelity text rendering and photorealistic generation
- **Interactive Editing**: Edit and refine generated prompts before image generation
- **Secure API Handling**: Runtime-only API key management with no client-side exposure
- **Robust Error Handling**: Comprehensive error handling for network issues, API limits, and file problems
- **File Validation**: Smart file size limits and format validation (PNG, JPG, WEBP up to 10MB)
- **Cross-Browser Compatibility**: Fallback support for clipboard operations and file handling

## 🔧 Recent Improvements

### Security Enhancements
- ✅ **Fixed critical security vulnerability** - Removed API key injection from client bundle
- ✅ **Verified credential safety** - No hardcoded API keys in codebase
- ✅ **Secure environment handling** - Proper .env file management

### Prompt Optimization for Nano-Banana
- ✅ **Enhanced system instructions** - Leverages Gemini 2.5 Flash Image's specific capabilities
- ✅ **Narrative prompt generation** - Creates descriptive scenes instead of keyword lists
- ✅ **Photography terminology** - Uses professional camera and lighting terminology
- ✅ **Improved JSON schema** - Added atmosphere field and detailed technical specifications

### Error Handling & Reliability
- ✅ **Comprehensive API error handling** - Specific messages for rate limits, invalid keys, network issues
- ✅ **File upload robustness** - Error handling for corrupted files and memory issues
- ✅ **Clipboard API fallbacks** - Support for older browsers
- ✅ **File size validation** - Prevents memory issues and API payload limits

### Testing & Quality Assurance
- ✅ **Comprehensive test suite** - 24 test cases covering components and services
- ✅ **Error scenario testing** - Validates handling of API failures and edge cases
- ✅ **Build verification** - Ensures TypeScript compilation and production readiness

## 📋 Prerequisites

- **Node.js** (version 16 or higher recommended)
- **Google Gemini API Key** - Get yours at [Google AI Studio](https://aistudio.google.com/)

## 🛠️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nano-banana-clip-interrogator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API Key**
   - Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
   ```bash
   GEMINI_API_KEY=your_actual_api_key_here
   ```

4. **Run the application**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   - Navigate to `http://localhost:5173/`

## 🧪 Testing

Run the comprehensive test suite:

```bash
# Run all tests
npm test

# Run tests once (CI mode)
npm run test:run

# Run tests with coverage
npm run test:coverage
```

## 🏗️ Project Structure

```
├── components/           # React components
│   ├── ActionButton.tsx     # Loading button component
│   ├── ErrorDisplay.tsx     # Error message display
│   ├── Header.tsx           # Application header
│   ├── ImageDisplay.tsx     # Generated image display
│   ├── ImageUploader.tsx    # File upload with validation
│   ├── OptimizedPromptDisplay.tsx  # Prompt editing interface
│   └── StyleSelector.tsx    # Style selection component
├── services/            # API and business logic
│   └── geminiService.ts     # Gemini API integration
├── src/test/           # Test suites
│   ├── geminiService.test.ts
│   ├── ImageUploader.test.tsx
│   └── OptimizedPromptDisplay.test.tsx
├── App.tsx             # Main application component
├── index.tsx           # Application entry point
├── vite.config.ts      # Vite configuration
├── vitest.config.ts    # Test configuration
└── package.json        # Dependencies and scripts
```

## 📸 More Screenshots

<details>
<summary>🖼️ View Additional Interface Screenshots</summary>

### Key Features Demonstrated

**Professional Interface Design**
- Clean, minimalist layout focused on functionality
- Intuitive drag-and-drop file upload with visual feedback
- Professional typography and spacing optimized for readability

**Advanced Configuration Options**
- Multiple artistic styles: Photorealistic, Digital Painting, Watercolor, Anime, Cinematic
- Creativity control slider for fine-tuning generation parameters
- Negative prompt support for precise output control
- Secure API key management with runtime-only handling

**Workflow Optimization**
- Step-by-step guided process from image upload to prompt generation
- Real-time editing capabilities for generated prompts
- Copy-to-clipboard functionality for easy prompt sharing
- Comprehensive error handling with user-friendly messages

*Additional screenshots showing the complete workflow will be added as the application evolves.*

</details>

## ☁️ Cloud Infrastructure Compatibility

### Google Cloud Platform
- **✅ Fully Compatible** - Native integration with Google AI services
- **App Engine**: Deploy with minimal configuration
- **Cloud Run**: Containerized deployment ready
- **Firebase Hosting**: Static build deployment supported

### AWS
- **✅ Compatible** - Standard Node.js application
- **Amplify**: Frontend deployment with API proxy
- **EC2/ECS**: Full application deployment
- **S3 + CloudFront**: Static build hosting

### Microsoft Azure
- **✅ Compatible** - Standard web application
- **App Service**: Direct deployment support
- **Static Web Apps**: Frontend hosting with API functions
- **Container Instances**: Containerized deployment

### Deployment Considerations
- **Environment Variables**: Secure API key management required
- **CORS Configuration**: May need adjustment for production domains
- **Build Optimization**: Production builds are optimized and ready
- **Health Checks**: Application includes error handling for monitoring

## 🔒 Security Notes

- API keys are handled at runtime only - never exposed in client bundles
- File uploads are validated for type and size
- All user inputs are sanitized
- HTTPS recommended for production deployments

## 📚 API Reference

The application uses the official [Gemini API](https://ai.google.dev/gemini-api/docs/image-generation) with optimizations for:
- **gemini-2.5-flash**: For prompt analysis and optimization
- **gemini-2.5-flash-image-preview**: For high-quality image generation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Run tests: `npm run test:run`
4. Build: `npm run build`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Powered by Google Gemini API** | **Optimized for Gemini 2.5 Flash Image (nano-banana)**
