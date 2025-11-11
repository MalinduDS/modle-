
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ControlPanel } from './components/ControlPanel';
import { ResultDisplay } from './components/ResultDisplay';
import { generateStyledImage } from './services/geminiService';
import { ExportOption, VirtualModel, LightingState } from './types';

const virtualModels: VirtualModel[] = [
  { id: 'arab-1', name: 'Layla', description: 'An elegant Arab model in her early twenties with striking features, exuding luxury and sophistication.', thumbnail: 'https://i.pravatar.cc/150?u=layla' },
  { id: 'arab-2', name: 'Amira', description: 'A poised Arab model, around 22 years old, with a serene and high-fashion look.', thumbnail: 'https://i.pravatar.cc/150?u=amira' },
  { id: 'arab-3', name: 'Nora', description: 'A chic Arab model, age 21, with a modern and glamorous appeal, perfect for haute couture.', thumbnail: 'https://i.pravatar.cc/150?u=nora' },
  { id: 'arab-4', name: 'Salma', description: 'A graceful Arab model, age 23, with expressive eyes and an aura of timeless elegance.', thumbnail: 'https://i.pravatar.cc/150?u=salma' },
  { id: 'arab-5', name: 'Yasmin', description: 'A sophisticated Arab model, around 20 years old, embodying effortless luxury and style.', thumbnail: 'https://i.pravatar.cc/150?u=yasmin' },
  { id: 'arab-6', name: 'Fatima', description: 'An alluring Arab model, age 22, with a confident presence suitable for luxury brand campaigns.', thumbnail: 'https://i.pravatar.cc/150?u=fatima' },
  { id: 'euro-1', name: 'Chloé', description: 'A sophisticated European model, age 22, with classic features and a timeless elegance suitable for high fashion.', thumbnail: 'https://i.pravatar.cc/150?u=chloe' },
  { id: 'euro-2', name: 'Isabella', description: 'A chic European model, age 21, with an edgy, modern look perfect for contemporary luxury brands.', thumbnail: 'https://i.pravatar.cc/150?u=isabella' },
  { id: 'euro-3', name: 'Sofia', description: 'A graceful European model, around 23, with a soft, romantic appeal ideal for bridal and couture collections.', thumbnail: 'https://i.pravatar.cc/150?u=sofia' },
  { id: 'arab-7', name: 'Aisha', description: 'A young Arab woman, aged 21, with a sophisticated aura, perfect for luxury evening wear.', thumbnail: 'https://i.pravatar.cc/150?u=aisha' },
  { id: 'arab-8', name: 'Zahra', description: 'An Arab model with a modern edge, aged 22, ideal for showcasing contemporary luxury and street style.', thumbnail: 'https://i.pravatar.cc/150?u=zahra' },
  { id: 'arab-9', name: 'Dalia', description: 'A captivating Arab model, age 20, with a bold look that suits avant-garde and high-fashion pieces.', thumbnail: 'https://i.pravatar.cc/150?u=dalia' },
];


