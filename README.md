# Reverse Engineer Images to Generate Prompts for Gemini 2.5 Flash Image (aka nano-banana)

A self hosted React app that turns an image into a text prompt for Gemini image generation. Gemini 3.5 Flash Lite does all the image analysis through the Gemini API. No CLIP model runs. The name comes from the CLIP Interrogator idea of turning an image into a prompt.

Gemini returns structured JSON fields such as subject, setting, lighting and atmosphere. The app joins these fields into one text prompt that you can edit.

## 🖼️ Application Preview

<div align="center">
  <img src="docs/images/screenshots/gemini-nano-banana-CLIP-Interrogator%20Application%20Interface_Aug%2029,%202025.png" alt="Gemini nano-banana CLIP Interrogator application interface" width="800"/>
  <p><em>Application interface, August 29, 2025</em></p>
</div>

## 🚀 Features

- **Image to prompt**: Gemini 3.5 Flash Lite describes the uploaded image in eight fields, and the app joins them into one prompt.
- **Style selection**: Choose from five artistic styles (Photorealistic, Digital Painting, Watercolor, Anime, Cinematic).
- **Prompt instructions for Nano Banana**: The system instruction asks for narrative descriptions, photography terms and explicit text placement. Output quality has not been measured.
- **Interactive Editing**: Edit and refine generated prompts before image generation.
- **API key**: You paste your own Gemini API key into Advanced Settings. See [Security Notes](#-security-notes).
- **Error messages**: The app maps API errors to plain messages for invalid keys, rate limits, network failures, timeouts and blocked prompts.
- **File Validation**: The app checks file type and size (PNG, JPG, WEBP up to 10MB).
- **Clipboard fallback**: Copy to clipboard falls back to an older browser method when the Clipboard API is not available. No browser compatibility testing has been done.

## 🔧 Implementation Notes

### API Key Handling
- The build does not inject an API key into the client bundle. `vite.config.ts` has no `define` entry for a key.
- No API key is hard coded in the source. This was checked with a text search on November 20, 2026.
- `.gitignore` excludes `.env` files. The app does not read them.

### Prompt Design for Nano-Banana
- The system instruction targets Gemini 3.1 Flash Image (Nano Banana 2).
- The prompt is written as a narrative scene, not a keyword list.
- The instruction asks for camera and lighting terms.
- The JSON schema has eight fields, including an atmosphere field.

### Error Handling
- The app matches API error messages to specific messages for rate limits, invalid keys and network issues.
- The uploader handles `FileReader` errors. It does not decode or check image contents.
- Copy to clipboard has a fallback for browsers without the Clipboard API.
- The uploader rejects files over 10MB.

### Testing
- The test suite has 36 tests in 5 files. All 36 passed with mocked Gemini calls on November 20, 2026.
- The tests do not call the live Gemini API.
- `src/test/sample-output.test.ts` logs sample output. It does not grade quality.
- `npm run build` runs `vite build`. It does not run a TypeScript type check. `npx tsc --noEmit` currently reports type errors.

## 📋 Prerequisites

- **Node.js** 18, 20, or 22 or later (required by Vite 6 and Vitest 3)
- **Google Gemini API Key** from [Google AI Studio](https://aistudio.google.com/)

## 🛠️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/youshen-lim/gemini-nano-banana-CLIP-Interrogator.git
   cd gemini-nano-banana-CLIP-Interrogator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the application**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   - Navigate to `http://localhost:5173/`

5. **Enter your API key in the app**
   - Open Advanced Settings and paste your Gemini API key.
   - The app does not read `.env` or `.env.local`.

## 🧪 Testing

Run the test suite:

```bash
# Run all tests
npm test

# Run tests once (CI mode)
npm run test:run

# Run tests with coverage
npm run test:coverage
```

Coverage needs `@vitest/coverage-v8`, which is not in `package.json`. Install it first with `npm install -D @vitest/coverage-v8`.

## 🏗️ Project Structure

```
├── components/           # React components
│   ├── ActionButton.tsx     # Loading button component
│   ├── ErrorDisplay.tsx     # Error message display
│   ├── Header.tsx           # Application header
│   ├── ImageDisplay.tsx     # Generated image display
│   ├── ImageUploader.tsx    # File upload with validation
│   ├── OptimizedPromptDisplay.tsx  # Prompt editing interface
│   ├── PromptInput.tsx      # Prompt input component
│   └── StyleSelector.tsx    # Style selection component
├── services/            # API and business logic
│   └── geminiService.ts     # Gemini API integration
├── src/test/           # Test suites
│   ├── geminiService.test.ts
│   ├── ImageUploader.test.tsx
│   ├── integration.test.ts
│   ├── OptimizedPromptDisplay.test.tsx
│   ├── sample-output.test.ts
│   └── setup.ts
├── App.tsx             # Main application component
├── index.html          # HTML entry page
├── index.tsx           # Application entry point
├── metadata.json       # App metadata
├── vite.config.ts      # Vite configuration
├── vitest.config.ts    # Test configuration
└── package.json        # Dependencies and scripts
```

## 📸 More Screenshots

<details>
<summary>🖼️ View Additional Interface Screenshots</summary>

### Key Features Demonstrated

**Interface**
- Single page layout
- Drag and drop file upload with visual feedback

**Configuration Options**
- Multiple artistic styles: Photorealistic, Digital Painting, Watercolor, Anime, Cinematic
- Creativity slider (sets the Gemini temperature)
- Negative prompt (added to the instructions as concepts to avoid)
- API key entry in Advanced Settings, kept in memory for the current browser tab

**Workflow**
- Step by step process from image upload to prompt generation
- Editing of generated prompts
- Copy to clipboard
- Plain error messages for common API failures


</details>

## ☁️ Deployment

The app has not been deployed to any cloud service. `npm run build` writes a static site to `dist/`. No hosting target has been tested. The repository has no Dockerfile and no cloud configuration. Each user enters their own API key in the browser.

## 🔒 Security Notes

- **API key**: You paste your Gemini API key into Advanced Settings. The app keeps it in memory for the current browser tab and does not save it. The key is not built into the JavaScript bundle. Your browser sends it directly to the Gemini API, so anyone with access to that browser session can see it. Do not host this app publicly with a shared key.
- **File Validation**: File uploads are validated for type and size (PNG, JPG, WEBP up to 10MB).
- **Input checks**: The app checks the image file type and size and the image data format. It does not sanitize text inputs. The negative prompt is sent to Gemini as typed.
- **HTTPS**: Use HTTPS if you host the app.
- **Browser storage**: The app does not write user data or API keys to permanent browser storage.
- **Data sent to Google**: Uploaded images and prompts are sent to the Gemini API. Google's terms apply to that data.
- **Development Logging**: Console statements are wrapped in development only checks.
- **No health check**: The app is a static site with no server and no health check endpoint.

## 📚 API Reference

The application uses the [Gemini API](https://aistudio.google.com/docs/image-generation) with these model IDs in `services/geminiService.ts`:
- **gemini-3.5-flash-lite**: For image analysis and prompt writing
- **gemini-3.1-flash-image**: For image generation

**Model status (checked November 20, 2026):** The app previously used `gemini-2.5-flash-image-preview`, which Google's [deprecations page](https://aistudio.google.com/docs/deprecations) lists as shut down on January 15, 2026, and `gemini-2.5-flash`, which Google lists for shutdown on December 1, 2026. The code now uses `gemini-3.1-flash-image` and `gemini-3.5-flash-lite`. Google's [models page](https://aistudio.google.com/docs/models) labels both as stable. The app still calls both through `generateContent`. Google's image generation examples use the newer Interactions API, and its docs do not state whether `gemini-3.1-flash-image` accepts `generateContent`. The 36 unit tests pass, but they mock the Gemini API. Live image generation with the new models has not been tested.

## ⚠️ Limitations

- No CLIP model runs. Gemini 3.5 Flash Lite does all image analysis.
- The README reports no results on prompt quality, image quality, latency or cost.
- Tests mock the Gemini API. They do not show that live calls work.
- Live calls to `gemini-3.1-flash-image` and `gemini-3.5-flash-lite` have not been tested. If image generation fails, the next step is to move the image call to the Interactions API with `gemini-nano-banana-2.1`, which Google names as the replacement for the old preview model.
- The API key is entered in the browser and sent from the browser to Google. The app has no server to protect it.
- The app has not been deployed to any cloud service.
- `npx tsc --noEmit` reports type errors. The build does not run a type check.
- One error message tells users to stay under 4MB, while the uploader accepts files up to 10MB.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Run tests: `npm run test:run`
4. Build: `npm run build`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License. See the LICENSE file for details.

## 📝 Corrections

The following items were corrected on **November 20, 2026** after a check against the code, tests and Google model documentation. This correction changes documentation only. It does not fix the model ID or TypeScript issues described above.

| Item | Previously stated | Corrected to | Cause |
|------|-------------------|--------------|-------|
| CLIP | Self hosted CLIP Interrogator application | Gemini does all image analysis. No CLIP model runs. | No CLIP code or dependency exists. The name refers to the image to prompt idea. |
| Output | Descriptive JSON format prompts | Text prompt built from JSON fields | `services/geminiService.ts` joins the fields into one string. |
| API key setup | Set `GEMINI_API_KEY` in `.env.local` | Enter the key in Advanced Settings | No code reads `.env.local` or `GEMINI_API_KEY`. |
| Key exposure | No client side exposure | The key is sent from the browser | The browser calls the Gemini API directly. |
| Clone command | `git clone <repository-url>` and `cd nano-banana-clip-interrogator` | Real repository URL and folder name | The README used a placeholder. |
| Test count | 24 test cases | 36 tests in 5 files | Two test files were added after the count was written. |
| Security fix | Fixed critical security vulnerability | The build does not inject a key | The public history does not show the fix. |
| Input sanitization | All user inputs are sanitized | Only file type, size and data format are checked | No sanitizing code exists. |
| Health checks | Application includes error handling for monitoring | Removed | The app is a static site with no health endpoint. |
| Cloud labels | Fully Compatible and Compatible | Not deployed or tested | No deployment configuration exists. |
| Node version | 16 or higher | 18, 20, or 22 or later | Vite 6 and Vitest 3 require Node 18 or later. |
| Build verification | Ensures TypeScript compilation | The build does not type check | `npm run build` runs `vite build` only. |
| Coverage command | Listed with no note | Needs `@vitest/coverage-v8` | The coverage provider is not in `package.json`. |
| Screenshot | `hero-interface.png` | Existing screenshot file | The referenced image never existed in the repository. |
| Model status | Not stated | Preview image model listed as shut down on January 15, 2026 | Google deprecations page. |
| Model IDs | `gemini-2.5-flash` and `gemini-2.5-flash-image-preview` | `gemini-3.5-flash-lite` and `gemini-3.1-flash-image` | The image model was shut down and the text model shuts down on December 1, 2026. Changed in code on November 20, 2026. |

The file type checks, the 10MB limit, the five styles, the model IDs in the code and the development only logging were rechecked and are accurate.

---

**Uses the Google Gemini API** | **Prompts are written for Gemini 3.1 Flash Image (Nano Banana 2)**
