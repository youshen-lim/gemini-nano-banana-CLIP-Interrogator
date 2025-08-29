import React, { useState, useCallback } from 'react';
import { generatePromptFromImage, generateImage } from './services/geminiService';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import OptimizedPromptDisplay from './components/OptimizedPromptDisplay';
import ImageDisplay from './components/ImageDisplay';
import ActionButton from './components/ActionButton';
import ErrorDisplay from './components/ErrorDisplay';
import StyleSelector from './components/StyleSelector';

const SettingsIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-1.007 1.11-1.226l.558-.223c.55-.22 1.158.01 1.488.532l.332.521c.33.521.958.746 1.503.536l.542-.216c.542-.217 1.14-.007 1.473.515l.332.521c.33.521.958.746 1.503.536l.542-.216c.542-.217 1.14-.007 1.473.515l.332.521c.33.521.958.746 1.503.536l.542-.216c.542-.217 1.14-.007 1.473.515l.165.259c.33.521.958.746 1.503.536l.542-.216c.542-.217 1.14-.007 1.473.515l.165.259a1.875 1.875 0 01-2.223 2.547l-.558.223a1.875 1.875 0 01-1.503-.536l-.332-.521a1.875 1.875 0 01-1.488-.532l-.558-.223a1.875 1.875 0 01-1.11-1.226c-.09-.542-.56-1.007-1.11-1.226l-.558-.223a1.875 1.875 0 01-1.488.532l-.332.521a1.875 1.875 0 01-1.503.536l-.542.216c-.542.217-1.14.007-1.473-.515l-.165-.259a1.875 1.875 0 012.223-2.547l.558-.223a1.875 1.875 0 011.503.536l.332.521a1.875 1.875 0 011.488.532l.558.223c.55.22 1.158-.01 1.488-.532l.332-.521c.33-.521.958.746 1.503.536l.542-.216c.542-.217 1.14-.007 1.473.515l.332.521c.33.521.958.746 1.503.536l.542-.216c.542-.217 1.14-.007 1.473.515l.165.259c.33.521.958.746 1.503.536l.542-.216c.542-.217 1.14-.007 1.473.515l.165.259a1.875 1.875 0 01-2.223 2.547l-.558.223a1.875 1.875 0 01-1.503-.536l-.332-.521a1.875 1.875 0 01-1.488-.532l-.558-.223a1.875 1.875 0 01-1.11-1.226zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" />
  </svg>
);

const InfoIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.852l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

const artisticStyles = ['Photorealistic', 'Digital Painting', 'Watercolor', 'Anime', 'Cinematic'];

