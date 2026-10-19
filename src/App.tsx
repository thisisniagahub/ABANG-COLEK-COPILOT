/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Bot, 
  User, 
  Activity, 
  Database, 
  Loader2, 
  CheckCircle2, 
  ShieldCheck, 
  Package, 
  Truck, 
  DollarSign, 
  Users, 
  ShoppingBag, 
  FileCheck2, 
  BarChart3, 
  FileText,
  Sparkles,
  Search,
  Wifi,
  ChevronRight,
  Shield
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';
import { sendMessageToAgentStream, ChatMessage, ToolCall, AgentStep, MOCK_DB } from '@/services/gemini';
import { OperationsView } from '@/components/OperationsView';
import { MarginGuardianView } from '@/components/MarginGuardianView';
import { DealersView } from '@/components/DealersView';
import { AcceptanceTestsView } from '@/components/AcceptanceTestsView';
import { OrdersView } from '@/components/OrdersView';
import { StorefrontView } from '@/components/StorefrontView';
import { DashboardsView } from '@/components/DashboardsView';
import { ReportsView } from '@/components/ReportsView';
import { CopilotProvider, useCopilot } from '@/lib/copilot/CopilotContext';
import { CopilotFloatingWidget } from '@/components/copilot/CopilotFloatingWidget';
import { 
  MarginGuardianGenUI, 
  QcBottleTriageGenUI, 
  BusConsignmentGenUI, 
  AutomaticLearningCard 
} from '@/components/copilot/GenerativeUICards';
import { CommandPalette } from '@/components/copilot/CommandPalette';

// --- Sidebar ---
const Sidebar = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (t: string) => void }) => {
  const menuSections = [
    {
      title: "Kecerdasan & Tindakan",
      items: [
        { id: 'chat', label: 'JEV Agent Chat', icon: Bot, badge: 'System-1' },
        { id: 'dashboards', label: 'Dashboards', icon: BarChart3 },
        { id: 'reports', label: 'Laporan Eksekutif', icon: FileText },
      ]
    },
    {
      title: "Operasi & Dagangan",
      items: [
        { id: 'operations', label: 'Pusat Operasi Tempatan', icon: Package, badge: 'FEFO/Bas' },
        { id: 'margin', label: 'Margin Guardian', icon: ShieldCheck, badge: 'Rules' },
        { id: 'orders', label: 'Lejar & 5-State Machine', icon: Database },
        { id: 'dealers', label: 'Ejen & Lejar Komisen', icon: Users },
        { id: 'storefront', label: 'Kedai Web PWA', icon: ShoppingBag, badge: 'Offline' },
      ]
    },
    {
      title: "Integriti & Jaminan",
      items: [
        { id: 'tests', label: 'Acceptance Tests v2.1', icon: FileCheck2, badge: '14 Ujian' },
      ]
    }
  ];

  return (
    <div className="hidden lg:flex w-[290px] flex-col h-screen pt-6 pb-4 pl-6 pr-3 bg-white border-r border-black/[0.05] shrink-0">
      {/* Brand Header */}
      <div className="mb-6 px-3">
        <button 
          onClick={() => setActiveTab('chat')} 
          className="text-left group flex items-start gap-2.5"
        >
          <div className="w-9 h-9 rounded-2xl bg-black text-white flex items-center justify-center font-black text-base shadow-sm group-hover:scale-105 transition-transform shrink-0">
            AC
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-[15px] text-zinc-900 tracking-tight">AbangColek</span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-zinc-100 text-zinc-600 font-mono">v2.1</span>
            </div>
            <p className="text-[11px] text-zinc-400 font-medium">Sovereign GrowthOS & Orbit</p>
          </div>
        </button>
      </div>
      
      {/* Navigation Sections */}
      <nav className="flex-1 space-y-6 overflow-y-auto pr-1">
        {menuSections.map((sec, idx) => (
          <div key={idx} className="space-y-1">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider px-3 block mb-1.5">
              {sec.title}
            </span>
            {sec.items.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-[13px] font-semibold transition-all",
                  activeTab === item.id 
                    ? "bg-black text-white shadow-sm" 
                    : "text-zinc-600 hover:bg-zinc-100/70 hover:text-black"
                )}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <item.icon size={16} strokeWidth={activeTab === item.id ? 2.5 : 2} className="shrink-0" />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className={cn(
                    "text-[10px] font-bold px-1.5 py-0.5 rounded-md font-mono shrink-0",
                    activeTab === item.id ? "bg-white/20 text-white" : "bg-zinc-100 text-zinc-500"
                  )}>
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer System Status */}
      <div className="pt-4 border-t border-black/[0.05] px-3 space-y-2">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-zinc-400 font-medium">Prinsip Asas</span>
          <span className="text-zinc-800 font-semibold font-mono">Rules Own Money</span>
        </div>
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-zinc-400 font-medium">Pangkalan Data</span>
          <span className="text-emerald-700 font-semibold font-mono flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> SQLite WAL
          </span>
        </div>
      </div>
    </div>
  );
};

// --- Agent Step Block ---
const AgentStepBlock = ({ step }: { step: AgentStep }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "p-4 rounded-3xl transition-all",
        step.status === 'streaming' 
          ? "bg-white shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-black/5" 
          : "bg-zinc-50 border border-black/[0.02]"
      )}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 bg-white shadow-xs border border-black/5 text-zinc-600">
          {step.type === 'tool' ? <Database size={13} /> : <Bot size={13} />}
        </div>
        <span className="font-bold text-[13px] text-zinc-900 truncate">
          {step.type === 'tool' ? `Tool Call: ${step.toolName}` : 'Penaakulan AI (Thinking)'}
        </span>
        {step.status === 'streaming' && <Loader2 size={13} className="animate-spin text-zinc-400 ml-auto shrink-0" />}
        {step.status === 'completed' && (
          <div className="flex items-center gap-2 ml-auto shrink-0">
            {step.latencyMs !== undefined && (
              <span className="text-[10px] text-zinc-500 font-mono font-medium">
                {(step.latencyMs / 1000).toFixed(2)}s
              </span>
            )}
            <div className="text-emerald-500">
              <CheckCircle2 size={14} />
            </div>
          </div>
        )}
      </div>
      
      {step.type === 'tool' && step.toolArgs && (
        <pre className="text-[10px] bg-white text-zinc-600 p-3 rounded-2xl overflow-x-auto mt-2 font-mono whitespace-pre-wrap border border-black/[0.04] leading-relaxed">
          {JSON.stringify(step.toolArgs, null, 2)}
        </pre>
      )}
      
      {step.type === 'text' && step.content && (
        <div className="text-[12.5px] text-zinc-600 mt-2 line-clamp-3 leading-relaxed italic">
          "{step.content}"
        </div>
      )}

      {step.result && (
        <div className="mt-3 pt-3 border-t border-black/[0.04] flex flex-col gap-1 text-[11px]">
          <span className="font-bold text-zinc-400 uppercase tracking-wider text-[9px]">Hasil Output Pelayan</span> 
          <span className="text-zinc-800 font-medium">
            {step.result.message || step.result.summary || (step.result.success ? 'Berjaya Disahkan' : 'Selesai')}
          </span>
        </div>
      )}
    </motion.div>
  );
};

