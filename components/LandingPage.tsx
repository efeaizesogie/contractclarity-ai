
import React, { useEffect, useRef, useState } from 'react';

interface LandingPageProps {
  onCtaClick: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onCtaClick }) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-tight animate-in fade-in slide-in-from-top-4 duration-1000">
            Understand Any Contract <br />
            <span className="text-blue-700">Before You Sign</span>
          </h1>
          <p className="mt-6 text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-top-4 duration-1000 delay-150">
            Upload your contract and get a clear, plain-English explanation in seconds. 
            No legal jargon. No confusion. Just clarity.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-top-4 duration-1000 delay-300">
            <button 
              onClick={onCtaClick}
              className="w-full sm:w-auto px-8 py-4 bg-blue-700 text-white text-lg font-bold rounded-xl hover:bg-blue-800 transition-all shadow-lg shadow-blue-200 active:scale-95"
            >
              Upload a Contract
            </button>
            <button className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 text-lg font-bold rounded-xl border border-slate-200 hover:bg-slate-50 transition-all">
              See How It Works
            </button>
          </div>
          
          <div className="mt-12 flex items-center justify-center space-x-8 text-slate-400 text-sm font-medium animate-in fade-in duration-1000 delay-500">
            <span className="flex items-center"><svg className="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg> No login required</span>
            <span className="flex items-center"><svg className="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg> Privacy-first design</span>
            <span className="flex items-center"><svg className="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg> Built with Gemini 3</span>
          </div>
        </div>
        
        {/* Background blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-0 pointer-events-none opacity-20">
          <div className="absolute top-10 left-10 w-64 h-64 bg-blue-300 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-200 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* How it Works */}
      <section ref={sectionRef} className="bg-white py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-3xl font-bold text-slate-900">How It Works</h2>
            <p className="text-slate-500 mt-2">Get from confusion to clarity in three simple steps.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12">
            <div className={`text-center group transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
              <div className="w-20 h-20 bg-blue-50 text-blue-700 rounded-3xl flex items-center justify-center mx-auto mb-8 text-3xl font-black group-hover:bg-blue-700 group-hover:text-white transition-all transform group-hover:rotate-3 shadow-sm group-hover:shadow-lg group-hover:shadow-blue-200">1</div>
              <h3 className="text-2xl font-bold mb-4">Upload or Paste</h3>
              <p className="text-slate-600 leading-relaxed max-w-xs mx-auto">Simply drop your PDF or paste the text of your agreement into our secure analyzer.</p>
            </div>
            
            <div className={`text-center group transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
              <div className="w-20 h-20 bg-blue-50 text-blue-700 rounded-3xl flex items-center justify-center mx-auto mb-8 text-3xl font-black group-hover:bg-blue-700 group-hover:text-white transition-all transform group-hover:-rotate-3 shadow-sm group-hover:shadow-lg group-hover:shadow-blue-200">2</div>
              <h3 className="text-2xl font-bold mb-4">AI Breakdown</h3>
              <p className="text-slate-600 leading-relaxed max-w-xs mx-auto">Gemini 3 analyzes every clause, detecting boundary lines and hidden risks automatically.</p>
            </div>
            
            <div className={`text-center group transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
              <div className="w-20 h-20 bg-blue-50 text-blue-700 rounded-3xl flex items-center justify-center mx-auto mb-8 text-3xl font-black group-hover:bg-blue-700 group-hover:text-white transition-all transform group-hover:rotate-3 shadow-sm group-hover:shadow-lg group-hover:shadow-blue-200">3</div>
              <h3 className="text-2xl font-bold mb-4">Clear Insights</h3>
              <p className="text-slate-600 leading-relaxed max-w-xs mx-auto">Review a plain-English report with risk alerts, red flags, and a human summary.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="max-w-4xl mx-auto px-4 py-16 bg-slate-900 rounded-3xl text-white text-center shadow-2xl transition-all hover:scale-[1.01] duration-500">
        <h2 className="text-2xl font-bold mb-4">Your Data is Secure</h2>
        <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
          We understand the sensitivity of legal documents. Files are processed in real-time and never stored on our servers. You remain in control of your information.
        </p>
        <div className="flex flex-wrap justify-center gap-8">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">SSL Encrypted</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Auto-Deletion</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Privacy First</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
