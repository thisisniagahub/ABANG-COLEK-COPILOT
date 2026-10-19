import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  X, 
  Send, 
  Loader2, 
  Sparkles, 
  Layers, 
  Brain, 
  ShieldCheck, 
  CheckCircle2, 
  Maximize2, 
  Minimize2,
  ChevronRight,
  Terminal,
  Activity,
  User
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useCopilot } from '@/lib/copilot/CopilotContext';
import { 
  MarginGuardianGenUI, 
  QcBottleTriageGenUI, 
  BusConsignmentGenUI, 
  AutomaticLearningCard 
} from '@/components/copilot/GenerativeUICards';

export const CopilotFloatingWidget = ({ 
  currentTab, 
  onNavigateTab 
}: { 
  currentTab: string;
  onNavigateTab: (tab: string) => void;
}) => {
  const { 
    isOpen, 
    setIsOpen, 
    messages, 
    isProcessing, 
    streamingText, 
    agentSteps, 
    sendMessage, 
    sharedState,
    memory,
    pendingApprovals,
    respondToApproval
  } = useCopilot();

  const [input, setInput] = useState("");
  const [activeTabMode, setActiveTabMode] = useState<'chat' | 'memory' | 'hitl'>('chat');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamingText, isProcessing, agentSteps]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;
    sendMessage(input);
    setInput("");
  };

  const quickPrompts = [
    { label: "Sahkan Margin PADU15", text: "Sahkan formula Margin Guardian untuk baucar PADU15" },
    { label: "Triage Aduan QC Bocor", text: "Lakukan triage JEV untuk aduan botol bocor QC-LEAK-2026-081" },
    { label: "Ujian Acceptance v2.1", text: "Jalankan Acceptance Test Suite v2.1 (FIN-01 hingga OPS-01)" },
    { label: "Status Bas Ekspres", text: "Pantau konsainan bas ekspres Pantai Timur ke TBS" }
  ];

  return (
    <>
      {/* Floating Trigger Button (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative group w-14 h-14 rounded-full bg-black hover:bg-zinc-800 text-white shadow-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95"
          title="Buka JEV Copilot Assistant"
        >
          <Bot size={24} />
          
          {/* Notification pulse if pending approvals */}
          {pendingApprovals.length > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-black font-extrabold text-[10px] rounded-full flex items-center justify-center border-2 border-white animate-bounce">
              {pendingApprovals.length}
            </span>
          )}

          <div className="absolute right-16 top-3 bg-zinc-900 text-white text-[11px] font-semibold px-3 py-1.5 rounded-full whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md">
            JEV Copilot &bull; Shared State
          </div>
        </button>
      </div>

      {/* Floating Drawer / Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-[95vw] sm:w-[460px] h-[640px] max-h-[85vh] bg-white rounded-[32px] border border-black/10 shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-zinc-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-2xl bg-white/10 flex items-center justify-center text-white">
                  <Bot size={16} />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-xs">JEV Copilot Sovereign Assistant</h3>
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-mono px-1.5 py-0.2 rounded font-bold">
                      Active
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-400 block font-mono">
                    Shared Tab Context: <b className="text-zinc-200 capitalize">{currentTab}</b>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-zinc-300 hover:text-white transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Sub-Navigation: Chat / Automatic Learning / HITL Approvals */}
            <div className="flex items-center justify-around bg-zinc-800 text-[11px] font-semibold text-zinc-400 px-3 py-1.5 border-t border-zinc-700/50 shrink-0">
              <button
                onClick={() => setActiveTabMode('chat')}
                className={`px-3 py-1 rounded-full transition-colors ${
                  activeTabMode === 'chat' ? 'bg-white text-black' : 'hover:text-white'
                }`}
              >
                In-App Chat
              </button>
              <button
                onClick={() => setActiveTabMode('memory')}
                className={`px-3 py-1 rounded-full transition-colors flex items-center gap-1 ${
                  activeTabMode === 'memory' ? 'bg-white text-black' : 'hover:text-white'
                }`}
              >
                <Brain size={12} /> Automatic Learning
              </button>
              <button
                onClick={() => setActiveTabMode('hitl')}
                className={`px-3 py-1 rounded-full transition-colors flex items-center gap-1 ${
                  activeTabMode === 'hitl' ? 'bg-white text-black' : 'hover:text-white'
                }`}
              >
                <ShieldCheck size={12} /> HITL Queue ({pendingApprovals.length})
              </button>
            </div>

            {/* Tab 1: Chat View */}
            {activeTabMode === 'chat' && (
              <div className="flex-1 flex flex-col min-h-0 bg-[#FBFBFC]">
                {/* Messages & Generative UI */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                  {messages.length === 0 && (
                    <div className="text-center py-8 space-y-3">
                      <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center mx-auto text-zinc-400">
                        <Sparkles size={20} />
                      </div>
                      <p className="font-bold text-zinc-800 text-xs">CopilotKit Headless UI Terintegrasi</p>
                      <p className="text-[11px] text-zinc-500 max-w-xs mx-auto">
                        Tanya soalan operasi, semak Margin Guardian dengan Generative UI, atau minta Copilot menukar tab secara autonomi.
                      </p>

                      <div className="flex flex-wrap justify-center gap-1.5 pt-2 max-w-sm mx-auto">
                        {quickPrompts.map((p, idx) => (
                          <button
                            key={idx}
                            onClick={() => sendMessage(p.text)}
                            className="text-[10.5px] px-3 py-1.5 rounded-full bg-white border border-black/10 hover:bg-zinc-50 text-zinc-700 font-medium transition-all"
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex gap-2.5 max-w-full ${
                        msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1 text-[10px] ${
                          msg.role === 'user'
                            ? 'bg-black text-white'
                            : 'bg-white border border-black/10 text-zinc-800'
                        }`}
                      >
                        {msg.role === 'user' ? <User size={11} /> : <Bot size={11} />}
                      </div>

                      <div
                        className={`rounded-2xl p-3.5 text-xs leading-relaxed max-w-[85%] font-medium ${
                          msg.role === 'user'
                            ? 'bg-black text-white rounded-br-xs'
                            : 'bg-white rounded-bl-xs text-zinc-800 border border-black/[0.05] shadow-xs'
                        }`}
                      >
                        <div className={msg.role === 'user' ? 'text-white' : 'text-zinc-800 markdown-body'}>
                          <ReactMarkdown>{msg.parts?.map((p: any) => p.text || '').join('') || ''}</ReactMarkdown>
                        </div>

                        {/* Generative UI Components inline */}
                        {msg.role === 'model' && msg.parts?.some((p: any) => p.text?.includes('Margin Guardian')) && (
                          <MarginGuardianGenUI 
                            data={{
                              contribution_rm: 7.45,
                              contribution_margin_pct: 25.04,
                              status: 'APPROVED_BY_MARGIN_GUARDIAN',
                              campaign_name: 'PADU15'
                            }} 
                          />
                        )}

                        {msg.role === 'model' && msg.parts?.some((p: any) => p.text?.includes('QC Botol Bocor')) && (
                          <QcBottleTriageGenUI 
                            data={{
                              complaint_id: 'QC-LEAK-2026-081',
                              risk_level: 'Medium',
                              suggested_action: 'Gantian Botol Baru Segera + Pengetatan Torque Penutup 2.5 N.m'
                            }}
                          />
                        )}

                        {msg.role === 'model' && msg.parts?.some((p: any) => p.text?.includes('Bas Ekspres')) && (
                          <BusConsignmentGenUI />
                        )}
                      </div>
                    </div>
                  ))}

                  {/* AG-UI Streaming Indicator & Live Steps */}
                  {isProcessing && (
                    <div className="space-y-2">
                      {agentSteps.map(step => (
                        <div key={step.id} className="p-2.5 rounded-xl bg-white border border-black/5 text-[11px] flex items-center justify-between">
                          <span className="font-semibold text-zinc-700 truncate">
                            {step.type === 'tool' ? `Alatan: ${step.toolName}` : 'Sedang berfikir...'}
                          </span>
                          {step.status === 'streaming' ? (
                            <Loader2 size={12} className="animate-spin text-zinc-400" />
                          ) : (
                            <CheckCircle2 size={12} className="text-emerald-500" />
                          )}
                        </div>
                      ))}

                      {streamingText && (
                        <div className="p-3 bg-white rounded-2xl border border-black/5 text-xs text-zinc-700 opacity-80">
                          <ReactMarkdown>{streamingText}</ReactMarkdown>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Input form */}
                <div className="p-3 bg-white border-t border-black/[0.06]">
                  <form onSubmit={handleSubmit} className="relative flex items-center bg-zinc-50 rounded-full border border-black/10 p-1.5">
                    <input
                      type="text"
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      placeholder="Tanya Copilot atau beri arahan operasi..."
                      disabled={isProcessing}
                      className="flex-1 bg-transparent px-3 py-1.5 text-xs outline-none text-zinc-900 font-medium placeholder:text-zinc-400"
                    />
                    <button
                      type="submit"
                      disabled={!input.trim() || isProcessing}
                      className="w-8 h-8 rounded-full bg-black hover:bg-zinc-800 disabled:opacity-40 text-white flex items-center justify-center transition-colors shrink-0"
                    >
                      {isProcessing ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* Tab 2: Automatic Learning View */}
            {activeTabMode === 'memory' && (
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FBFBFC]">
                <AutomaticLearningCard memory={memory} />

                <div className="bg-white rounded-3xl p-5 border border-black/[0.06] space-y-2 text-xs shadow-xs">
                  <h4 className="font-bold text-zinc-900 text-xs">Shared State Semasa (useCopilotReadable)</h4>
                  <p className="text-[11px] text-zinc-500">
                    Copilot sentiasa menyelaraskan konteks daripada tab yang sedang anda lihat:
                  </p>
                  <pre className="text-[10px] bg-zinc-50 p-3 rounded-2xl font-mono text-zinc-700 overflow-x-auto border border-black/[0.04]">
                    {JSON.stringify({ activeTab: currentTab, ...sharedState }, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            {/* Tab 3: Human in the Loop (HITL) Queue */}
            {activeTabMode === 'hitl' && (
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FBFBFC]">
                <div className="bg-white rounded-3xl p-5 border border-black/[0.06] shadow-xs space-y-2">
                  <h4 className="font-bold text-zinc-900 text-xs">Barisan Kelulusan Manusia (HITL Queue)</h4>
                  <p className="text-[11px] text-zinc-500">
                    Prinsip <b>Rules Own The Money</b>: Tindakan kewangan dan keselamatan memerlukan butang kelulusan eksplisit pengguna.
                  </p>
                </div>

                {pendingApprovals.length === 0 ? (
                  <div className="text-center py-10 bg-white rounded-3xl border border-black/[0.04] p-6 text-zinc-400 text-xs">
                    <CheckCircle2 size={24} className="mx-auto text-emerald-500 mb-2" />
                    <span>Tiada tindakan yang memerlukan kelulusan tertunggak.</span>
                  </div>
                ) : (
                  pendingApprovals.map(req => (
                    <div key={req.id} className="bg-white p-4 rounded-2xl border border-amber-300 shadow-xs space-y-2 text-xs">
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-zinc-900">{req.title}</span>
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 uppercase">
                          Pending Approval
                        </span>
                      </div>
                      <p className="text-zinc-600 text-[11px]">{req.description}</p>
                      
                      <div className="flex justify-end gap-2 pt-2 border-t border-black/[0.04]">
                        <button
                          onClick={() => respondToApproval(req.id, false)}
                          className="px-3 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-lg text-xs font-semibold"
                        >
                          Tolak (Reject)
                        </button>
                        <button
                          onClick={() => respondToApproval(req.id, true)}
                          className="px-3 py-1 bg-black hover:bg-zinc-800 text-white rounded-lg text-xs font-semibold"
                        >
                          Luluskan (Approve)
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