function App() {
  const [scenePrompt, setScenePrompt] = useState<string>('in a chic Parisian apartment with herringbone floors, ornate wall moldings, and soft, natural light from a large window.');
  const [selectedModelId, setSelectedModelId] = useState<string>(virtualModels[0].id);
  const [uploadedImage, setUploadedImage] = useState<{ file: File; preview: string } | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const initialLightingState: LightingState = { brightness: 0, contrast: 0, warmth: 0 };
  const [lighting, setLighting] = useState<LightingState>(initialLightingState);
  const [lightingHistory, setLightingHistory] = useState<LightingState[]>([initialLightingState]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < lightingHistory.length - 1;

  const handleLightingChange = useCallback((newValues: Partial<LightingState>) => {
    setLighting(prev => ({ ...prev, ...newValues }));
  }, []);

  const commitLightingChange = useCallback(() => {
    // Only add to history if it's a new state from the current point in history
    if (JSON.stringify(lighting) !== JSON.stringify(lightingHistory[historyIndex])) {
      const newHistory = lightingHistory.slice(0, historyIndex + 1);
      setLightingHistory([...newHistory, lighting]);
      setHistoryIndex(newHistory.length);
    }
  }, [lighting, lightingHistory, historyIndex]);
  
  const handleUndo = useCallback(() => {
    if (canUndo) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setLighting(lightingHistory[newIndex]);
    }
  }, [canUndo, historyIndex, lightingHistory]);

  const handleRedo = useCallback(() => {
    if (canRedo) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setLighting(lightingHistory[newIndex]);
    }
  }, [canRedo, historyIndex, lightingHistory]);


  const handleGenerate = useCallback(async () => {
    const selectedModel = virtualModels.find(m => m.id === selectedModelId);
    
    const { brightness, contrast, warmth } = lighting;

    let lightingPrompt = '';
    if (brightness > 20) lightingPrompt += ', bright lighting';
    else if (brightness < -20) lightingPrompt += ', dim, moody lighting';
    if (contrast > 20) lightingPrompt += ', high contrast, sharp details';
    else if (contrast < -20) lightingPrompt += ', low contrast, soft focus';
    if (warmth > 20) lightingPrompt += ', warm tones, golden hour style';
    else if (warmth < -20) lightingPrompt += ', cool tones, blueish tint';

    // Combine model, scene, and lighting for the final prompt
    const finalPrompt = selectedModel 
      ? `${selectedModel.description}, wearing this, ${scenePrompt}${lightingPrompt}`
      : `A professional photo of this clothing item, ${scenePrompt}${lightingPrompt}`;

    if (!uploadedImage || !finalPrompt) {
      setError('Please upload an image and provide a prompt.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(uploadedImage.file);
      reader.onloadend = async () => {
        const base64String = (reader.result as string).split(',')[1];
        if (!base64String) {
            setError('Could not read the uploaded image.');
            setIsLoading(false);
            return;
        }
        const newImageBase64 = await generateStyledImage(base64String, uploadedImage.file.type, finalPrompt);
        setGeneratedImage(`data:image/png;base64,${newImageBase64}`);
      };
      reader.onerror = () => {
        setError('Error reading file.');
        setIsLoading(false);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
        // Delay setting loading to false to allow image to render if successful
        setTimeout(() => setIsLoading(false), 500);
    }
  }, [uploadedImage, scenePrompt, selectedModelId, lighting]);
  
  const handleImageUpload = (file: File, preview: string) => {
    setUploadedImage({ file, preview });
    setGeneratedImage(null); // Clear previous result on new upload
    setError(null);
  };

  const exportOptions: ExportOption[] = [
    { name: 'Instagram Post (1:1)', width: 1080, height: 1080 },
    { name: 'Instagram Story (9:16)', width: 1080, height: 1920 },
    { name: 'Shopify Square (1:1)', width: 2048, height: 2048 },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col font-sans">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ControlPanel
          scenePrompt={scenePrompt}
          setScenePrompt={setScenePrompt}
          onImageUpload={handleImageUpload}
          onGenerate={handleGenerate}
          isLoading={isLoading}
          uploadedImagePreview={uploadedImage?.preview || null}
          virtualModels={virtualModels}
          selectedModelId={selectedModelId}
          setSelectedModelId={setSelectedModelId}
          lighting={lighting}
          onLightingChange={handleLightingChange}
          onLightingCommit={commitLightingChange}
          onUndo={handleUndo}
          onRedo={handleRedo}
          canUndo={canUndo}
          canRedo={canRedo}
        />
        <ResultDisplay
          generatedImage={generatedImage}
          isLoading={isLoading}
          error={error}
          exportOptions={exportOptions}
        />
      </main>
      <footer className="text-center p-4 text-gray-500 text-sm">
        <p>Powered by Gemini. Create professional product photos in seconds.</p>
      </footer>
    </div>
  );
}

export default App;
