import React from 'react';
import { HealthReportAnalysis } from '../types';
import Accordion from './Accordion';
import { 
  ActivityIcon, 
  AlertCircleIcon, 
  CheckCircleIcon, 
  HeartPulseIcon, 
  InfoIcon, 
  FileTextIcon,
  ChevronDownIcon
} from './Icons';

interface AnalysisResultProps {
  data: HealthReportAnalysis;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ data }) => {
  const getConfidenceColor = (score?: number) => {
    if (!score) return 'text-slate-500';
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 50) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const hasParameters = data.parameters && data.parameters.length > 0;

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      
      {/* Header with Confidence Score */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <h2 className="text-2xl font-bold text-slate-800">
          {hasParameters ? "Report Analysis Results" : "Symptom Analysis Results"}
        </h2>
        {data.confidenceScore !== undefined && hasParameters && (
          <div className={`px-4 py-1.5 rounded-full border text-sm font-medium flex items-center gap-2 w-fit ${getConfidenceColor(data.confidenceScore)}`}>
            <ActivityIcon className="w-4 h-4" />
            Parsing Confidence: {data.confidenceScore}%
          </div>
        )}
      </div>

      {/* Disclaimer Banner */}
      <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-xl shadow-sm">
        <div className="flex items-start gap-3">
          <InfoIcon className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-amber-800">
             <p className="font-semibold mb-1">Important Medical Disclaimer</p>
             <p className="opacity-90">{data.disclaimer}</p>
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-teal-50 to-white p-4 border-b border-teal-100 flex items-center gap-3">
          <FileTextIcon className="w-5 h-5 text-teal-600" />
          <h3 className="font-bold text-slate-800">Executive Summary</h3>
        </div>
        <div className="p-6 text-slate-700 leading-relaxed whitespace-pre-wrap">
          {data.summary}
        </div>
      </div>

      {/* Abnormal Findings Highlight - Show if present */}
      {data.abnormalities && data.abnormalities.length > 0 && (
        <div className="bg-red-50 rounded-xl border border-red-100 overflow-hidden">
           <div className="p-4 border-b border-red-100 flex items-center gap-3">
            <AlertCircleIcon className="w-5 h-5 text-red-600" />
            <h3 className="font-bold text-red-800">
              {hasParameters ? "Abnormal Findings" : "Key Symptoms Identified"}
            </h3>
          </div>
          <div className="p-6 pt-2">
            <ul className="space-y-3 mt-2">
              {data.abnormalities.map((item, idx) => (
                <li key={idx} className="flex items-start text-red-800 bg-white/60 p-3 rounded-lg border border-red-100/50">
                  <span className="mr-3 mt-1.5 w-2 h-2 bg-red-500 rounded-full flex-shrink-0 shadow-sm"></span>
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Detailed Parameter Table - ONLY SHOW IF PARAMETERS EXIST */}
      {hasParameters && (
        <Accordion 
          title="Detailed Parameter Analysis" 
          icon={<ActivityIcon className="w-6 h-6" />}
          defaultOpen={true}
        >
          <div className="overflow-x-auto -mx-5 sm:mx-0">
            <table className="min-w-full text-sm text-left border-collapse">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-xs">
                <tr>
                  <th className="px-4 py-3 border-b border-slate-200">Parameter</th>
                  <th className="px-4 py-3 border-b border-slate-200">Value / Unit</th>
                  <th className="px-4 py-3 border-b border-slate-200">Reference</th>
                  <th className="px-4 py-3 border-b border-slate-200 w-1/3">Interpretation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.parameters.map((param, idx) => (
                  <tr key={idx} className={`hover:bg-slate-50/80 transition-colors ${param.status !== 'Normal' ? 'bg-orange-50/30' : ''}`}>
                    <td className="px-4 py-4 align-top">
                      <div className="font-bold text-slate-800">{param.name}</div>
                      <div className="text-xs text-slate-400 font-medium mt-0.5">{param.meaning}</div>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <div className="font-semibold text-slate-700">{param.value}</div>
                      <div className="text-xs text-slate-500">{param.unit}</div>
                    </td>
                    <td className="px-4 py-4 align-top text-slate-500 font-mono text-xs">
                      {param.normalRange}
                    </td>
                    <td className="px-4 py-4 align-top">
                      <div className="flex items-start gap-2 mb-1">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide
                          ${param.status === 'Normal' ? 'bg-green-100 text-green-700' : 
                            param.status === 'Abnormal' ? 'bg-orange-100 text-orange-700' :
                            param.status === 'Critical' ? 'bg-red-100 text-red-700' :
                            'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {param.status}
                        </span>
                      </div>
                      {param.explanation && (
                        <p className="text-slate-600 text-xs leading-relaxed">{param.explanation}</p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Accordion>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Possible Causes / Differential Diagnosis */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
           <div className="p-4 border-b border-slate-100 flex items-center gap-2">
             <InfoIcon className="w-5 h-5 text-teal-600" />
             <h3 className="font-bold text-slate-800">
               {hasParameters ? "Potential Causes" : "Possible Conditions"}
             </h3>
           </div>
           <div className="p-5">
             <ul className="space-y-2">
                {data.possibleCauses.map((item, idx) => (
                  <li key={idx} className="text-slate-700 text-sm flex items-start gap-2">
                    <span className="text-teal-400 mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
             </ul>
           </div>
        </div>

        {/* Lifestyle / Treatments */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
           <div className="p-4 border-b border-slate-100 flex items-center gap-2">
             <HeartPulseIcon className="w-5 h-5 text-teal-600" />
             <h3 className="font-bold text-slate-800">
               {hasParameters ? "Lifestyle Tips" : "Treatment & Advice"}
             </h3>
           </div>
           <div className="p-5">
             <ul className="space-y-3">
                {data.lifestyleSuggestions.map((item, idx) => (
                  <li key={idx} className="flex items-start text-sm text-slate-700">
                    <CheckCircleIcon className="w-4 h-4 text-emerald-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
             </ul>
           </div>
        </div>
      </div>

      {/* Follow Up */}
      <Accordion 
        title="Next Steps & Follow-up" 
        icon={<ActivityIcon className="w-6 h-6" />}
        defaultOpen={true}
      >
        <ul className="space-y-3">
          {data.followUpConsiderations.map((item, idx) => (
            <li key={idx} className="flex items-start text-slate-700">
              <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0">{idx + 1}</span>
              <span className="mt-0.5">{item}</span>
            </li>
          ))}
        </ul>
      </Accordion>

      {/* Raw Text Panel (Collapsible) - Only show if content exists and isn't just the placeholder */}
      {data.rawText && data.rawText !== "Symptom Analysis Only" && (
        <div className="pt-8 border-t border-slate-200">
          <details className="group">
            <summary className="flex items-center cursor-pointer text-xs text-slate-400 hover:text-slate-600 transition-colors list-none">
              <span className="mr-2">Show Raw OCR Text</span>
              <ChevronDownIcon className="w-3 h-3 transform group-open:rotate-180 transition-transform" />
            </summary>
            <div className="mt-3 p-4 bg-slate-100 rounded-lg border border-slate-200 text-xs font-mono text-slate-600 whitespace-pre-wrap max-h-60 overflow-y-auto">
              {data.rawText}
            </div>
          </details>
        </div>
      )}

    </div>
  );
};

export default AnalysisResult;