// --- Chat Interface ---
const ChatInterface = ({ 
  history, 
  onSendMessage, 
  isProcessing,
  currentTool,
  agentSteps,
  streamingText,
  setActiveTab
}: { 
  history: ChatMessage[], 
  onSendMessage: (msg: string) => void,
  isProcessing: boolean,
  currentTool: ToolCall | null,
  agentSteps: AgentStep[],
  streamingText: string,
  setActiveTab: (tab: string) => void
}) => {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const leftScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, isProcessing, currentTool, streamingText]);

  useEffect(() => {
    if (leftScrollRef.current) {
      leftScrollRef.current.scrollTop = leftScrollRef.current.scrollHeight;
    }
  }, [agentSteps]);

  const isGeneratingReport = agentSteps.some(s => s.type === 'tool' && s.toolName === 'generate_yearly_report');
  const isGeneratingDashboard = agentSteps.some(s => s.type === 'tool' && s.toolName === 'create_operations_dashboard');
  const isGeneratingWidget = isGeneratingReport || isGeneratingDashboard;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;
    onSendMessage(input);
    setInput("");
  };

  const samplePrompts = [
    { label: "Sahkan Margin Guardian baucar PADU15", query: "Sahkan Margin Guardian untuk baucar PADU15 dengan anggaran bakul RM35 dan diskaun 15%" },
    { label: "Triage aduan botol bocor QC-LEAK-2026-081", query: "Lakukan triage JEV untuk aduan botol bocor QC-LEAK-2026-081 dari bas Transnasional TBS" },
    { label: "Jalankan Acceptance Test Suite v2.1", query: "Jalankan semua acceptance tests Blueprint v2.1 (FIN-01 hingga OPS-01) dan laporkan keputusannya" },
    { label: "Rekonsiliasi tunai Kios TBS Aras 2", query: "Semak rekonsiliasi tunai kios TBS Aras 2: Apungan RM200, Jualan tunai RM1450, belanja RM45, fizikal RM1605" },
    { label: "Semak lejar komisen & contra", query: "Audit lejar komisen ejen dan laporkan sebarang pelarasan kontra negatif selepas bayaran balik" },
    { label: "Bina Dashboard Operasi", query: "Bina operations dashboard: paparkan metrik sumbangan margin, pecahan hab jualan, dan status konsainan bas" },
  ];

  return (
    <div className="flex flex-col md:flex-row-reverse h-auto md:h-full w-full gap-4 md:gap-6">
      {/* Right side: Process & Agent Steps (Execution Trace) */}
      <div className="min-h-[300px] flex-1 md:min-h-0 md:flex-initial w-full md:w-[55%] flex flex-col rounded-[32px] bg-white border border-black/[0.04] shadow-[0_4px_24px_rgba(0,0,0,0.02)] overflow-hidden relative">
        <header className="h-[60px] md:h-[68px] flex items-center justify-between px-6 bg-white shrink-0 border-b border-black/[0.04]">
          <h2 className="font-bold text-zinc-900 text-[14px] flex items-center gap-2.5">
            {isProcessing ? (
              <Loader2 className="text-zinc-600 animate-spin" size={16} />
            ) : (
              <div className="w-7 h-7 rounded-full bg-zinc-100 flex items-center justify-center border border-black/5">
                <Activity className="text-zinc-700" size={13} />
              </div>
            )}
            Jejak Pelaksanaan (Execution Trace)
          </h2>
          <span className="text-[10px] font-mono font-semibold text-zinc-400 bg-zinc-50 px-2 py-0.5 rounded-full border border-black/5">
            Autonomous Tools
          </span>
        </header>
        
        <div className="flex-1 overflow-y-auto px-6 pb-6 pt-4 space-y-3" ref={leftScrollRef}>
          {agentSteps.length === 0 && !isProcessing && (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-2 text-zinc-400">
              <Activity size={28} className="text-zinc-300" />
              <p className="text-xs font-semibold text-zinc-600">Tiada jejak pelaksanaan aktif</p>
              <p className="text-[11px] text-zinc-400 max-w-xs">
                Hantar arahan atau pilih cadangan soalan untuk melihat proses penaakulan multi-langkah dan panggilan alatan di sini.
              </p>
            </div>
          )}
          {agentSteps.map((step) => (
            <AgentStepBlock key={step.id} step={step} />
          ))}
        </div>
      </div>

      {/* Left side: Chat Interface */}
      <div className="min-h-[450px] flex-1 md:min-h-0 md:flex-initial w-full md:w-[45%] flex flex-col rounded-[32px] bg-white border border-black/[0.04] shadow-[0_4px_24px_rgba(0,0,0,0.02)] overflow-hidden relative">
        {/* Header */}
        <header className="h-[60px] md:h-[68px] flex items-center px-6 justify-between shrink-0 border-b border-black/[0.04]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center">
              <Bot size={13} />
            </div>
            <div>
              <h2 className="font-bold text-zinc-900 text-[14px]">JEV System-1 Operations AI</h2>
              <span className="text-[10px] text-emerald-600 font-semibold block leading-tight">Rules Own The Money &bull; Online</span>
            </div>
          </div>
        </header>

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4" ref={scrollRef}>
          {history.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-zinc-400 space-y-4 py-8">
              <div className="w-14 h-14 bg-zinc-50 border border-black/5 rounded-full flex items-center justify-center shadow-xs">
                <Bot size={28} className="text-zinc-400" />
              </div>
              <div className="text-center space-y-1">
                <p className="font-bold text-zinc-900 text-sm">Pembantu Operasi Sovereign AbangColek</p>
                <p className="text-xs text-zinc-500 max-w-xs">Pilih tugasan pantas untuk menguji integriti Margin Guardian, QC botol bocor, atau logistik bas:</p>
              </div>

              <div className="flex flex-col gap-2 w-full max-w-sm pt-2">
                {samplePrompts.slice(0, 4).map((p, i) => (
                  <button 
                    key={i}
                    onClick={() => onSendMessage(p.query)} 
                    className="text-left px-4 py-2.5 bg-zinc-50 hover:bg-zinc-100 rounded-2xl transition-all border border-black/5 text-zinc-700 font-medium text-[12px] flex items-center justify-between group"
                  >
                    <span>{p.label}</span>
                    <ChevronRight size={13} className="text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {history.map((msg, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={idx} 
              className={cn(
                "flex gap-3 max-w-full",
                msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
              )}
            >
              <div className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-auto mb-1 text-xs",
                msg.role === 'user' ? "bg-black text-white" : "bg-white border border-black/5 text-zinc-900 shadow-xs"
              )}>
                {msg.role === 'user' ? <User size={13} /> : <Bot size={13} />}
              </div>
              
              <div className={cn(
                "rounded-3xl text-[13.5px] leading-relaxed max-w-[85%] font-medium",
                msg.role === 'user' 
                  ? "p-4 bg-black text-white rounded-br-[8px]" 
                  : msg.hasReport || msg.hasDashboard 
                    ? "p-0" 
                    : "p-4 bg-zinc-50/70 rounded-bl-[8px] text-zinc-800 border border-black/[0.04]"
              )}>
                {msg.role === 'model' && (msg.hasReport || msg.hasDashboard) ? (
                  <div className="flex flex-col gap-2.5 min-w-[200px]">
                    <div className="p-4 bg-white border border-black/5 rounded-3xl rounded-bl-[8px] shadow-xs flex flex-col gap-2">
                      <span className="font-bold text-[13.5px] text-zinc-900">
                        {msg.hasReport && msg.hasDashboard ? 'Laporan & Dashboard Siap Dihasilkan' : msg.hasReport ? 'Laporan Operasi Sedia Disemak' : 'Dashboard Operasi Sedia Disemak'}
                      </span>
                      {msg.latencyMs && (
                        <div className="text-emerald-700 flex items-center gap-1.5 text-[11px] font-mono">
                          <Activity size={12} className="text-emerald-500" /> Masa Tindak Balas: {(msg.latencyMs / 1000).toFixed(2)}s
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {msg.hasReport && (
                        <button 
                          onClick={() => setActiveTab('reports')}
                          className="bg-black text-white px-5 py-2.5 rounded-full font-bold w-max hover:bg-zinc-800 transition-colors text-[12px] shadow-xs flex items-center gap-1.5"
                        >
                          Lihat Laporan &rarr;
                        </button>
                      )}
                      {msg.hasDashboard && (
                        <button 
                          onClick={() => setActiveTab('dashboards')}
                          className="bg-black text-white px-5 py-2.5 rounded-full font-bold w-max hover:bg-zinc-800 transition-colors text-[12px] shadow-xs flex items-center gap-1.5"
                        >
                          Buka Dashboard &rarr;
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <>
                    <div className={cn("markdown-body", msg.role === 'user' ? "text-white" : "text-zinc-800")}>
                      <ReactMarkdown>{msg.parts?.map((p: any) => p.text || "").join("") || ""}</ReactMarkdown>
                    </div>

                    {/* CopilotKit Generative UI Cards */}
                    {msg.role === 'model' && msg.parts?.some((p: any) => p.text?.includes('Margin Guardian')) && (
                      <MarginGuardianGenUI 
                        data={{
                          contribution_rm: 7.45,
                          contribution_margin_pct: 25.04,
                          status: 'APPROVED_BY_MARGIN_GUARDIAN',
                          campaign_name: 'PADU15'
                        }} 
                        onFounderOverride={() => setActiveTab('margin')}
                      />
                    )}

                    {msg.role === 'model' && msg.parts?.some((p: any) => p.text?.includes('QC Botol Bocor')) && (
                      <QcBottleTriageGenUI 
                        data={{
                          complaint_id: 'QC-LEAK-2026-081',
                          risk_level: 'Medium',
                          suggested_action: 'Gantian Botol Baru Segera + Pengetatan Torque Penutup 2.5 N.m'
                        }}
                        onConfirmReplacement={() => setActiveTab('operations')}
                      />
                    )}

                    {msg.role === 'model' && msg.parts?.some((p: any) => p.text?.includes('Bas Ekspres')) && (
                      <BusConsignmentGenUI />
                    )}

                    {msg.role === 'model' && msg.latencyMs !== undefined && (
                      <div className="mt-3 pt-2.5 border-t border-black/[0.04] flex items-center justify-end text-emerald-700 text-[10px] font-mono">
                        <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <CheckCircle2 size={11} />
                          {(msg.latencyMs / 1000).toFixed(2)}s
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          ))}
          
          {isProcessing && streamingText && !isGeneratingWidget && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3 max-w-full"
            >
              <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-auto mb-1 bg-white border border-black/5 text-zinc-900 shadow-xs">
                <Bot size={13} />
              </div>
              <div className="p-4 rounded-3xl text-[13.5px] leading-relaxed max-w-[85%] font-medium bg-zinc-50/70 rounded-bl-[8px] border border-black/[0.04] text-zinc-800 opacity-80">
                <div className="markdown-body text-zinc-800">
                  <ReactMarkdown>{streamingText}</ReactMarkdown>
                </div>
              </div>
            </motion.div>
          )}

          {isProcessing && !streamingText && !isGeneratingWidget && (
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-white border border-black/5 text-zinc-900 shadow-xs flex items-center justify-center mt-auto mb-1">
                <Bot size={13} />
              </div>
              <div className="bg-zinc-50 px-4 py-3 rounded-2xl rounded-bl-[4px] border border-black/[0.04] flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 shrink-0 bg-white border-t border-black/[0.04]">
          <form onSubmit={handleSubmit} className="relative flex items-center bg-zinc-50 rounded-full border border-black/5 p-1.5 focus-within:ring-2 focus-within:ring-black/5 focus-within:border-black/10 transition-all">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tanya JEV AI atau masukkan arahan operasi..."
              disabled={isProcessing}
              className="flex-1 bg-transparent px-4 py-2 outline-none placeholder:text-zinc-400 text-zinc-900 text-[13.5px] font-medium"
            />
            <button 
              type="submit"
              disabled={!input.trim() || isProcessing}
              className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center disabled:opacity-50 transition-colors hover:bg-zinc-800 shrink-0"
            >
              {isProcessing ? <Loader2 size={15} className="animate-spin text-white" /> : <Send size={15} className="text-white" />}
            </button>
          </form>

          {/* Quick Prompts below input */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-2.5 pb-0.5">
            {samplePrompts.map((p, i) => (
              <button
                key={i}
                onClick={() => onSendMessage(p.query)}
                className="text-[11px] font-medium px-3 py-1 bg-zinc-50 hover:bg-zinc-100 text-zinc-600 rounded-full whitespace-nowrap transition-colors border border-black/[0.03]"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Mobile Bottom Navigation ---
const BottomNav = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (t: string) => void }) => {
  const menuItems = [
    { id: 'chat', label: 'Agent', icon: Bot },
    { id: 'operations', label: 'Operasi', icon: Package },
    { id: 'margin', label: 'Margin', icon: ShieldCheck },
    { id: 'orders', label: '5-State', icon: Database },
    { id: 'storefront', label: 'Kedai', icon: ShoppingBag },
    { id: 'tests', label: 'Ujian', icon: FileCheck2 },
  ];

  return (
    <div className="lg:hidden flex items-center justify-around bg-white border-t border-black/5 px-2 py-2 shrink-0">
      {menuItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveTab(item.id)}
          className={cn(
            "flex flex-col items-center gap-1 p-2 rounded-xl transition-all",
            activeTab === item.id 
              ? "text-black" 
              : "text-zinc-400 hover:text-zinc-600"
          )}
        >
          <item.icon size={18} strokeWidth={activeTab === item.id ? 2.5 : 2} />
          <span className="text-[10px] font-semibold">{item.label}</span>
        </button>
      ))}
    </div>
  );
};

// --- Main Application ---
export default function App() {
  const [activeTab, setActiveTab] = useState('chat');
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentTool, setCurrentTool] = useState<ToolCall | null>(null);
  const [agentSteps, setAgentSteps] = useState<AgentStep[]>([]);
  const [streamingText, setStreamingText] = useState("");
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSendMessage = async (msg: string) => {
    setIsProcessing(true);
    setStreamingText("");
    setAgentSteps([]);
    try {
      await sendMessageToAgentStream(history, msg, (data) => {
        if (data.isDone) {
          setHistory(data.history);
          setIsProcessing(false);
          setStreamingText("");
        } else {
          setHistory(data.history);
          setAgentSteps(data.steps);
          setStreamingText(data.currentText);
        }
      });
    } catch (e) {
      console.error(e);
      setIsProcessing(false);
    }
  };

  const handleAction = (msg?: string) => {
    setActiveTab('chat');
    if (msg) {
      handleSendMessage(msg);
    }
  };

  return (
    <CopilotProvider onNavigateTab={setActiveTab}>
      <div className="flex flex-col lg:flex-row h-screen font-sans text-zinc-900 bg-[#F4F4F5] overflow-hidden selection:bg-black selection:text-white">
        {/* Desktop Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        {/* Mobile Top Header */}
        <div className="lg:hidden flex items-center justify-between px-5 pt-4 pb-2 bg-white border-b border-black/5 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center font-bold text-sm">
              AC
            </div>
            <div>
              <h1 className="text-sm font-extrabold text-zinc-900 leading-tight">AbangColek GrowthOS</h1>
              <span className="text-[10px] text-zinc-400 font-mono">Blueprint v2.1 + CopilotKit</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCommandPaletteOpen(true)}
              className="p-1.5 rounded-lg bg-zinc-100 text-zinc-600 hover:text-black hover:bg-zinc-200"
              title="Carian Pantas (Cmd+K)"
            >
              <Search size={15} />
            </button>
            <div className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Rules Own Money
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col overflow-hidden relative p-3 md:p-5">
          {/* Top Status Indicators (Desktop) */}
          <div className="hidden lg:flex items-center justify-between pb-3 px-1 text-xs text-zinc-500 shrink-0">
            <div className="flex items-center gap-2 font-medium">
              <span className="font-bold text-zinc-900">AbangColek Sovereign GrowthOS</span>
              <span>&bull;</span>
              <span className="text-zinc-600">Zero-New-Paid-Cloud-Spend MVP</span>
              <span>&bull;</span>
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <ShieldCheck size={13} /> Rules Own The Money Active
              </span>
            </div>

            <div className="flex items-center gap-2.5 text-[11px]">
              {/* Quick Command Palette Button */}
              <button
                onClick={() => setIsCommandPaletteOpen(true)}
                className="flex items-center gap-2 bg-white hover:bg-zinc-100 text-zinc-600 hover:text-black px-3 py-1 rounded-full border border-black/10 shadow-xs transition-all font-medium cursor-pointer"
                title="Tekan ⌘K atau Ctrl+K"
              >
                <Search size={12} className="text-zinc-400" />
                <span>Carian & Arahan Pintar...</span>
                <kbd className="font-mono text-[9px] bg-zinc-100 text-zinc-500 px-1.5 py-0.5 rounded border border-black/5 font-semibold">
                  ⌘K
                </kbd>
              </button>

              <span className="bg-purple-50 text-purple-800 border border-purple-200 px-2.5 py-1 rounded-full flex items-center gap-1 font-semibold font-mono">
                <Sparkles size={11} className="text-purple-600" /> JEV Generative UI Active
              </span>
              <span className="bg-white border border-black/5 px-2.5 py-1 rounded-full text-zinc-600 font-mono">
                Hab: TBS &bull; KTN &bull; KMM &bull; DGN &bull; KBR
              </span>
            </div>
          </div>

          {/* Dynamic View Tab */}
          <div className="flex-1 min-h-0 overflow-y-auto relative">
            {activeTab === 'chat' && (
              <ChatInterface 
                history={history} 
                onSendMessage={handleSendMessage} 
                isProcessing={isProcessing}
                currentTool={currentTool}
                agentSteps={agentSteps}
                streamingText={streamingText}
                setActiveTab={setActiveTab}
              />
            )}
            {activeTab === 'operations' && <OperationsView onAskAgent={handleAction} />}
            {activeTab === 'margin' && <MarginGuardianView onAskAgent={handleAction} />}
            {activeTab === 'orders' && <OrdersView onAskAgent={handleAction} />}
            {activeTab === 'dealers' && <DealersView onAskAgent={handleAction} />}
            {activeTab === 'storefront' && <StorefrontView onAskAgent={handleAction} />}
            {activeTab === 'tests' && <AcceptanceTestsView onAskAgent={handleAction} />}
            {activeTab === 'dashboards' && <DashboardsView onAction={handleAction} />}
            {activeTab === 'reports' && <ReportsView onAction={handleAction} />}
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* CopilotKit Universal Floating Widget across all tabs */}
        <CopilotFloatingWidget currentTab={activeTab} onNavigateTab={setActiveTab} />

        {/* Global Command Palette (Cmd+K / Ctrl+K) */}
        <CommandPalette 
          isOpen={isCommandPaletteOpen}
          onClose={() => setIsCommandPaletteOpen(false)}
          onNavigateTab={setActiveTab}
          onTriggerAgentAction={handleAction}
        />
      </div>
    </CopilotProvider>
  );
}
