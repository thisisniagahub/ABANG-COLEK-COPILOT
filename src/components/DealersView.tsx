import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  RotateCcw, 
  ShieldCheck, 
  AlertOctagon, 
  DollarSign, 
  TrendingUp, 
  ArrowDownLeft, 
  ArrowUpRight,
  Sparkles,
  Link as LinkIcon
} from 'lucide-react';
import { growthOsStore } from '@/services/growthOsStore';
import { CommissionLedgerEntry } from '@/types/growthOs';

export const DealersView = ({ onAskAgent }: { onAskAgent: (q: string) => void }) => {
  const [commissions, setCommissions] = useState<CommissionLedgerEntry[]>(growthOsStore.getCommissions());
  const [selectedAgentId, setSelectedAgentId] = useState<string>('all');
  
  // Simulation for post-payout refund
  const [refundOrderId, setRefundOrderId] = useState<string>('ORD-AC-9102');
  const [refundNotice, setRefundNotice] = useState<string>('');

  useEffect(() => {
    return growthOsStore.subscribe(() => {
      setCommissions(growthOsStore.getCommissions());
    });
  }, []);

  const filteredEntries = selectedAgentId === 'all' 
    ? commissions 
    : commissions.filter(c => c.agentId === selectedAgentId);

  const totalEarned = filteredEntries
    .filter(c => c.type === 'commission_earned')
    .reduce((s, c) => s + c.amountRM, 0);

  const totalContra = filteredEntries
    .filter(c => c.type === 'contra_adjustment')
    .reduce((s, c) => s + c.amountRM, 0);

  const netBalance = totalEarned + totalContra;

  const handleSimulatePostPayoutRefund = () => {
    const res = growthOsStore.processRefundWithContra(refundOrderId, 36.00, 'Aduan botol bocor selepas komisen dikeluarkan');
    setRefundNotice(res.message);
    setTimeout(() => setRefundNotice(''), 6000);
  };

  return (
    <div className="h-full flex flex-col space-y-6 overflow-y-auto pr-1">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 border border-black/[0.06] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">
            <span className="text-emerald-700 font-bold">Two-Sided 1-Level Referral & Append-Only Ledger</span>
            <span>•</span>
            <span>Akta 500 Risk Control</span>
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Rangkaian Ejen & Lejar Komisen AbangColek</h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            Struktur 1-peringkat selamat (bukan piramid multi-tier). Lejar append-only dengan polisi pelarasan kontra negatif automatik sekiranya berlaku pemulangan wang pasca-bayaran.
          </p>
        </div>

        <button 
          onClick={() => onAskAgent("Audit lejar komisen ejen dan laporkan baki defisit kontra yang tertunggak.")}
          className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold rounded-full transition-all flex items-center gap-2 self-start md:self-auto"
        >
          <Sparkles size={14} /> Audit AI Lejar Komisen
        </button>
      </div>

      {refundNotice && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-purple-50 border border-purple-200 text-purple-900 text-xs p-4 rounded-2xl flex items-center gap-2"
        >
          <RotateCcw size={16} className="text-purple-600 shrink-0" />
          <span>{refundNotice}</span>
        </motion.div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-black/[0.06] shadow-sm">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">Jumlah Komisen Diperoleh</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold font-mono text-zinc-900">RM {totalEarned.toFixed(2)}</span>
            <span className="text-xs text-emerald-600 font-medium flex items-center gap-0.5">
              <ArrowUpRight size={14} /> append-only
            </span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-black/[0.06] shadow-sm">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">Pelarasan Kontra (Defisit Refund)</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold font-mono text-red-600">RM {totalContra.toFixed(2)}</span>
            <span className="text-xs text-red-500 font-medium flex items-center gap-0.5">
              <ArrowDownLeft size={14} /> kontra negatif
            </span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-black/[0.06] shadow-sm">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">Baki Bersih Semasa</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className={`text-2xl font-bold font-mono ${netBalance >= 0 ? 'text-zinc-900' : 'text-red-700'}`}>
              RM {netBalance.toFixed(2)}
            </span>
            <span className="text-xs text-zinc-500 font-medium">
              {netBalance >= 0 ? 'sedia ditolak payout' : 'defisit tertunggak'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Append-Only Commission Ledger (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-black/[0.06] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-zinc-900 text-base">Lejar Komisen Berstatus (Append-Only)</h3>
              <p className="text-xs text-zinc-500">Rekod sejarah asal tidak boleh disunting/dipadam. Rekod kontra negatif dicipta berasingan.</p>
            </div>

            <div className="flex items-center gap-2">
              <select 
                value={selectedAgentId} 
                onChange={e => setSelectedAgentId(e.target.value)}
                className="text-xs bg-zinc-50 border border-black/10 rounded-xl px-3 py-1.5 font-medium"
              >
                <option value="all">Semua Ejen / Stokis</option>
                <option value="AGT-001">Cikgu Wan (AGT-001)</option>
                <option value="AGT-002">Ustaz Hafiz (AGT-002)</option>
                <option value="AGT-003">Kak Siti (AGT-003)</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="text-[10px] uppercase tracking-wider text-zinc-400 border-b border-black/[0.04]">
                <tr>
                  <th className="py-2.5 px-2">ID & Tarikh</th>
                  <th className="py-2.5 px-2">Ejen / Stokis</th>
                  <th className="py-2.5 px-2">Jenis Entri</th>
                  <th className="py-2.5 px-2">Jumlah</th>
                  <th className="py-2.5 px-2">Status</th>
                  <th className="py-2.5 px-2">Sebab / Rujukan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.03]">
                {filteredEntries.map((c) => (
                  <tr key={c.id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="py-3 px-2 font-mono">
                      <span className="font-semibold text-zinc-900 block">{c.id}</span>
                      <span className="text-[10px] text-zinc-400">{c.createdAt.slice(0, 16).replace('T', ' ')}</span>
                    </td>
                    <td className="py-3 px-2">
                      <span className="font-medium text-zinc-800">{c.agentName}</span>
                      <span className="block text-[10px] font-mono text-zinc-400">{c.agentId}</span>
                    </td>
                    <td className="py-3 px-2">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        c.type === 'contra_adjustment' ? 'bg-red-100 text-red-800' :
                        c.type === 'commission_earned' ? 'bg-emerald-100 text-emerald-800' :
                        'bg-zinc-100 text-zinc-700'
                      }`}>
                        {c.type === 'contra_adjustment' ? 'Kontra Negatif' : 'Komisen Jualan'}
                      </span>
                    </td>
                    <td className="py-3 px-2 font-mono font-bold">
                      <span className={c.amountRM < 0 ? 'text-red-600' : 'text-emerald-700'}>
                        {c.amountRM >= 0 ? `+RM ${c.amountRM.toFixed(2)}` : `-RM ${Math.abs(c.amountRM).toFixed(2)}`}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        c.status === 'paid' ? 'bg-purple-100 text-purple-800' :
                        c.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                        c.status === 'eligible' ? 'bg-blue-100 text-blue-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-zinc-600 max-w-[220px]">
                      <span className="truncate block" title={c.reason}>{c.reason}</span>
                      {c.refPayoutId && <span className="text-[10px] text-purple-600 font-mono">Payout Ref: {c.refPayoutId}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Post-Payout Refund Policy Simulator & Fraud Scoring (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-black/[0.06] shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-zinc-900">
              <RotateCcw size={18} className="text-purple-700" />
              <h3 className="font-bold text-base">Ujian Polisi Post-Payout Refund (PAY-03)</h3>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Jika pelanggan meminta refund <i>selepas</i> komisen telah dibayar (`paid` ke akaun bank ejen), rekod asal kekal selamat dan sistem mencipta entri pelarasan kontra negatif automatik.
            </p>

            <div className="bg-zinc-50 p-4 rounded-2xl space-y-2 text-xs border border-black/[0.02]">
              <span className="font-semibold text-zinc-700 block">Pilih Pesanan Berkaitan:</span>
              <select 
                value={refundOrderId}
                onChange={e => setRefundOrderId(e.target.value)}
                className="w-full p-2 bg-white border border-black/10 rounded-xl font-mono text-xs"
              >
                <option value="ORD-AC-9102">ORD-AC-9102 (Rosmah Daud - RM 36.00)</option>
                <option value="ORD-AC-9145">ORD-AC-9145 (Ahmad Zaki - RM 44.00)</option>
              </select>
              <button
                onClick={handleSimulatePostPayoutRefund}
                className="w-full py-2.5 bg-black hover:bg-zinc-800 text-white rounded-xl font-semibold text-xs transition-all shadow-sm flex items-center justify-center gap-2 mt-2"
              >
                <RotateCcw size={14} /> Lakukan Refund & Jana Kontra
              </button>
            </div>
          </div>

          {/* Referral Risk Scoring Card */}
          <div className="bg-white rounded-3xl p-6 border border-black/[0.06] shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-emerald-700" />
              <h3 className="font-bold text-zinc-900 text-base">Kawalan Risiko Penipuan Rujukan</h3>
            </div>
            <p className="text-xs text-zinc-500">
              Skor risiko pelbagai isyarat (Multi-Signal Risk Scoring) mencegah sekatan salah atas Wi-Fi/IP kedai dikongsi sambil menepis percubaan rujukan diri sendiri.
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-50 border border-black/[0.02]">
                <span className="text-zinc-600">Pengesahan OTP Telefon Unik:</span>
                <span className="font-bold text-emerald-700">Wajib Dipenuhi</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-50 border border-black/[0.02]">
                <span className="text-zinc-600">Perkongsian IP / Wi-Fi:</span>
                <span className="font-bold text-zinc-800">Dibenarkan (Tanpa Sekatan Buta)</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-50 border border-black/[0.02]">
                <span className="text-zinc-600">Percubaan Akaun Sendiri (Self-Ref):</span>
                <span className="font-bold text-red-600">Disekat Automatik</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
