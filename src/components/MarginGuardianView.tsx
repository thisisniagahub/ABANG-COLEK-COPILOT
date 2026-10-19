import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Lock, 
  Unlock, 
  Sparkles,
  Calculator,
  Info
} from 'lucide-react';
import { growthOsStore } from '@/services/growthOsStore';
import { CampaignMarginRule } from '@/types/growthOs';

export const MarginGuardianView = ({ onAskAgent }: { onAskAgent: (q: string) => void }) => {
  const [campaigns, setCampaigns] = useState<CampaignMarginRule[]>(growthOsStore.getCampaigns());
  
  // Interactive Simulator State
  const [grossSpend, setGrossSpend] = useState<number>(35.00);
  const [discountPct, setDiscountPct] = useState<number>(20);
  const [cogs, setCogs] = useState<number>(11.20);
  const [packaging, setPackaging] = useState<number>(2.10);
  const [paymentFee, setPaymentFee] = useState<number>(0.95);
  const [fulfilment, setFulfilment] = useState<number>(2.50);
  const [deliverySubsidy, setDeliverySubsidy] = useState<number>(2.50);
  const [agentCommission, setAgentCommission] = useState<number>(3.50);
  const [rewardCost, setRewardCost] = useState<number>(0.80);
  const [expectedReturnLoss, setExpectedReturnLoss] = useState<number>(0.45);

  const [minContributionRM, setMinContributionRM] = useState<number>(4.00);
  const [minContributionMarginPct, setMinContributionMarginPct] = useState<number>(20.0);

  // Founder Override modal
  const [selectedCampaignForOverride, setSelectedCampaignForOverride] = useState<CampaignMarginRule | null>(null);
  const [overrideReason, setOverrideReason] = useState<string>('');
  const [founderName, setFounderName] = useState<string>('Founder AbangColek');

  useEffect(() => {
    return growthOsStore.subscribe(() => {
      setCampaigns(growthOsStore.getCampaigns());
    });
  }, []);

  // Compute live simulator numbers
  const netSalesExTax = Number((grossSpend * (1 - discountPct / 100)).toFixed(2));
  const simMetrics = growthOsStore.calculateContribution({
    netSalesExTax,
    cogs,
    packagingCost: packaging,
    paymentFees: paymentFee,
    fulfilmentCost: fulfilment,
    deliverySubsidy,
    agentCommission,
    rewardCost,
    expectedReturnLoss
  });

  const passesRM = simMetrics.contribution_rm >= minContributionRM;
  const passesPct = simMetrics.contribution_margin_pct >= minContributionMarginPct;
  const isApproved = passesRM && passesPct;

  const handleApplyOverride = () => {
    if (selectedCampaignForOverride && overrideReason) {
      growthOsStore.setFounderOverride(selectedCampaignForOverride.id, overrideReason, founderName);
      setSelectedCampaignForOverride(null);
      setOverrideReason('');
    }
  };

  return (
    <div className="h-full flex flex-col space-y-6 overflow-y-auto pr-1">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-black/[0.06] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">
            <span className="text-emerald-700 font-bold">Rules Own The Money</span>
            <span>•</span>
            <span>Blueprint Section 3.1</span>
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Margin Guardian AbangColek</h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            Pemisahan ketat Sumbangan Margin (RM) dan Peratus (%). Sebarang diskaun atau kempen disekat automatik jika merugikan margin sumbangan.
          </p>
        </div>

        <button 
          onClick={() => onAskAgent("Lakukan audit Margin Guardian untuk semua kempen aktif dan sahkan integriti formula kewangan.")}
          className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold rounded-full transition-all flex items-center gap-2 self-start md:self-auto"
        >
          <Sparkles size={14} /> Audit AI Margin Guardian
        </button>
      </div>

      {/* Info Callout */}
      <div className="bg-zinc-50 rounded-2xl p-4 border border-black/[0.04] text-xs text-zinc-600 flex items-start gap-3">
        <Info size={16} className="text-zinc-500 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-zinc-800">Definisi Rasmi:</span> Metrik ini dinamakan <span className="font-semibold text-zinc-900">Sumbangan Margin (Contribution Margin)</span>, bukan "Untung Bersih", kerana kos operasi tetap, sewa kios, gaji pentadbiran, dan cukai syarikat belum ditolak.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Margin Simulator (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-black/[0.06] shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calculator size={18} className="text-zinc-700" />
              <h2 className="font-bold text-zinc-900 text-base">Simulasi Margin Interaktif</h2>
            </div>
            <span className="text-xs font-mono text-zinc-400">Formula Deterministik</span>
          </div>

          {/* Result Card */}
          <div className={`rounded-2xl p-5 border transition-all ${
            isApproved 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-950'
              : 'bg-red-500/10 border-red-500/30 text-red-950'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {isApproved ? (
                  <CheckCircle2 size={20} className="text-emerald-600" />
                ) : (
                  <XCircle size={20} className="text-red-600" />
                )}
                <span className="font-bold text-sm tracking-tight">
                  {isApproved ? 'KEMPEN DILULUSKAN OLEH MARGIN GUARDIAN' : 'DISEKAT SECARA AUTOMATIK: SUB-MARGIN'}
                </span>
              </div>
              <span className="text-[11px] font-mono font-bold">
                {isApproved ? 'Aman Dilancarkan' : 'Perlu Kelulusan Founder'}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center pt-2 border-t border-black/[0.05]">
              <div>
                <span className="text-[10px] uppercase font-bold text-zinc-500 block">Jualan Bersih</span>
                <span className="text-lg font-bold font-mono text-zinc-900">RM {netSalesExTax.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-zinc-500 block">Jumlah Tolakan</span>
                <span className="text-lg font-bold font-mono text-zinc-700">RM {simMetrics.totalDeductions.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-zinc-500 block">Sumbangan RM</span>
                <span className={`text-lg font-bold font-mono ${passesRM ? 'text-emerald-700' : 'text-red-600'}`}>
                  RM {simMetrics.contribution_rm.toFixed(2)}
                </span>
                <span className="text-[9px] text-zinc-400 block">Min: RM {minContributionRM.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-zinc-500 block">Margin %</span>
                <span className={`text-lg font-bold font-mono ${passesPct ? 'text-emerald-700' : 'text-red-600'}`}>
                  {simMetrics.contribution_margin_pct}%
                </span>
                <span className="text-[9px] text-zinc-400 block">Min: {minContributionMarginPct}%</span>
              </div>
            </div>
          </div>

          {/* Sliders & Inputs */}
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span className="text-zinc-600">Harga Bakul Kasar Pelanggan:</span>
                  <span className="font-mono text-zinc-900">RM {grossSpend.toFixed(2)}</span>
                </div>
                <input 
                  type="range" 
                  min="15" 
                  max="120" 
                  step="1" 
                  value={grossSpend}
                  onChange={e => setGrossSpend(Number(e.target.value))}
                  className="w-full accent-black cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span className="text-zinc-600">Kadar Diskaun Promosi:</span>
                  <span className="font-mono text-zinc-900">{discountPct}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="60" 
                  step="5" 
                  value={discountPct}
                  onChange={e => setDiscountPct(Number(e.target.value))}
                  className="w-full accent-black cursor-pointer"
                />
              </div>
            </div>

            {/* Variable Costs Grid */}
            <div className="pt-2 border-t border-black/[0.04]">
              <span className="font-bold text-zinc-400 text-[10px] uppercase tracking-wider block mb-2">Komponen Kos Boleh Ubah (RM):</span>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="text-[11px] text-zinc-500 block mb-0.5">COGS Bahan Mentah</label>
                  <input 
                    type="number" 
                    step="0.1" 
                    value={cogs} 
                    onChange={e => setCogs(Number(e.target.value))} 
                    className="w-full px-2.5 py-1.5 bg-zinc-50 border border-black/10 rounded-xl font-mono text-xs" 
                  />
                </div>
                <div>
                  <label className="text-[11px] text-zinc-500 block mb-0.5">Pembungkusan/Botol</label>
                  <input 
                    type="number" 
                    step="0.1" 
                    value={packaging} 
                    onChange={e => setPackaging(Number(e.target.value))} 
                    className="w-full px-2.5 py-1.5 bg-zinc-50 border border-black/10 rounded-xl font-mono text-xs" 
                  />
                </div>
                <div>
                  <label className="text-[11px] text-zinc-500 block mb-0.5">Subsidi Penghantaran</label>
                  <input 
                    type="number" 
                    step="0.5" 
                    value={deliverySubsidy} 
                    onChange={e => setDeliverySubsidy(Number(e.target.value))} 
                    className="w-full px-2.5 py-1.5 bg-zinc-50 border border-black/10 rounded-xl font-mono text-xs" 
                  />
                </div>
                <div>
                  <label className="text-[11px] text-zinc-500 block mb-0.5">Komisen Ejen</label>
                  <input 
                    type="number" 
                    step="0.5" 
                    value={agentCommission} 
                    onChange={e => setAgentCommission(Number(e.target.value))} 
                    className="w-full px-2.5 py-1.5 bg-zinc-50 border border-black/10 rounded-xl font-mono text-xs" 
                  />
                </div>
              </div>
            </div>

            {/* Threshold Settings */}
            <div className="pt-2 border-t border-black/[0.04] grid grid-cols-2 gap-3 bg-zinc-50 p-3 rounded-2xl">
              <div>
                <label className="text-[10px] uppercase font-bold text-zinc-500 block">Had Min Sumbangan RM</label>
                <input 
                  type="number" 
                  step="0.5" 
                  value={minContributionRM} 
                  onChange={e => setMinContributionRM(Number(e.target.value))} 
                  className="w-full px-2.5 py-1.5 bg-white border border-black/10 rounded-xl font-mono text-xs mt-1" 
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-zinc-500 block">Had Min Margin %</label>
                <input 
                  type="number" 
                  step="1" 
                  value={minContributionMarginPct} 
                  onChange={e => setMinContributionMarginPct(Number(e.target.value))} 
                  className="w-full px-2.5 py-1.5 bg-white border border-black/10 rounded-xl font-mono text-xs mt-1" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Pre-configured Campaigns & Override (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-black/[0.06] shadow-sm space-y-4">
            <h3 className="font-bold text-zinc-900 text-base">Senarai Kempen & Status Pengesahan</h3>
            <p className="text-xs text-zinc-500">Setiap baucar disahkan deterministik sebelum pesanan boleh dibuat di kedai web.</p>

            <div className="space-y-3">
              {campaigns.map((camp) => {
                const validation = growthOsStore.validateCampaignMargin(camp, 30.00);
                return (
                  <div 
                    key={camp.id}
                    className={`p-4 rounded-2xl border space-y-2 transition-all ${
                      camp.status === 'founder_override_active'
                        ? 'border-purple-300 bg-purple-50/30'
                        : camp.status === 'blocked_by_margin_guardian'
                        ? 'border-red-200 bg-red-50/20'
                        : 'border-black/[0.06] bg-zinc-50/50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-mono text-[10px] font-bold text-zinc-400 block">{camp.voucherCode}</span>
                        <h4 className="font-bold text-zinc-900 text-xs">{camp.campaignName}</h4>
                      </div>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        camp.status === 'founder_override_active' ? 'bg-purple-100 text-purple-800' :
                        camp.status === 'blocked_by_margin_guardian' ? 'bg-red-100 text-red-800' :
                        'bg-emerald-100 text-emerald-800'
                      }`}>
                        {camp.status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <div className="flex justify-between text-[11px] text-zinc-600 bg-white p-2 rounded-xl border border-black/[0.03]">
                      <span>Diskaun: <b>{camp.discountPct}%</b> (Min RM {camp.minSpendRM})</span>
                      <span>Sumbangan: <b>RM {validation.metrics.contribution_rm} ({validation.metrics.contribution_margin_pct}%)</b></span>
                    </div>

                    {camp.status === 'founder_override_active' && (
                      <div className="text-[10px] text-purple-900 bg-purple-100/60 p-2 rounded-xl">
                        <span className="font-bold">Kelulusan Khas Pengasas:</span> "{camp.founderOverrideReason}" ({camp.founderOverrideBy})
                      </div>
                    )}

                    <div className="pt-2 flex justify-between items-center text-xs">
                      <span className="text-[10px] text-zinc-400">
                        {validation.allowed ? 'Lulus syarat' : 'Disekat sistem'}
                      </span>
                      {camp.status === 'blocked_by_margin_guardian' && (
                        <button
                          onClick={() => setSelectedCampaignForOverride(camp)}
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-[10px] font-semibold rounded-full flex items-center gap-1 shadow-sm"
                        >
                          <Unlock size={11} /> Founder Override
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Founder Override Modal */}
      {selectedCampaignForOverride && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-6 max-w-md w-full border border-black/10 shadow-2xl space-y-4"
          >
            <div className="flex items-center gap-2 text-purple-800">
              <Unlock size={20} />
              <h3 className="font-bold text-zinc-900 text-lg">Kelulusan Khas Pengasas (Founder Override)</h3>
            </div>
            <p className="text-xs text-zinc-500">
              Prinsip <b>Rules Own The Money</b>: Pengecualian kempen sub-margin hanya dibenarkan dengan kelulusan eksplisit Pengasas dan catatan alasan wajib yang direkodkan ke lejar audit kekal.
            </p>

            <div className="bg-zinc-50 p-3 rounded-2xl text-xs space-y-1">
              <div><b>Kempen:</b> {selectedCampaignForOverride.campaignName}</div>
              <div><b>Kod Baucar:</b> {selectedCampaignForOverride.voucherCode}</div>
              <div><b>Kadar Diskaun:</b> {selectedCampaignForOverride.discountPct}%</div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">Nama Pengasas</label>
              <input 
                type="text" 
                value={founderName} 
                onChange={e => setFounderName(e.target.value)} 
                className="w-full px-3 py-2 bg-zinc-50 border border-black/10 rounded-xl text-xs font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">Catatan Alasan Strategik (Audit Log)</label>
              <textarea 
                value={overrideReason} 
                onChange={e => setOverrideReason(e.target.value)} 
                placeholder="Contoh: Kempen penembusan pasaran Kuantan Sentral selama 48 jam; ditampung daripada belanjawan kesedaran jenama..."
                rows={3} 
                className="w-full px-3 py-2 bg-zinc-50 border border-black/10 rounded-xl text-xs"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button 
                onClick={() => setSelectedCampaignForOverride(null)}
                className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-medium rounded-full"
              >
                Batal
              </button>
              <button 
                onClick={handleApplyOverride}
                disabled={!overrideReason.trim()}
                className="px-5 py-2 bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white text-xs font-semibold rounded-full shadow-sm"
              >
                Tandatangan & Buka Sekatan
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
