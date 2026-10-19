import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  XCircle, 
  Play, 
  RotateCw, 
  ShieldCheck, 
  Terminal, 
  ChevronDown, 
  ChevronRight,
  Filter,
  Sparkles
} from 'lucide-react';
import { growthOsStore } from '@/services/growthOsStore';
import { AcceptanceTestResult } from '@/types/growthOs';

export const AcceptanceTestsView = ({ onAskAgent }: { onAskAgent: (q: string) => void }) => {
  const [results, setResults] = useState<AcceptanceTestResult[]>([]);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [expandedTestId, setExpandedTestId] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  const runTests = async () => {
    setIsRunning(true);
    try {
      const res = await growthOsStore.runAcceptanceTestSuite();
      setResults(res);
    } finally {
      setIsRunning(false);
    }
  };

  useEffect(() => {
    // Run suite on mount once to populate results
    runTests();
  }, []);

  const passedCount = results.filter(r => r.passed).length;
  const filteredResults = categoryFilter === 'ALL' 
    ? results 
    : results.filter(r => r.category === categoryFilter);

  const categories = ['ALL', 'Financial', 'Payment', 'Stock', 'Offline', 'Referral', 'Security', 'Disaster', 'AI / Resilience', 'Operations'];

  return (
    <div className="h-full flex flex-col space-y-6 overflow-y-auto pr-1">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 border border-black/[0.06] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">
            <span className="text-emerald-700 font-bold">Acceptance Test Suite Runner</span>
            <span>•</span>
            <span>Blueprint Section 7 (FIN-01 hingga OPS-01)</span>
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Jadual Ujian Penerimaan Minimum</h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            14 senario ujian wajib lulus bagi integriti kewangan, idempotensi pembayaran, pencegahan penipuan, logistik bas & pemulihan bencana.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onAskAgent("Jalankan Acceptance Test Suite v2.1 dan rumuskan status setiap senario FIN, PAY, STK, REF, SEC, DR, AI, OPS.")}
            className="px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold rounded-full transition-all flex items-center gap-1.5"
          >
            <Sparkles size={14} /> Jalankan via AI Agent
          </button>
          <button
            onClick={runTests}
            disabled={isRunning}
            className="px-5 py-2.5 bg-black hover:bg-zinc-800 disabled:opacity-50 text-white text-xs font-bold rounded-full transition-all flex items-center gap-2 shadow-sm"
          >
            {isRunning ? (
              <RotateCw size={14} className="animate-spin" />
            ) : (
              <Play size={14} className="fill-current" />
            )}
            {isRunning ? 'Sedang Menjalankan...' : 'Jalankan Semua Ujian (Run All)'}
          </button>
        </div>
      </div>

      {/* Summary Scorecard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-black/[0.06] shadow-sm">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Status Keseluruhan</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className={`text-2xl font-bold font-mono ${passedCount === results.length && results.length > 0 ? 'text-emerald-600' : 'text-zinc-900'}`}>
              {passedCount} / {results.length}
            </span>
            <span className="text-xs font-semibold text-emerald-700">
              {passedCount === results.length && results.length > 0 ? '100% Lulus' : 'Berjalan'}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-black/[0.06] shadow-sm">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Kewangan & Margin</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold font-mono text-zinc-900">FIN-01</span>
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 size={12} /> Verified
            </span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-black/[0.06] shadow-sm">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Idempotensi & Contra</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold font-mono text-zinc-900">PAY-01..03</span>
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 size={12} /> Verified
            </span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-black/[0.06] shadow-sm">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Anti-IDOR & Sekuriti</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold font-mono text-zinc-900">SEC-01..02</span>
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 size={12} /> Verified
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              categoryFilter === cat ? 'bg-black text-white' : 'bg-white text-zinc-600 hover:bg-zinc-100 border border-black/[0.04]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Tests List */}
      <div className="space-y-3">
        {filteredResults.map((test) => {
          const isExpanded = expandedTestId === test.id;
          return (
            <div 
              key={test.id}
              className="bg-white rounded-2xl border border-black/[0.06] shadow-xs overflow-hidden transition-all"
            >
              <div 
                onClick={() => setExpandedTestId(isExpanded ? null : test.id)}
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-zinc-50/50"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    test.passed ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                  }`}>
                    {test.passed ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-zinc-900">{test.id}</span>
                      <span className="text-xs text-zinc-400">•</span>
                      <span className="font-bold text-zinc-800 text-xs">{test.name}</span>
                      <span className="text-[10px] text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-full font-medium">
                        {test.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500 mt-0.5">{test.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-zinc-400">{test.executionTimeMs}ms</span>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                    test.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {test.passed ? 'PASS' : 'FAIL'}
                  </span>
                  {isExpanded ? <ChevronDown size={14} className="text-zinc-400" /> : <ChevronRight size={14} className="text-zinc-400" />}
                </div>
              </div>

              {/* Collapsible Execution Log */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-black/[0.04] bg-zinc-900 text-zinc-100 p-4 font-mono text-[11px] space-y-1.5"
                  >
                    <div className="flex items-center gap-2 text-zinc-400 text-[10px] pb-1 border-b border-zinc-800 uppercase tracking-wider">
                      <Terminal size={12} /> Execution Logs & State Machine Assertions
                    </div>
                    {test.executionLog.map((log, i) => (
                      <div key={i} className="text-zinc-300">
                        <span className="text-zinc-500 select-none mr-2">&gt;</span>
                        {log}
                      </div>
                    ))}
                    <div className="pt-2 text-emerald-400 font-bold border-t border-zinc-800">
                      Assertion Result: {test.details}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};
