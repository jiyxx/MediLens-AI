import React, { useState, useRef } from 'react';
import FileUpload from './components/FileUpload';
import AnalysisResult from './components/AnalysisResult';
import { FileData, HealthReportAnalysis } from './types';
import { analyzeMedicalReport } from './services/geminiService';
import { ActivityIcon, HeartPulseIcon, InfoIcon, FileTextIcon } from './components/Icons';

const App: React.FC = () => {
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [symptoms, setSymptoms] = useState<string>("");
  const [analysis, setAnalysis] = useState<HealthReportAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const resultsRef = useRef<HTMLDivElement>(null);

  const symptomTags = [
    "Fever", "Fatigue", "Headache", "Nausea", "Stomach Pain", 
    "Cough", "Dizziness", "Skin Rash", "Joint Pain", "High Blood Pressure"
  ];

  const handleAddSymptom = (tag: string) => {
    setSymptoms(prev => {
      if (prev.includes(tag)) return prev;
      return prev ? `${prev}, ${tag}` : tag;
    });
  };

  const handleFileSelect = (data: FileData) => {
    setFileData(data);
    setAnalysis(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    // Allow analysis if either file exists OR symptoms are provided
    if (!fileData && !symptoms.trim()) {
      setError("Please upload a medical report OR describe your symptoms to proceed.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Pass null for file data if not present
      const base64 = fileData ? fileData.base64 : null;
      const mimeType = fileData ? fileData.mimeType : null;

      const result = await analyzeMedicalReport(base64, mimeType, symptoms);
      
      // Strict confidence check only if a file was uploaded
      if (fileData && result.confidenceScore !== undefined && result.confidenceScore < 30) {
        throw new Error("Could not reliably parse the report. The image might be blurry or not a recognized medical document. Please upload a clearer PDF or the original lab printout.");
      }

      setAnalysis(result);
      
      // Smooth scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to analyze. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 text-slate-900 font-sans">
      
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-80 bg-white border-r border-slate-200 p-8 fixed h-full z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="flex items-center space-x-3 mb-10 text-teal-600">
          <div className="bg-teal-50 p-2 rounded-xl">
             <HeartPulseIcon className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">MediLens AI</h1>
        </div>
        
        <div className="space-y-8 flex-1">
          <div>
            <h2 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-4">About the App</h2>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              MediLens AI transforms complex medical reports into clear, actionable insights. Upload any lab report or enter symptoms to get started.
            </p>
          </div>

          <div>
            <h2 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-4">How it works</h2>
            <div className="space-y-4">
              <div className="flex gap-4 group">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-50 text-slate-500 group-hover:bg-teal-50 group-hover:text-teal-600 flex items-center justify-center font-bold text-sm border border-slate-100 transition-colors">1</span>
                <p className="text-sm text-slate-600 pt-1.5">Upload document OR enter symptoms</p>
              </div>
              <div className="flex gap-4 group">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-50 text-slate-500 group-hover:bg-teal-50 group-hover:text-teal-600 flex items-center justify-center font-bold text-sm border border-slate-100 transition-colors">2</span>
                <p className="text-sm text-slate-600 pt-1.5">AI analyzes data & clinical context</p>
              </div>
              <div className="flex gap-4 group">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-50 text-slate-500 group-hover:bg-teal-50 group-hover:text-teal-600 flex items-center justify-center font-bold text-sm border border-slate-100 transition-colors">3</span>
                <p className="text-sm text-slate-600 pt-1.5">Get explanations & advice</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-auto pt-6 border-t border-slate-100">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
             <ActivityIcon className="w-3 h-3" />
             <span>Powered by Gemini 3 Pro</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Strictly for educational use only.</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-80">
        
        {/* Mobile Header */}
        <header className="md:hidden bg-white/80 backdrop-blur-md border-b border-slate-200 p-4 sticky top-0 z-20 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-teal-600">
            <HeartPulseIcon className="w-6 h-6" />
            <h1 className="text-lg font-bold text-slate-800">MediLens AI</h1>
          </div>
        </header>

        <div className="max-w-5xl mx-auto p-4 md:p-10 lg:p-12">
          
          <div className="mb-10 animate-fadeIn">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3 tracking-tight">Your Health, Decoded.</h2>
            <p className="text-slate-500 text-lg md:max-w-2xl">
              Advanced AI analysis for your medical reports and symptoms. Simple, private, and insightful.
            </p>
          </div>

          {/* Unified Input Card */}
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden mb-10 transition-all duration-300 hover:shadow-2xl hover:shadow-slate-200/50">
            
            <div className="bg-gradient-to-r from-teal-600 to-emerald-500 p-6 text-white">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <FileTextIcon className="w-6 h-6 text-teal-100" />
                New Analysis
              </h3>
              <p className="text-teal-50 text-sm mt-1 opacity-90">Upload a report, describe your symptoms, or do both for the most accurate interpretation.</p>
            </div>

            <div className="p-8">
              <div className="grid lg:grid-cols-2 gap-8 lg:divide-x lg:divide-slate-100">
                
                {/* Left Column: Upload */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider">
                      1. Upload Document
                    </label>
                    {fileData && (
                      <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                        Ready to analyze
                      </span>
                    )}
                  </div>
                  
                  <FileUpload onFileSelect={handleFileSelect} disabled={loading} />
                  
                  {/* Compact Preview */}
                  {fileData && (
                    <div className="flex items-center p-3 bg-slate-50 rounded-xl border border-slate-200 animate-fadeIn">
                      <div className="h-12 w-12 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 shadow-sm overflow-hidden">
                        {fileData.previewUrl ? <img src={fileData.previewUrl} className="h-full w-full object-cover" alt="Preview"/> : <ActivityIcon className="w-6 h-6"/>}
                      </div>
                      <div className="ml-3 overflow-hidden flex-1">
                        <p className="text-sm font-bold text-slate-800 truncate">{fileData.file.name}</p>
                        <p className="text-xs text-slate-500 font-medium">{(fileData.file.size / 1024 / 1024).toFixed(2)} MB • {fileData.mimeType.split('/')[1].toUpperCase()}</p>
                      </div>
                      <button 
                        onClick={() => setFileData(null)}
                        className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                        title="Remove file"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                      </button>
                    </div>
                  )}
                </div>

                {/* Right Column: Symptoms */}
                <div className="space-y-4 flex flex-col lg:pl-8">
                  <div className="flex items-center gap-2">
                    <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider">
                      2. Clinical Context & Symptoms
                    </label>
                    <div className="group relative">
                      <InfoIcon className="w-4 h-4 text-slate-400 cursor-help" />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                        Describe your symptoms to get a diagnosis suggestion or to help correlate lab values.
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 relative group">
                    <textarea
                      value={symptoms}
                      onChange={(e) => setSymptoms(e.target.value)}
                      placeholder="Describe how you feel (e.g., 'Severe headache, sensitivity to light, and nausea for 2 days')..."
                      className="w-full h-full min-h-[120px] p-4 rounded-xl border-2 border-slate-200 bg-slate-50/50 focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none text-slate-700 placeholder:text-slate-400 transition-all resize-none text-sm leading-relaxed"
                      disabled={loading}
                    />
                    <div className="absolute bottom-3 right-3 pointer-events-none">
                      <ActivityIcon className="w-5 h-5 text-slate-200 group-focus-within:text-teal-100 transition-colors" />
                    </div>
                  </div>

                  {/* Quick Add Tags */}
                  <div>
                    <p className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">Quick Add</p>
                    <div className="flex flex-wrap gap-2">
                      {symptomTags.map(tag => (
                        <button
                          key={tag}
                          onClick={() => handleAddSymptom(tag)}
                          disabled={loading}
                          className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 hover:bg-teal-50 hover:text-teal-600 hover:border-teal-200 border border-transparent transition-all active:scale-95"
                        >
                          + {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Action Footer */}
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-center">
              <button 
                onClick={handleAnalyze}
                disabled={loading || (!fileData && !symptoms.trim())}
                className={`
                  w-full md:w-auto md:min-w-[300px] py-4 px-8 rounded-xl font-bold text-lg text-white shadow-lg transition-all duration-300 transform
                  flex items-center justify-center space-x-3
                  ${loading || (!fileData && !symptoms.trim())
                    ? 'bg-slate-300 cursor-not-allowed shadow-none grayscale' 
                    : 'bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 hover:shadow-teal-500/30 hover:-translate-y-0.5 active:translate-y-0'
                  }
                `}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <ActivityIcon className="w-6 h-6" />
                    <span>
                      {fileData ? "Analyze Report" : "Check Symptoms"}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-10 animate-fadeIn flex items-start gap-4 shadow-sm">
              <div className="bg-red-100 p-2.5 rounded-full text-red-600 mt-0.5">
                 <InfoIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-red-900">Unable to Complete Analysis</h3>
                <p className="text-red-700 mt-1 text-sm leading-relaxed">{error}</p>
              </div>
            </div>
          )}

          {/* Results Area */}
          <div ref={resultsRef}>
            {analysis && (
              <AnalysisResult data={analysis} />
            )}
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;