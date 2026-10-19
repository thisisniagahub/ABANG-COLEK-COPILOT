import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MOCK_DB } from '@/services/gemini';

export const ReportsView = ({ onAction }: { onAction: (msg?: string) => void }) => {
  const handleGenerateReport = () => {
    onAction("Sediakan laporan operasi tahunan komprehensif bagi AbangColek: analisis margin sumbangan, prestasi hab bas Pantai Timur, kawalan kualiti kuah colek, dan cadangan strategik");
  };

  return (
    <div className="p-4 md:p-8 h-full overflow-y-auto pr-1">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">
              <span>Laporan Strategik</span>
              <span>•</span>
              <span className="text-emerald-700 font-bold">Executive Intelligence</span>
            </div>
            <h2 className="text-3xl font-bold text-zinc-900 tracking-tight">Laporan Eksekutif</h2>
            <p className="text-zinc-500 mt-1 text-[14px]">Analisis naratif perniagaan, metrik sumbangan margin, dan cadangan penyeliaan.</p>
          </div>
          <button 
            onClick={handleGenerateReport} 
            className="px-5 py-2.5 bg-black text-white rounded-full text-[13px] font-medium hover:bg-zinc-800 transition-colors shadow-sm self-start sm:self-auto flex items-center gap-2"
          >
            <Sparkles size={14} /> + Jana Laporan Baharu
          </button>
        </div>

        <div className="grid gap-6">
          {MOCK_DB.reports.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-black/[0.04] p-8 shadow-sm">
              <div className="w-16 h-16 rounded-full bg-zinc-50 border border-black/5 flex items-center justify-center mx-auto mb-4">
                <FileText size={24} className="text-zinc-400" />
              </div>
              <p className="text-zinc-700 font-bold text-base mb-1">Belum Ada Laporan Dijana</p>
              <p className="text-zinc-400 text-xs max-w-md mx-auto mb-6">Minta Agent Chat untuk menulis laporan prestasi tahunan, analisis QC botol bocor, atau kajian pasaran.</p>
              <button
                onClick={handleGenerateReport}
                className="px-5 py-2 bg-black text-white rounded-full text-xs font-semibold hover:bg-zinc-800 transition-all"
              >
                Jana Laporan Sekarang
              </button>
            </div>
          ) : (
            [...MOCK_DB.reports].reverse().map((report, i) => (
              <div key={i} className="bg-white rounded-[32px] border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.02)] overflow-hidden hover:border-black/10 transition-all">
                <div className="bg-zinc-50/50 px-8 py-5 border-b border-black/[0.04] flex justify-between items-center">
                  <h3 className="font-semibold text-lg md:text-xl text-zinc-900 tracking-tight">{report.title}</h3>
                  <span className="text-[12px] font-semibold bg-white text-zinc-600 px-3.5 py-1 rounded-full border border-black/5">{report.year}</span>
                </div>
                <div className="p-8 md:p-10 space-y-8">
                  <div>
                    <h4 className="font-bold text-zinc-900 mb-2 text-[14px]">Ringkasan Eksekutif</h4>
                    <p className="text-zinc-600 leading-relaxed font-medium text-[13.5px]">{report.executive_summary}</p>
                  </div>

                  <div>
                    <h4 className="font-bold text-zinc-900 mb-2 text-[14px]">Analisis Terperinci</h4>
                    <p className="text-zinc-600 leading-relaxed font-medium text-[13px] whitespace-pre-wrap">{report.detailed_analysis}</p>
                  </div>
                  
                  {report.metrics && report.metrics.length > 0 && (
                    <div>
                      <h4 className="font-bold text-zinc-900 mb-4 text-[14px]">Metrik Prestasi Utama</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {report.metrics.filter((m: any) => m.value !== 'N/A' && m.value !== 'n/a').map((m: any, idx: number) => (
                          <div key={idx} className="p-5 bg-zinc-50 border border-black/[0.04] rounded-2xl">
                            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block mb-1.5">{m.label}</span>
                            <div className="flex items-end gap-2">
                              <span className="text-2xl font-bold font-mono text-zinc-900 tracking-tight leading-none">
                                {m.label.toLowerCase().includes('revenue') || m.label.toLowerCase().includes('value') || m.label.toLowerCase().includes('margin') || m.label.toLowerCase().includes('sales') ? 'RM ' : ''}
                                {m.value?.toLocaleString() || 0}
                              </span>
                              {m.trend && m.trend !== 'N/A' && m.trend !== 'n/a' && (
                                <span className={cn(
                                  "text-[12px] font-semibold mb-0.5",
                                  m.trend.startsWith('+') ? "text-emerald-500" : m.trend.startsWith('-') ? "text-red-500" : "text-zinc-400"
                                )}>
                                  {m.trend}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {report.key_insights && report.key_insights.length > 0 && (
                    <div>
                      <h4 className="font-bold text-zinc-900 mb-3 text-[14px]">Dapatan Utama</h4>
                      <ul className="space-y-2 text-xs text-zinc-600">
                        {report.key_insights.map((insight: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2 bg-zinc-50 p-3 rounded-xl border border-black/[0.02]">
                            <span className="w-1.5 h-1.5 rounded-full bg-black shrink-0 mt-1.5" />
                            <span>{insight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {report.recommendations && (
                    <div>
                      <h4 className="font-bold text-zinc-900 mb-3 text-[14px]">Cadangan Strategik</h4>
                      <div className="grid gap-3">
                        {report.recommendations?.map((rec: string, idx: number) => (
                          <div key={idx} className="bg-zinc-900 text-white p-4 rounded-2xl flex items-start gap-3">
                            <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                              <Sparkles size={11} className="text-white/80" />
                            </div>
                            <span className="text-zinc-200 font-medium leading-relaxed text-[12.5px]">{rec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