const App: React.FC = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string>(artisticStyles[0]);
  const [optimizedPrompt, setOptimizedPrompt] = useState<string>('');
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string>('');
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [isSettingsAnimating, setIsSettingsAnimating] = useState<boolean>(false);
  const [creativity, setCreativity] = useState<number>(0.8);
  const [negativePrompt, setNegativePrompt] = useState<string>('');

  const handleImageUpload = (base64: string, file: File) => {
    setUploadedImage(base64);
    setImageFile(file);
    setError(null);
    setOptimizedPrompt('');
    setGeneratedImageUrl(null);
  };
  
  const handleImageRemove = () => {
    setUploadedImage(null);
    setImageFile(null);
  };

  const handleAnalyzeImage = useCallback(async () => {
    if (!uploadedImage || isAnalyzing || !apiKey) {
        if (!apiKey) setError("Please enter your API key in the Advanced Settings.");
        return;
    }

    setIsAnalyzing(true);
    setError(null);
    setOptimizedPrompt('');
    setGeneratedImageUrl(null);

    try {
      const result = await generatePromptFromImage(uploadedImage, selectedStyle, apiKey, creativity, negativePrompt);
      setOptimizedPrompt(result);
    } catch (err) {
      setError(err instanceof Error ? `Failed to analyze image: ${err.message}` : 'An unknown error occurred.');
    } finally {
      setIsAnalyzing(false);
    }
  }, [uploadedImage, selectedStyle, isAnalyzing, apiKey, creativity, negativePrompt]);

  const handleGenerateImage = useCallback(async () => {
    if (!optimizedPrompt || isGeneratingImage || !apiKey) {
      if (!apiKey) setError("Please enter your API key in the Advanced Settings.");
      return;
    }

    setIsGeneratingImage(true);
    setError(null);
    setGeneratedImageUrl(null);

    try {
      const imageUrl = await generateImage(optimizedPrompt, apiKey);
      setGeneratedImageUrl(imageUrl);
    } catch (err) {
      setError(err instanceof Error ? `Failed to generate image: ${err.message}` : 'An unknown error occurred.');
    } finally {
      setIsGeneratingImage(false);
    }
  }, [optimizedPrompt, isGeneratingImage, apiKey]);
  
  const handleToggleSettings = () => {
    if (!showSettings) {
      setIsSettingsAnimating(true);
      setTimeout(() => setIsSettingsAnimating(false), 500);
    }
    setShowSettings(!showSettings);
  };

  const isActionDisabled = !apiKey.trim();

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-4xl">
        <Header />

        <main className="mt-8 space-y-8">
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
            {error && <div className="mb-4"><ErrorDisplay message={error} /></div>}
            
            <h2 className="text-xl font-semibold text-[#1974e8] mb-4">1. Upload an Image</h2>
            <ImageUploader 
              onImageUpload={handleImageUpload} 
              onImageRemove={handleImageRemove} 
              onUploadError={setError}
              imageFile={imageFile} 
            />
            
            <div className="mt-6 border-t border-slate-200 pt-6">
                <h2 className="text-xl font-semibold text-[#1974e8] mb-4">2. Choose a Style</h2>
                <StyleSelector styles={artisticStyles} selectedStyle={selectedStyle} onChange={setSelectedStyle} />
            </div>

            <div className="mt-6 border-t border-slate-200 pt-6">
              <h2 className="text-xl font-semibold text-[#1974e8] mb-4">3. Generation Controls</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="creativity-slider" className="block text-sm font-medium text-slate-700 mb-1">
                    Creativity: <span className="font-bold text-[#1974e8]">{creativity.toFixed(1)}</span>
                  </label>
                  <input
                    id="creativity-slider"
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={creativity}
                    onChange={(e) => setCreativity(parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex items-center space-x-1.5 mb-1">
                    <label htmlFor="negative-prompt" className="block text-sm font-medium text-slate-700">
                      Negative Prompt (optional)
                    </label>
                    <span title="Specify concepts to exclude from the generated prompt, e.g., 'blurry, text, watermarks'.">
                        <InfoIcon className="h-4 w-4 text-slate-400 cursor-help" />
                    </span>
                  </div>
                  <input
                    id="negative-prompt"
                    type="text"
                    value={negativePrompt}
                    onChange={(e) => setNegativePrompt(e.target.value)}
                    placeholder="e.g., text, watermarks, blurry"
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-[#1974e8]/50 focus:border-[#1974e8] transition-all duration-300"
                  />
                </div>
              </div>
            </div>

            {(isAnalyzing || optimizedPrompt) && (
              <div className="mt-6 border-t border-slate-200 pt-6 animate-fade-in">
                <h2 className="text-xl font-semibold text-[#1974e8] mb-4">4. Refine &amp; Generate</h2>
                {isAnalyzing ? (
                  <div className="relative">
                    <div className="w-full h-28 p-4 pr-12 bg-slate-100 border border-slate-200 rounded-lg animate-pulse">
                      <div className="h-4 bg-slate-200 rounded w-3/4 mb-3"></div>
                      <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                    </div>
                    <div className="absolute top-3 right-3 p-2 h-9 w-9 bg-slate-200 rounded-md animate-pulse"></div>
                  </div>
                ) : (
                  <OptimizedPromptDisplay prompt={optimizedPrompt} onChange={setOptimizedPrompt} />
                )}
              </div>
            )}
            
            <div className="mt-6 flex flex-col items-end space-y-4">
               {!optimizedPrompt ? (
                 <ActionButton
                   onClick={handleAnalyzeImage}
                   isLoading={isAnalyzing}
                   disabled={!uploadedImage || isAnalyzing || isActionDisabled}
                   text="Analyze Image"
                   loadingText="Analyzing..."
                 />
               ) : (
                 <ActionButton
                   onClick={handleGenerateImage}
                   isLoading={isGeneratingImage}
                   disabled={!optimizedPrompt.trim() || isGeneratingImage || isActionDisabled}
                   text="Generate Image"
                   loadingText="Generating..."
                 />
               )}
                <button 
                  onClick={handleToggleSettings} 
                  className="flex items-center space-x-2 text-sm text-slate-500 hover:text-[#1974e8] transition-colors"
                >
                  <SettingsIcon className="h-4 w-4" />
                  <span>Advanced Settings</span>
                </button>
            </div>
             
            {showSettings && (
              <div className="mt-6 border-t border-slate-200 pt-6 animate-fade-in">
                <h3 className="text-lg font-semibold text-[#1974e8] mb-2">API Key</h3>
                <p className="text-sm text-slate-500 mb-4">Your API key is stored only in your browser for this session.</p>
                <div className="relative w-full">
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your Google Gemini API Key"
                    className="w-full p-2 pr-10 bg-white border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-[#1974e8]/50 focus:border-[#1974e8] transition-all duration-300"
                    aria-label="API Key Input"
                  />
                  {isSettingsAnimating && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="animate-spin h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <ImageDisplay imageUrl={generatedImageUrl} isLoading={isGeneratingImage} />
        </main>
        
        <footer className="text-center mt-12 text-slate-500 text-sm">
            <p>Powered by Google Gemini API</p>
        </footer>
      </div>
    </div>
  );
};

export default App;