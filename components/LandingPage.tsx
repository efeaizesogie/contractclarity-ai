
import React, { useEffect, useRef, useState } from 'react';

interface LandingPageProps {
  onCtaClick: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onCtaClick }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
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
      window.removeEventListener('scroll', handleScroll);
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
          <div 
            style={{ transform: `translateY(${scrollY * 0.1}px)` }}
            className="transition-transform duration-75 ease-out"
          >
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-tight animate-in fade-in slide-in-from-top-4 duration-1000">
              Understand Any Contract <br />
              <span className="text-blue-700">Before You Sign</span>
            </h1>
            <p className="mt-6 text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-top-4 duration-1000 delay-150">
              Upload your contract and get a clear, plain-English explanation in seconds. 
              No legal jargon. No confusion. Just clarity.
            </p>
          </div>
          
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-top-4 duration-1000 delay-300">
            <button 
              onClick={onCtaClick}
              className="w-full sm:w-auto px-8 py-4 bg-blue-700 text-white text-lg font-bold rounded-xl hover:bg-blue-800 transition-all shadow-lg shadow-blue-200 active:scale-95"
            >
              Upload a Contract
            </button>
            <button 
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 text-lg font-bold rounded-xl border border-slate-200 hover:bg-slate-50 transition-all"
            >
              See How It Works
            </button>
          </div>
          
          <div className="mt-12 flex items-center justify-center space-x-8 text-slate-400 text-sm font-medium animate-in fade-in duration-1000 delay-500">
            <span className="flex items-center"><svg className="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg> No login required</span>
            <span className="flex items-center"><svg className="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg> Privacy-first design</span>
            <span className="flex items-center"><svg className="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg> Built with Gemini 3</span>
          </div>
        </div>
        
        {/* Background blobs with Parallax */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-0 pointer-events-none opacity-20">
          <div 
            style={{ transform: `translate(${-scrollY * 0.2}px, ${scrollY * 0.15}px)` }}
            className="absolute top-10 left-10 w-64 h-64 bg-blue-300 rounded-full blur-3xl transition-transform duration-75 ease-out"
          ></div>
          <div 
            style={{ transform: `translate(${scrollY * 0.15}px, ${-scrollY * 0.1}px)` }}
            className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-200 rounded-full blur-3xl transition-transform duration-75 ease-out"
          ></div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" ref={sectionRef} className="bg-white py-24 overflow-hidden scroll-mt-20 relative">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-3xl font-bold text-slate-900">How It Works</h2>
            <p className="text-slate-500 mt-2">Get from confusion to clarity in three simple steps.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12">
            {[1, 2, 3].map((step, idx) => {
              const titles = ["Upload or Paste", "AI Breakdown", "Clear Insights"];
              const descs = [
                "Simply drop your PDF or paste the text of your agreement into our secure analyzer.",
                "Gemini 3 analyzes every clause, detecting boundary lines and hidden risks automatically.",
                "Review a plain-English report with risk alerts, red flags, and a human summary."
              ];
              const rotate = idx % 2 === 0 ? "group-hover:rotate-3" : "group-hover:-rotate-3";
              
              return (
                <div 
                  key={step}
                  className={`text-center group transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                  style={{ transitionDelay: `${300 + idx * 200}ms` }}
                >
                  <div className={`w-20 h-20 bg-blue-50 text-blue-700 rounded-3xl flex items-center justify-center mx-auto mb-8 text-3xl font-black group-hover:bg-blue-700 group-hover:text-white transition-all transform ${rotate} shadow-sm group-hover:shadow-lg group-hover:shadow-blue-200`}>
                    {step}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{titles[idx]}</h3>
                  <p className="text-slate-600 leading-relaxed max-w-xs mx-auto">{descs[idx]}</p>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Parallax elements in How It Works background */}
        <div className="absolute inset-0 pointer-events-none opacity-5">
           <div 
            style={{ transform: `translateY(${(scrollY - 800) * 0.1}px)` }}
            className="absolute top-1/4 right-0 w-80 h-80 bg-blue-400 rounded-full blur-3xl transition-transform duration-75 ease-out"
           ></div>
        </div>
      </section>

      {/* Trust Section */}
      <section id="safety" className="max-w-4xl mx-auto px-4 py-16 bg-slate-900 rounded-3xl text-white text-center shadow-2xl transition-all hover:scale-[1.01] duration-500 scroll-mt-24 relative overflow-hidden">
        <div className="relative z-10">
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
        </div>
        
        {/* Background Parallax for Safety */}
        <div 
          style={{ transform: `translateY(${(scrollY - 1500) * 0.1}px)` }}
          className="absolute inset-0 bg-gradient-to-br from-blue-900/50 to-transparent transition-transform duration-75 ease-out pointer-events-none"
        ></div>
      </section>
    </div>
  );
};

export default LandingPage;
