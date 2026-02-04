
import React, { useState, useRef } from 'react';
import { analyzeContract } from '../services/geminiService';
import { AnalysisResult } from '../types';

// Declare pdfjsLib for TypeScript
declare var pdfjsLib: any;

interface ContractUploaderProps {
  onAnalysisStart: () => void;
  onAnalysisComplete: (data: AnalysisResult) => void;
}

const ContractUploader: React.FC<ContractUploaderProps> = ({ onAnalysisStart, onAnalysisComplete }) => {
  const [text, setText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize PDF.js worker
  if (typeof window !== 'undefined' && (window as any).pdfjsLib) {
    (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  }

  const extractTextFromPDF = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
      setStatusMessage(`Extracting text from PDF (Page ${i}/${pdf.numPages})...`);
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(' ');
      fullText += pageText + '\n';
    }
    
    return fullText;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsProcessing(true);
    setStatusMessage('Reading file...');

    try {
      if (file.type === 'text/plain') {
        const content = await file.text();
        setText(content);
        setIsProcessing(false);
      } else if (file.type === 'application/pdf') {
        const extractedText = await extractTextFromPDF(file);
        if (!extractedText.trim()) {
          throw new Error('This PDF appears to be an image or contains no readable text. Please try pasting the text instead.');
        }
        setText(extractedText);
        setIsProcessing(false);
      } else {
        throw new Error('Unsupported format. Please upload a .pdf or .txt file.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to read file.');
      setIsProcessing(false);
    }
  };

  const handleAnalyze = async () => {
    const content = text.trim();
    if (!content) {
      setError('Please paste contract text or upload a file first.');
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    onAnalysisStart();
    setStatusMessage('Connecting to Gemini AI...');

    try {
      const result = await analyzeContract(content, (msg) => setStatusMessage(msg));
      if (result) {
        onAnalysisComplete(result);
      } else {
        throw new Error('Analysis failed to return structured data.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred during analysis. The document might be too large or complex for the current session.');
      setIsProcessing(false);
    }
  };

  if (isProcessing) {
    return (
      <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-sm text-center animate-in zoom-in duration-300">
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-blue-700 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <h2 className="text-2xl font-bold mb-4 text-slate-900">Contract Analysis in Progress</h2>
        <div className="space-y-2 max-w-sm mx-auto">
          <p className="text-blue-700 font-medium animate-pulse">{statusMessage}</p>
          <p className="text-slate-400 text-sm">This can take up to 30 seconds for complex documents.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Contract Analyzer</h2>
        <p className="text-slate-500 mt-2">Upload your legal document for a plain-English safety report.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-8 transition-all relative group">
        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setError(null);
          }}
          placeholder="Paste your contract text here or use the upload button..."
          className="w-full h-80 p-6 bg-slate-50 border-none focus:ring-2 focus:ring-blue-500/20 rounded-2xl resize-none text-slate-700 leading-relaxed font-sans text-base transition-all"
        />
        
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <input 
              type="file" 
              ref={fileInputRef}
              className="hidden" 
              accept=".pdf,.txt"
              onChange={handleFileUpload}
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center space-x-2 text-blue-700 font-bold hover:bg-blue-50 px-4 py-2.5 rounded-xl transition-all border border-transparent hover:border-blue-100"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>
              <span>Upload PDF / Text</span>
            </button>
            {text.length > 0 && (
              <button 
                onClick={() => setText('')}
                className="text-slate-400 hover:text-red-500 transition-colors"
                title="Clear content"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
              </button>
            )}
          </div>
          
          <button
            onClick={handleAnalyze}
            disabled={!text.trim()}
            className="w-full sm:w-auto px-10 py-4 bg-blue-700 text-white rounded-2xl font-black text-lg hover:bg-blue-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-xl shadow-blue-100 active:scale-95"
          >
            Analyze Now
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-700 text-sm font-medium flex items-start space-x-3 animate-in shake duration-500">
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/></svg>
          <span>{error}</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-6 opacity-60">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Industry Standard Analysis for:</p>
        <div className="flex flex-wrap justify-center gap-3">
          {['Freelance', 'Employment', 'Rentals', 'NDAs'].map(tag => (
            <span key={tag} className="px-3 py-1 bg-slate-200/50 rounded-full text-[10px] font-bold text-slate-600">{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContractUploader;
