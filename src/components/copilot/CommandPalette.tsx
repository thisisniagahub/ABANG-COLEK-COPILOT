import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Terminal, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  Package, 
  FileCheck2, 
  Sparkles, 
  X,
  Database,
  Users,
  ShoppingBag,
  BarChart3,
  FileText,
  AlertTriangle
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: string) => void;
  onTriggerAgentAction: (prompt: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  onTriggerAgentAction
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // open handled by parent
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions = [
    {
      id: 'tab-ops',
      title: 'Pusat Operasi Tempatan',
      subtitle: 'Inventori FEFO, QC botol bocor, bas ekspres & rekonsiliasi tunai',
      category: 'Navigasi',
      icon: Package,
      run: () => { onNavigateTab('operations'); onClose(); }
    },
    {
      id: 'tab-margin',
      title: 'Margin Guardian & Formula Semakan',
      subtitle: 'Kira sumbangan RM & % serta kelulusan Founder Override',
      category: 'Navigasi',
      icon: ShieldCheck,
      run: () => { onNavigateTab('margin'); onClose(); }
    },
    {
      id: 'tab-orders',
      title: 'Lejar & 5-State Machine',
      subtitle: 'Sahkan kitaran hayat pesanan, cubaan bayaran & token kriptografi',
      category: 'Navigasi',
      icon: Database,
      run: () => { onNavigateTab('orders'); onClose(); }
    },
    {
      id: 'tab-dealers',
      title: 'Ejen & Lejar Komisen Berstatus',
      subtitle: 'Append-only ledger, pelarasan kontra, dan pematuhan Akta 500',
      category: 'Navigasi',
      icon: Users,
      run: () => { onNavigateTab('dealers'); onClose(); }
    },
    {
      id: 'tab-storefront',
      title: 'Kedai Web PWA & Draf Luar Talian',
      subtitle: 'Simulasi pesanan no-download dan queue offline OFF-01',
      category: 'Navigasi',
      icon: ShoppingBag,
      run: () => { onNavigateTab('storefront'); onClose(); }
    },
    {
      id: 'tab-tests',
      title: 'Acceptance Test Suite v2.1',
      subtitle: 'Jalankan 14 ujian automatik FIN-01 hingga OPS-01',
      category: 'Integriti',
      icon: FileCheck2,
      run: () => { onNavigateTab('tests'); onClose(); }
    },
    {
      id: 'tab-dashboards',
      title: 'Dashboards & Analisis KPI',
      subtitle: 'Visualisasi hasil jualan, sumbangan margin dan hab operasi',
      category: 'Navigasi',
      icon: BarChart3,
      run: () => { onNavigateTab('dashboards'); onClose(); }
    },
    {
      id: 'tab-reports',
      title: 'Laporan Eksekutif',
      subtitle: 'Laporan tahunan dan unjuran strategik rantau Pantai Timur',
      category: 'Navigasi',
      icon: FileText,
      run: () => { onNavigateTab('reports'); onClose(); }
    },
    {
      id: 'act-padu15',
      title: 'Sahkan Baucar PADU15 (Margin Guardian)',
      subtitle: 'Pencetus JEV AI untuk semakan formula margin',
      category: 'Tindakan Pintar',
      icon: Sparkles,
      run: () => { 
        onTriggerAgentAction('Sahkan Margin Guardian untuk baucar PADU15 dengan anggaran bakul RM35 dan diskaun 15%'); 
        onClose(); 
      }
    },
    {
      id: 'act-leak-triage',
      title: 'Triage Aduan Botol Bocor QC-LEAK-2026-081',
      subtitle: 'Diagnosis risiko kerosakan kargo bas ekspres Transnasional',
      category: 'Tindakan Pintar',
      icon: AlertTriangle,
      run: () => { 
        onTriggerAgentAction('Lakukan triage JEV untuk aduan botol bocor QC-LEAK-2026-081 dari bas Transnasional TBS'); 
        onClose(); 
      }
    },
    {
      id: 'act-bus-tracking',
      title: 'Pantau Konsainan Bas Pantai Timur',
      subtitle: 'Kemaskini status laluan Kuantan Sentral &rarr; TBS KL',
      category: 'Tindakan Pintar',
      icon: Truck,
      run: () => { 
        onTriggerAgentAction('Pantau konsainan bas ekspres Pantai Timur ke TBS dan laporkan status terkini'); 
        onClose(); 
      }
    },
    {
      id: 'act-run-all-tests',
      title: 'Jalankan Semua Acceptance Tests v2.1',
      subtitle: 'Laksanakan ujian idempotensi bayaran, lejar kontra, dan keselamatan',
      category: 'Integriti',
      icon: Terminal,
      run: () => { 
        onTriggerAgentAction('Jalankan semua acceptance tests Blueprint v2.1 (FIN-01 hingga OPS-01) dan laporkan keputusannya'); 
        onClose(); 
      }
    }
  ];

  const filtered = actions.filter(a => 
    a.title.toLowerCase().includes(query.toLowerCase()) ||
    a.subtitle.toLowerCase().includes(query.toLowerCase()) ||
    a.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/40 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -10 }}
          transition={{ duration: 0.15 }}
          className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-black/10 overflow-hidden flex flex-col max-h-[75vh]"
        >
          {/* Search Header */}
          <div className="p-4 border-b border-black/[0.06] flex items-center gap-3 bg-zinc-50/50">
            <Search size={18} className="text-zinc-400 shrink-0" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Cari navigasi, arahan JEV AI, ujian integriti, atau kod operasi... (Esc untuk tutup)"
              className="flex-1 bg-transparent text-sm outline-none text-zinc-900 placeholder:text-zinc-400 font-medium"
            />
            {query && (
              <button 
                onClick={() => setQuery('')}
                className="w-5 h-5 rounded-full bg-zinc-200 text-zinc-600 flex items-center justify-center hover:bg-zinc-300"
              >
                <X size={12} />
              </button>
            )}
            <kbd className="hidden sm:inline-block text-[10px] font-mono bg-zinc-200/80 px-2 py-0.5 rounded text-zinc-600 font-bold">
              ESC
            </kbd>
          </div>

          {/* Results List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            {filtered.length === 0 ? (
              <div className="text-center py-12 text-zinc-400 space-y-2">
                <Search size={28} className="mx-auto text-zinc-300" />
                <p className="text-xs font-semibold text-zinc-600">Tiada padanan dijumpai untuk "{query}"</p>
                <p className="text-[11px] text-zinc-400">Cuba cari "margin", "bas", "ujian", "kios", atau "botol".</p>
              </div>
            ) : (
              filtered.map((item) => (
                <button
                  key={item.id}
                  onClick={item.run}
                  className="w-full text-left p-3 rounded-2xl hover:bg-zinc-100 flex items-center justify-between group transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-zinc-100 group-hover:bg-white flex items-center justify-center text-zinc-700 shadow-xs shrink-0 transition-colors">
                      <item.icon size={15} />
                    </div>
                    <div className="truncate">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-zinc-900 group-hover:text-black">
                          {item.title}
                        </span>
                        <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-zinc-100 text-zinc-500">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-500 truncate mt-0.5">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                  <ArrowRight size={14} className="text-zinc-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                </button>
              ))
            )}
          </div>

          {/* Footer Shortcuts */}
          <div className="p-3 bg-zinc-50 border-t border-black/[0.05] flex items-center justify-between text-[11px] text-zinc-500">
            <span className="flex items-center gap-1.5">
              <Sparkles size={12} className="text-purple-600" /> AbangColek Sovereign GrowthOS Command Bar
            </span>
            <div className="flex items-center gap-3">
              <span>Navigasi Pantas</span>
              <span className="font-mono bg-zinc-200 px-1.5 py-0.5 rounded text-[10px]">↵ Pilih</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
