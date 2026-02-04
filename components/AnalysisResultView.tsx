
import React, { useState } from 'react';
import { AnalysisResult, RiskLevel, ContractClause } from '../types';

declare var html2pdf: any;

interface AnalysisResultViewProps {
  data: AnalysisResult;
  onRestart: () => void;
}

const RiskBadge: React.FC<{ level: RiskLevel }> = ({ level }) => {
  const styles = {
    [RiskLevel.LOW]: "bg-green-100 text-green-700 border-green-200",
    [RiskLevel.MEDIUM]: "bg-yellow-100 text-yellow-700 border-yellow-200",
    [RiskLevel.HIGH]: "bg-red-100 text-red-700 border-red-200"
  };

  return (
    <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${styles[level]}`}>
      {level} Risk
    </span>
  );
};

const ClauseCard: React.FC<{ clause: ContractClause }> = ({ clause }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-4 transition-all hover:border-blue-200 print-break-inside-avoid">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
      >
        <div className="flex items-center space-x-4">
          <div className={`w-3 h-3 rounded-full flex-shrink-0 ${clause.riskLevel === RiskLevel.HIGH ? 'bg-red-500' : clause.riskLevel === RiskLevel.MEDIUM ? 'bg-yellow-500' : 'bg-green-500 shadow-sm'}`}></div>
          <h4 className="font-bold text-slate-800 text-lg leading-tight">{clause.title}</h4>
        </div>
        <div className="flex items-center space-x-3 no-print">
          <RiskBadge level={clause.riskLevel} />
          <svg className={`w-5 h-5 text-slate-300 transition-transform ${isOpen ? 'rotate-180 text-blue-500' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
        </div>
        <div className="hidden print:block">
           <RiskBadge level={clause.riskLevel} />
        </div>
      </button>
      
      <div className={`${isOpen ? 'block' : 'hidden'} print:block px-5 pb-6 space-y-6 border-t border-slate-50 pt-5 animate-in fade-in slide-in-from-top-2 duration-300`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">What this means</h5>
            <p className="text-slate-700 leading-relaxed text-sm">{clause.whatItMeans}</p>
          </div>
          <div>
            <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Why it matters</h5>
            <p className="text-slate-700 leading-relaxed text-sm">{clause.whyItMatters}</p>
          </div>
        </div>
        {clause.watchOutIf && (
           <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 flex items-start space-x-3">
            <span className="text-orange-500 mt-0.5">⚠️</span>
            <div>
              <h5 className="text-[10px] font-black text-orange-700 uppercase tracking-widest mb-1">Critical Caveat</h5>
              <p className="text-orange-900 text-sm font-medium">"{clause.watchOutIf}"</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const AnalysisResultView: React.FC<AnalysisResultViewProps> = ({ data, onRestart }) => {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  const [isExporting, setIsExporting] = useState(false);

  const handleDownloadPDF = () => {
    setIsExporting(true);
    const element = document.getElementById('analysis-report-content');
    if (!element) return;

    const opt = {
      margin: [0.5, 0.5, 0.5, 0.5],
      filename: `ContractClarity_${data.overview.contractType.replace(/\s+/g, '_')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
      pagebreak: { mode: ['css', 'legacy'] }
    };

    html2pdf().from(element).set(opt).save().then(() => {
      setIsExporting(false);
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-10 animate-in fade-in duration-700">
      
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white/80 backdrop-blur p-4 rounded-3xl border border-slate-200 shadow-sm no-print sticky top-20 z-40">
        <button 
          onClick={onRestart}
          className="flex items-center space-x-2 text-slate-600 hover:text-blue-700 font-bold px-4 py-2 transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
          <span>New Analysis</span>
        </button>

        <div className="flex items-center space-x-2">
          <button 
            onClick={handleDownloadPDF}
            disabled={isExporting}
            className="flex items-center space-x-2 bg-slate-900 text-white hover:bg-slate-800 px-6 py-2.5 rounded-2xl font-bold text-sm transition-all shadow-xl shadow-slate-200 disabled:opacity-50"
          >
            {isExporting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            )}
            <span>{isExporting ? 'Preparing PDF...' : 'Export PDF Report'}</span>
          </button>
        </div>
      </div>

      <div id="analysis-report-content" className="space-y-12 bg-slate-50">
        {/* Header - Report Identity */}
        <div className="text-center space-y-2 hidden print:block pt-10">
          <h1 className="text-3xl font-black text-slate-900">Contract Analysis Report</h1>
          <p className="text-slate-500 font-medium tracking-widest uppercase text-xs">Generated by ContractClarity AI • Non-Legal Educational Reference</p>
        </div>

        {/* 1. Overview */}
        <div className="bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden print:bg-white print:text-slate-900 print:border print:border-slate-200 print:rounded-3xl">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-10 flex items-center">
              <span className="bg-white/10 w-10 h-10 rounded-xl flex items-center justify-center mr-4 text-sm font-black print:bg-slate-100">01</span>
              Strategic Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-1">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] block">Contract Type</span>
                <span className="text-xl font-bold">{data.overview.contractType}</span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] block">Primary Beneficiary</span>
                <span className="text-xl font-bold text-blue-400 print:text-blue-700">{data.overview.whoItMainlyProtects}</span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] block">Overall Tone</span>
                <span className="text-xl font-bold">{data.overview.overallTone}</span>
              </div>
            </div>
          </div>
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] print:hidden"></div>
        </div>

        {/* 2. Clause Breakdown */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center px-4">
            <span className="bg-blue-100 text-blue-700 w-10 h-10 rounded-xl flex items-center justify-center mr-4 text-sm font-black">02</span> 
            Clause-by-Clause Analysis
          </h2>
          <div className="space-y-4">
            {data.clauses.map((clause, idx) => (
              <ClauseCard key={idx} clause={clause} />
            ))}
          </div>
        </div>

        {/* 3. Red Flags */}
        {data.redFlags.length > 0 && (
          <div className="bg-red-50 rounded-[2.5rem] p-10 border border-red-100 print:bg-white print:border-red-200 print:rounded-3xl">
            <h2 className="text-2xl font-bold text-red-900 mb-8 flex items-center">
              <span className="bg-red-200 text-red-700 w-10 h-10 rounded-xl flex items-center justify-center mr-4 text-sm font-black">03</span>
              Critical Red Flags 🚩
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.redFlags.map((flag, idx) => (
                <div key={idx} className="bg-white/50 p-4 rounded-2xl border border-red-200 flex items-start space-x-3 print:bg-red-50/20">
                  <span className="text-red-500 mt-1">✕</span>
                  <p className="text-red-900 text-sm font-medium leading-relaxed">{flag}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. The Verdict */}
        <div className={`rounded-[2.5rem] p-10 border shadow-sm print:rounded-3xl print:bg-white ${data.summary.overallRiskLevel === RiskLevel.HIGH ? 'bg-orange-50 border-orange-200' : 'bg-blue-50 border-blue-100'}`}>
          <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center">
            <span className="bg-white/50 w-10 h-10 rounded-xl flex items-center justify-center mr-4 text-sm font-black shadow-sm">04</span>
            The Expert Verdict
          </h2>
          <div className="flex flex-col md:flex-row gap-10 items-start">
            <div className={`px-8 py-6 rounded-3xl text-center flex-shrink-0 border-4 shadow-xl print:shadow-none ${data.summary.overallRiskLevel === RiskLevel.HIGH ? 'bg-red-600 text-white border-red-700/50' : 'bg-green-600 text-white border-green-700/50'}`}>
               <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-70 block mb-1">Safety Rating</span>
               <span className="text-4xl font-black">{data.summary.overallRiskLevel}</span>
            </div>
            <div className="flex-1">
              <p className="text-2xl font-semibold text-slate-800 leading-tight">
                "{data.summary.plainVerdict}"
              </p>
              <p className="mt-4 text-slate-500 text-sm italic">This analysis is powered by Gemini 3 and reflects an automated interpretation of the provided text.</p>
            </div>
          </div>
        </div>

        {/* 5. Pre-Signing Checklist */}
        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-sm print:rounded-3xl">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center">
            <span className="bg-slate-100 text-slate-700 w-10 h-10 rounded-xl flex items-center justify-center mr-4 text-sm font-black">05</span>
            Final Checklist
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.checklist.map((item, idx) => (
              <div key={idx} className="flex items-center space-x-4 p-5 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-blue-200 transition-colors">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-[10px] font-black flex-shrink-0">✓</div>
                <span className="text-slate-800 font-semibold text-sm leading-tight">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Legal Disclaimer Footer */}
        <div className="text-center pt-10 border-t border-slate-200">
          <div className="max-w-2xl mx-auto space-y-6">
            <p className="text-slate-400 text-xs leading-relaxed uppercase tracking-widest font-bold">
              Important: This is an AI-generated analysis and does NOT constitute legal advice. 
              Always review high-stakes contracts with a qualified attorney in your jurisdiction.
            </p>
            <div className="flex justify-center space-x-6 no-print">
               <button onClick={onRestart} className="text-blue-600 hover:underline font-bold text-sm">Analyze Another</button>
               <span className="text-slate-200">|</span>
               <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="text-slate-400 hover:text-slate-900 font-bold text-sm">Back to Top</button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AnalysisResultView;
