import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Truck, 
  DollarSign, 
  FileCheck2, 
  Unlock, 
  Brain, 
  Layers,
  Sparkles,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { growthOsStore } from '@/services/growthOsStore';

/**
 * Generative UI: Margin Guardian Interactive Card with HITL Founder Override
 */
export const MarginGuardianGenUI = ({ 
  data, 
  onFounderOverride 
}: { 
  data: any; 
  onFounderOverride?: (campaignName: string) => void;
}) => {
  const [overrideReason, setOverrideReason] = useState('');
  const [showOverrideInput, setShowOverrideInput] = useState(false);
  const [isOverridden, setIsOverridden] = useState(data.status === 'APPROVED_BY_MARGIN_GUARDIAN');

  const isApproved = data.status === 'APPROVED_BY_MARGIN_GUARDIAN' || isOverridden;

  const handleApprove = () => {
    if (onFounderOverride) {
      onFounderOverride(data.campaign_name || 'PADU15');
    }
    growthOsStore.setFounderOverride('CAMP-MERDEKA-COLEK', overrideReason || 'Kelulusan Khas Human-In-The-Loop');
    setIsOverridden(true);
    setShowOverrideInput(false);
  };

  return (
    <div className="bg-white rounded-3xl p-5 border border-black/[0.08] shadow-md my-2 space-y-3 max-w-md">
      <div className="flex items-center justify-between border-b border-black/[0.05] pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-black text-white flex items-center justify-center">
            <ShieldCheck size={14} />
          </div>
          <div>
            <h4 className="font-bold text-zinc-900 text-xs">Margin Guardian Gen-UI</h4>
            <span className="text-[10px] text-zinc-400 font-mono">Rules Own The Money</span>
          </div>
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
          isApproved ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
        }`}>
          {isApproved ? 'LULUS (Passed)' : 'DISEKAT (Blocked)'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs bg-zinc-50 p-3 rounded-2xl">
        <div>
          <span className="text-zinc-400 text-[10px] uppercase font-bold block">Sumbangan Bersih</span>
          <span className="text-base font-bold font-mono text-zinc-900">
            RM {Number(data.contribution_rm || 7.45).toFixed(2)}
          </span>
          <span className="text-[9px] text-zinc-400 block">Min: RM {data.thresholds?.min_contribution_rm || '4.00'}</span>
        </div>
        <div>
          <span className="text-zinc-400 text-[10px] uppercase font-bold block">Margin Sumbangan</span>
          <span className="text-base font-bold font-mono text-emerald-700">
            {Number(data.contribution_margin_pct || 25.04).toFixed(1)}%
          </span>
          <span className="text-[9px] text-zinc-400 block">Min: {data.thresholds?.min_contribution_margin_pct || '20.0'}%</span>
        </div>
      </div>

      <p className="text-[11px] text-zinc-600 leading-relaxed italic">
        "{data.recommendation || 'Kempen selamat dilancarkan dengan margin sumbangan positif.'}"
      </p>

      {/* Human in the loop section */}
      {!isApproved && !isOverridden && (
        <div className="pt-2 border-t border-black/[0.05] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-red-600 font-bold text-[11px]">Sub-margin Tersekat</span>
            <button
              onClick={() => setShowOverrideInput(!showOverrideInput)}
              className="text-xs text-purple-700 font-semibold hover:underline flex items-center gap-1"
            >
              <Unlock size={12} /> Buka Founder Override (HITL)
            </button>
          </div>

          {showOverrideInput && (
            <div className="space-y-2 pt-1">
              <input
                type="text"
                placeholder="Catatan alasan strategik Founder..."
                value={overrideReason}
                onChange={e => setOverrideReason(e.target.value)}
                className="w-full text-xs p-2 bg-zinc-50 border border-black/10 rounded-xl"
              />
              <button
                onClick={handleApprove}
                className="w-full py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-semibold"
              >
                Tandatangan & Luluskan Sekarang (HITL)
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * Generative UI: QC Bottle Triage with HITL Action
 */
export const QcBottleTriageGenUI = ({ 
  data, 
  onConfirmReplacement 
}: { 
  data: any; 
  onConfirmReplacement?: (complaintId: string) => void;
}) => {
  const [approved, setApproved] = useState(false);

  const handleApprove = () => {
    setApproved(true);
    if (onConfirmReplacement) onConfirmReplacement(data.complaint_id || 'QC-LEAK-2026-081');
  };

  return (
    <div className="bg-white rounded-3xl p-5 border border-black/[0.08] shadow-md my-2 space-y-3 max-w-md">
      <div className="flex items-center justify-between border-b border-black/[0.05] pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-amber-500 text-white flex items-center justify-center">
            <AlertTriangle size={14} />
          </div>
          <div>
            <h4 className="font-bold text-zinc-900 text-xs">JEV QC Triage Card</h4>
            <span className="text-[10px] text-zinc-400 font-mono">{data.complaint_id || 'QC-LEAK-2026-081'}</span>
          </div>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 uppercase">
          {data.risk_level || 'Medium'} Risk
        </span>
      </div>

      <div className="text-xs text-zinc-700 bg-zinc-50 p-3 rounded-2xl space-y-1">
        <span className="text-[10px] uppercase font-bold text-zinc-400 block">Tindakan Disyorkan:</span>
        <p className="font-semibold text-zinc-900">{data.suggested_action || 'Gantian Botol Baru Segera + Pengetatan Torque Penutup 2.5 N.m'}</p>
        <p className="text-[11px] text-zinc-500 pt-1 leading-relaxed">{data.triage_reasoning || 'Gegaran kargo bas ekspres menyebabkan sedikit lelehan.'}</p>
      </div>

      {/* Human in the loop action */}
      <div className="pt-2 border-t border-black/[0.05] flex items-center justify-between">
        <span className="text-[10px] text-zinc-400 font-mono">
          {approved ? 'Pengesahan Manusia Selesai ✅' : 'Perlu Kelulusan Penyelia (HITL)'}
        </span>
        {!approved ? (
          <button
            onClick={handleApprove}
            className="px-3.5 py-1.5 bg-black hover:bg-zinc-800 text-white text-xs font-semibold rounded-full shadow-xs"
          >
            Luluskan Gantian Botol
          </button>
        ) : (
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            Gantian Diluluskan
          </span>
        )}
      </div>
    </div>
  );
};

/**
 * Generative UI: Bus Consignment Route Card
 */
export const BusConsignmentGenUI = ({ 
  consignments 
}: { 
  consignments?: any[];
}) => {
  return (
    <div className="bg-white rounded-3xl p-5 border border-black/[0.08] shadow-md my-2 space-y-3 max-w-md">
      <div className="flex items-center gap-2 border-b border-black/[0.05] pb-2.5">
        <div className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center">
          <Truck size={14} />
        </div>
        <div>
          <h4 className="font-bold text-zinc-900 text-xs">Koridor Bas Ekspres Pantai Timur</h4>
          <span className="text-[10px] text-zinc-400 font-mono">Live Consignment Tracking</span>
        </div>
      </div>

      <div className="space-y-2 text-xs">
        <div className="p-3 bg-zinc-50 rounded-2xl flex items-center justify-between">
          <div>
            <span className="font-bold text-zinc-900 block">BUS-EC-20261018-01</span>
            <span className="text-[10px] text-zinc-500">Kuantan Sentral &rarr; TBS Kuala Lumpur</span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
            In Transit (12:45 PM)
          </span>
        </div>

        <div className="p-3 bg-zinc-50 rounded-2xl flex items-center justify-between">
          <div>
            <span className="font-bold text-zinc-900 block">BUS-EC-20261017-04</span>
            <span className="text-[10px] text-zinc-500">Kuantan &rarr; Kota Bharu Terminal</span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
            Tiba di Hab (Arrived)
          </span>
        </div>
      </div>
    </div>
  );
};

/**
 * Generative UI: Automatic Learning / Copilot Context Memory Card
 */
export const AutomaticLearningCard = ({ 
  memory 
}: { 
  memory: Record<string, any>;
}) => {
  return (
    <div className="bg-zinc-900 text-white rounded-3xl p-5 shadow-lg my-2 space-y-3 max-w-md border border-zinc-800">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
        <div className="flex items-center gap-2">
          <Brain size={16} className="text-purple-400" />
          <h4 className="font-bold text-xs tracking-tight">Copilot Automatic Learning (Memory Store)</h4>
        </div>
        <span className="text-[9px] font-mono bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full font-bold">
          Persistent Context
        </span>
      </div>

      <p className="text-[11px] text-zinc-300 leading-relaxed">
        Copilot telah mempelajari konteks operasi anda secara automatik untuk mempercepatkan cadangan tanpa perlu menaip prompt panjang:
      </p>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="p-2.5 rounded-xl bg-zinc-800/80 border border-zinc-700/50">
          <span className="text-[10px] text-zinc-400 uppercase font-mono block">Hab Kerap Digunakan:</span>
          <span className="font-bold text-zinc-100">{memory.preferredHub || 'TBS Kuala Lumpur'}</span>
        </div>
        <div className="p-2.5 rounded-xl bg-zinc-800/80 border border-zinc-700/50">
          <span className="text-[10px] text-zinc-400 uppercase font-mono block">Baucar Utama:</span>
          <span className="font-bold text-zinc-100">{memory.frequentVoucher || 'PADU15'}</span>
        </div>
        <div className="p-2.5 rounded-xl bg-zinc-800/80 border border-zinc-700/50">
          <span className="text-[10px] text-zinc-400 uppercase font-mono block">Lot Terakhir:</span>
          <span className="font-bold text-zinc-100 truncate block">{memory.lastInspectedLot || 'AC-LOT-202610-K01'}</span>
        </div>
        <div className="p-2.5 rounded-xl bg-zinc-800/80 border border-zinc-700/50">
          <span className="text-[10px] text-zinc-400 uppercase font-mono block">Audit Dilengkapkan:</span>
          <span className="font-bold text-emerald-400">{memory.totalAuditsCompleted || 14} Ujian</span>
        </div>
      </div>
    </div>
  );
};
