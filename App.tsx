
import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import ContractUploader from './components/ContractUploader';
import AnalysisResultView from './components/AnalysisResultView';
import { AnalysisResult } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'upload' | 'result'>('landing');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleStartAnalysis = () => setView('upload');
  
  const handleAnalysisComplete = (data: AnalysisResult) => {
    setAnalysis(data);
    setIsLoading(false);
    setView('result');
  };

  const handleBackToStart = () => {
    setAnalysis(null);
    setView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavToSection = (sectionId: string) => {
    if (view !== 'landing') {
      setView('landing');
      // Wait for the view transition to finish before scrolling
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <button onClick={handleBackToStart} className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">ContractClarity AI</span>
            </button>
            <div className="hidden md:flex space-x-6 items-center">
              <button 
                onClick={() => handleNavToSection('how-it-works')}
                className="text-slate-600 hover:text-blue-700 font-medium transition-colors"
              >
                How it works
              </button>
              <button 
                onClick={() => handleNavToSection('safety')}
                className="text-slate-600 hover:text-blue-700 font-medium transition-colors"
              >
                Safety
              </button>
              <button 
                onClick={handleStartAnalysis} 
                className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium ml-2"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main>
        {view === 'landing' && (
          <LandingPage onCtaClick={handleStartAnalysis} />
        )}
        
        {view === 'upload' && (
          <div className="max-w-3xl mx-auto px-4 py-12">
            <ContractUploader 
              onAnalysisStart={() => setIsLoading(true)}
              onAnalysisComplete={handleAnalysisComplete} 
            />
          </div>
        )}

        {view === 'result' && analysis && (
          <AnalysisResultView 
            data={analysis} 
            onRestart={() => setView('upload')}
          />
        )}
      </main>

      <footer className="bg-slate-100 border-t border-slate-200 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm">
            © 2024 ContractClarity AI. Not legal advice. Use for informational purposes only.
          </p>
          <div className="mt-4 flex justify-center space-x-4 text-xs text-slate-400">
            <a href="#" onClick={(e) => { e.preventDefault(); handleNavToSection('safety'); }} className="hover:text-slate-600">Privacy Policy</a>
            <a href="#" className="hover:text-slate-600">Terms of Service</a>
            <a href="#" className="hover:text-slate-600">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
