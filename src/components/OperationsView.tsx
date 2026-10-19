import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  Truck, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  DollarSign, 
  Plus, 
  ExternalLink,
  Clock,
  Sparkles,
  Search,
  Filter
} from 'lucide-react';
import { growthOsStore } from '@/services/growthOsStore';
import { ProductStockLot, BottleLeakComplaint, BusConsignment, KioskDayClose } from '@/types/growthOs';

export const OperationsView = ({ onAskAgent }: { onAskAgent: (query: string) => void }) => {
  const [activeSubTab, setActiveSubTab] = useState<'lots' | 'leaks' | 'bus' | 'dayclose'>('lots');
  const [lots, setLots] = useState<ProductStockLot[]>(growthOsStore.getLots());
  const [leaks, setLeaks] = useState<BottleLeakComplaint[]>(growthOsStore.getLeakComplaints());
  const [consignments, setConsignments] = useState<BusConsignment[]>(growthOsStore.getConsignments());
  const [dayCloses, setDayCloses] = useState<KioskDayClose[]>(growthOsStore.getDayCloses());

  // Day Close Form State
  const [showDayCloseModal, setShowDayCloseModal] = useState(false);
  const [kioskName, setKioskName] = useState('Kios AbangColek TBS Aras 2');
  const [openingFloat, setOpeningFloat] = useState(200);
  const [cashSales, setCashSales] = useState(1350);
  const [cardSales, setCardSales] = useState(1800);
  const [pettyExpenses, setPettyExpenses] = useState(30);
  const [physicalCash, setPhysicalCash] = useState(1520);
  const [supervisorName, setSupervisorName] = useState('Faizul Hakim');
  const [supervisorNotes, setSupervisorNotes] = useState('Jualan lancar waktu tengah hari.');

  useEffect(() => {
    return growthOsStore.subscribe(() => {
      setLots(growthOsStore.getLots());
      setLeaks(growthOsStore.getLeakComplaints());
      setConsignments(growthOsStore.getConsignments());
      setDayCloses(growthOsStore.getDayCloses());
    });
  }, []);

  const handleQuarantineLot = (lotNumber: string) => {
    const target = lots.find(l => l.lotNumber === lotNumber);
    if (target) {
      target.status = target.status === 'quarantined' ? 'active' : 'quarantined';
      target.qcNotes = target.status === 'quarantined' 
        ? 'Dikuarantin secara manual oleh penyelia operasi untuk semakan botol.'
        : 'Status dipulihkan ke aktif selepas semakan ujian seal lulus.';
      setLots([...lots]);
    }
  };

  const handleUpdateBusStatus = (consignmentNum: string, newStatus: BusConsignment['status']) => {
    growthOsStore.updateBusStatus(consignmentNum, newStatus, 'Staf Penerima Cawangan');
  };

  const handleSaveDayClose = (e: React.FormEvent) => {
    e.preventDefault();
    growthOsStore.submitKioskDayClose({
      kioskName,
      openingFloatRM: Number(openingFloat),
      systemCashSalesRM: Number(cashSales),
      systemCardFpxSalesRM: Number(cardSales),
      pettyExpensesRM: Number(pettyExpenses),
      physicalCashCountRM: Number(physicalCash),
      supervisorName,
      supervisorNotes
    });
    setShowDayCloseModal(false);
  };

  const expectedCash = openingFloat + cashSales - pettyExpenses;
  const currentVariance = physicalCash - expectedCash;

  return (
    <div className="h-full flex flex-col space-y-6 overflow-y-auto pr-1">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 border border-black/[0.06] shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">
            <span>Integriti Operasi Tempatan</span>
            <span>•</span>
            <span className="text-emerald-600 font-bold">FEFO & Express Bus Protocol Active</span>
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Pusat Kawalan Operasi AbangColek</h1>
          <p className="text-sm text-zinc-500 mt-0.5">Pengurusan lot inventori segar, protokol QC botol bocor, logistik bas ekspres Pantai Timur & rekonsiliasi tunai kios.</p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => onAskAgent("Siasat aduan QC botol bocor terkini dan rekod tindakan JEV triage")}
            className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold rounded-full transition-all flex items-center gap-1.5"
          >
            <Sparkles size={14} className="text-zinc-600" /> Triage AI Botol Bocor
          </button>
          <button 
            onClick={() => setShowDayCloseModal(true)}
            className="px-4 py-2 bg-black hover:bg-zinc-800 text-white text-xs font-semibold rounded-full transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Plus size={14} /> Tutup Buku Kios (Day-Close)
          </button>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-black/[0.06] pb-2">
        <button
          onClick={() => setActiveSubTab('lots')}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-2 ${
            activeSubTab === 'lots' ? 'bg-black text-white' : 'text-zinc-500 hover:bg-zinc-100'
          }`}
        >
          <Package size={14} /> Lot Stok & FEFO ({lots.length})
        </button>
        <button
          onClick={() => setActiveSubTab('leaks')}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-2 ${
            activeSubTab === 'leaks' ? 'bg-black text-white' : 'text-zinc-500 hover:bg-zinc-100'
          }`}
        >
          <AlertTriangle size={14} /> QC Botol Bocor ({leaks.length})
        </button>
        <button
          onClick={() => setActiveSubTab('bus')}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-2 ${
            activeSubTab === 'bus' ? 'bg-black text-white' : 'text-zinc-500 hover:bg-zinc-100'
          }`}
        >
          <Truck size={14} /> Logistik Bas Ekspres ({consignments.length})
        </button>
        <button
          onClick={() => setActiveSubTab('dayclose')}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-2 ${
            activeSubTab === 'dayclose' ? 'bg-black text-white' : 'text-zinc-500 hover:bg-zinc-100'
          }`}
        >
          <DollarSign size={14} /> Penutupan Harian Kios ({dayCloses.length})
        </button>
      </div>

      {/* LOTS / INVENTORY TAB */}
      {activeSubTab === 'lots' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lots.map((lot) => (
              <div 
                key={lot.lotNumber}
                className={`bg-white rounded-3xl p-5 border transition-all ${
                  lot.status === 'quarantined' 
                    ? 'border-amber-300 bg-amber-50/20' 
                    : 'border-black/[0.06] hover:shadow-md'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="text-[11px] font-mono font-semibold text-zinc-400 block">{lot.lotNumber}</span>
                    <h3 className="font-bold text-zinc-900 text-sm">{lot.productName}</h3>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                    lot.status === 'active' 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}>
                    {lot.status}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-zinc-600 mb-4">
                  <div className="flex justify-between py-0.5 border-b border-black/[0.03]">
                    <span className="text-zinc-400">Baki / Diperuntuk:</span>
                    <span className="font-semibold text-zinc-800">{lot.quantityUnits - lot.allocatedUnits} / {lot.quantityUnits} unit</span>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-black/[0.03]">
                    <span className="text-zinc-400">Tarikh Luput (FEFO):</span>
                    <span className="font-semibold text-zinc-900">{lot.expiryDate}</span>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-black/[0.03]">
                    <span className="text-zinc-400">Lokasi Simpanan:</span>
                    <span className="font-medium text-zinc-700 truncate max-w-[160px]">{lot.storageLocation}</span>
                  </div>
                  <div className="py-1">
                    <span className="text-zinc-400 block text-[10px] uppercase">Catatan QC:</span>
                    <p className="text-[11px] text-zinc-600 italic bg-zinc-50 p-2 rounded-xl mt-1 border border-black/[0.02]">{lot.qcNotes}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-black/[0.04] flex items-center justify-between">
                  <span className="text-[11px] text-zinc-400">Pemeriksa: {lot.inspectedBy}</span>
                  <button
                    onClick={() => handleQuarantineLot(lot.lotNumber)}
                    className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
                      lot.status === 'quarantined'
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                        : 'bg-zinc-100 hover:bg-amber-100 hover:text-amber-800 text-zinc-700'
                    }`}
                  >
                    {lot.status === 'quarantined' ? 'Batal Kuarantin' : 'Kuarantin Lot'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* QC LEAKS TAB */}
      {activeSubTab === 'leaks' && (
        <div className="space-y-4">
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex items-center gap-3 text-amber-900 text-xs">
            <ShieldAlert size={18} className="text-amber-600 shrink-0" />
            <div>
              <span className="font-bold">Protokol QC Botol Bocor AbangColek:</span> Semua aduan dikumpulkan mengikut jenis penutup (tamper seal, flip cap) dan kurier bas. JEV System-1 menjalankan triage awal sebelum gantian atau kuarantin lot dilakukan.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {leaks.map((complaint) => (
              <div key={complaint.id} className="bg-white rounded-3xl p-6 border border-black/[0.06] space-y-4 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-mono font-bold text-zinc-400">{complaint.id} • {complaint.complaintDate}</span>
                    <h3 className="font-bold text-zinc-900 text-base mt-0.5">{complaint.customerName}</h3>
                    <span className="text-xs text-zinc-500">Pesanan: {complaint.orderId} | Lot: {complaint.lotNumber}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                    complaint.status === 'replacement_approved' ? 'bg-emerald-100 text-emerald-800' :
                    complaint.status === 'lot_quarantine_triggered' ? 'bg-red-100 text-red-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {complaint.status.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-zinc-50 p-3 rounded-2xl border border-black/[0.03]">
                  <div>
                    <span className="text-zinc-400 block text-[10px]">Jenis Penutup:</span>
                    <span className="font-semibold text-zinc-800">{complaint.capType}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[10px]">Kurier / Laluan Bas:</span>
                    <span className="font-semibold text-zinc-800">{complaint.courierBus}</span>
                  </div>
                </div>

                <div className="text-xs text-zinc-700 bg-white border border-black/[0.04] p-3 rounded-2xl">
                  <span className="font-semibold text-zinc-400 text-[10px] uppercase block mb-1">Aduan Pelanggan:</span>
                  "{complaint.description}"
                </div>

                {complaint.jevTriageAssessment && (
                  <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-3.5 space-y-1 text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                      <Sparkles size={13} /> Penilaian JEV System-1 Triage ({complaint.jevTriageAssessment.riskLevel} Risk)
                    </div>
                    <p className="text-emerald-900 text-[11px] font-medium leading-relaxed">
                      {complaint.jevTriageAssessment.suggestedAction}
                    </p>
                    <p className="text-emerald-700 text-[10px] italic">
                      {complaint.jevTriageAssessment.reasoning}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-black/[0.04]">
                  <button 
                    onClick={() => onAskAgent(`Lakukan triage JEV untuk aduan ${complaint.id} berkenaan kerosakan penutup botol ${complaint.capType}`)}
                    className="text-xs font-semibold text-zinc-700 hover:text-black flex items-center gap-1 underline underline-offset-2"
                  >
                    Bincang dengan JEV AI &rarr;
                  </button>
                  <button 
                    onClick={() => {
                      growthOsStore.updateTriageAssessment(complaint.id, {
                        suggestedAction: 'Penggantian botol disahkan oleh penyelia operasi.',
                        riskLevel: 'Medium',
                        reasoning: 'Gantian botol segera disahkan.',
                        status: 'replacement_approved'
                      });
                    }}
                    className="text-xs bg-black hover:bg-zinc-800 text-white px-3 py-1.5 rounded-full font-medium"
                  >
                    Luluskan Gantian
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* EXPRESS BUS CONSIGNMENTS */}
      {activeSubTab === 'bus' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-black/[0.06] shadow-sm">
            <h3 className="font-bold text-zinc-900 text-base mb-1">Koridor Logistik Bas Ekspres Pantai Timur</h3>
            <p className="text-xs text-zinc-500 mb-4">Pengedaran pantas TBS Kuala Lumpur, Kuantan Sentral, Kemaman, Dungun, & Kota Bharu.</p>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="text-[10px] uppercase tracking-wider text-zinc-400 border-b border-black/[0.04]">
                  <tr>
                    <th className="py-3 px-2">No. Konsainan / Resit</th>
                    <th className="py-3 px-2">Syarikat Bas</th>
                    <th className="py-3 px-2">Laluan</th>
                    <th className="py-3 px-2">Kargo</th>
                    <th className="py-3 px-2">Status Semasa</th>
                    <th className="py-3 px-2">Penerima Cawangan</th>
                    <th className="py-3 px-2 text-right">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.03]">
                  {consignments.map((bus) => (
                    <tr key={bus.consignmentNumber} className="hover:bg-zinc-50/50 transition-colors">
                      <td className="py-3 px-2 font-mono">
                        <span className="font-bold text-zinc-900">{bus.consignmentNumber}</span>
                        <span className="block text-[10px] text-zinc-400">{bus.receiptSlipNo}</span>
                      </td>
                      <td className="py-3 px-2 font-semibold text-zinc-800">{bus.busLine}</td>
                      <td className="py-3 px-2">
                        <span className="font-medium text-zinc-700">{bus.origin} &rarr; {bus.destination}</span>
                        <span className="block text-[10px] text-zinc-400">Jangka tiba: {bus.estimatedArrival.replace('T', ' ').slice(0, 16)}</span>
                      </td>
                      <td className="py-3 px-2">
                        <span className="font-medium text-zinc-800">{bus.packageCount} bungkusan</span>
                        <span className="block text-[10px] text-zinc-400 truncate max-w-[140px]">{bus.cargoDescription}</span>
                      </td>
                      <td className="py-3 px-2">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          bus.status === 'arrived' ? 'bg-emerald-100 text-emerald-800' :
                          bus.status === 'in_transit' ? 'bg-blue-100 text-blue-800' :
                          bus.status === 'collected' ? 'bg-purple-100 text-purple-800' :
                          'bg-zinc-100 text-zinc-700'
                        }`}>
                          {bus.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <span className="font-medium text-zinc-800">{bus.branchReceiverName || 'Belum dituntut'}</span>
                        <span className="block text-[10px] text-zinc-400">{bus.receiverPhone || '-'}</span>
                      </td>
                      <td className="py-3 px-2 text-right space-x-1">
                        {bus.status === 'handed_over' && (
                          <button 
                            onClick={() => handleUpdateBusStatus(bus.consignmentNumber, 'in_transit')}
                            className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-[10px] font-semibold"
                          >
                            Set Transit
                          </button>
                        )}
                        {bus.status === 'in_transit' && (
                          <button 
                            onClick={() => handleUpdateBusStatus(bus.consignmentNumber, 'arrived')}
                            className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-[10px] font-semibold"
                          >
                            Tiba Hab
                          </button>
                        )}
                        {bus.status === 'arrived' && (
                          <button 
                            onClick={() => handleUpdateBusStatus(bus.consignmentNumber, 'collected')}
                            className="px-2 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg text-[10px] font-semibold"
                          >
                            Tuntut Kargo
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* DAY-CLOSE CASH RECONCILIATION */}
      {activeSubTab === 'dayclose' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dayCloses.map((dc) => (
              <div key={dc.id} className="bg-white rounded-3xl p-6 border border-black/[0.06] shadow-sm space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-mono text-zinc-400">{dc.id} • {dc.date}</span>
                    <h3 className="font-bold text-zinc-900 text-base">{dc.kioskName}</h3>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                    dc.status === 'balanced' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {dc.status.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs bg-zinc-50 p-4 rounded-2xl border border-black/[0.02]">
                  <div>
                    <span className="text-zinc-400 text-[10px] uppercase">Apungan Awal:</span>
                    <span className="font-bold text-zinc-800 block">RM {dc.openingFloatRM.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 text-[10px] uppercase">Jualan Tunai Sistem:</span>
                    <span className="font-bold text-zinc-800 block">RM {dc.systemCashSalesRM.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 text-[10px] uppercase">Belanja Runcit (Petty):</span>
                    <span className="font-bold text-red-600 block">-RM {dc.pettyExpensesRM.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 text-[10px] uppercase">Tunai Fizikal Laci:</span>
                    <span className="font-bold text-emerald-700 block">RM {dc.physicalCashCountRM.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-zinc-100/60 text-xs">
                  <span className="font-semibold text-zinc-700">Varians Tunai:</span>
                  <span className={`font-mono font-bold ${
                    dc.varianceRM === 0 ? 'text-emerald-700' : 'text-red-600'
                  }`}>
                    {dc.varianceRM >= 0 ? `+RM ${dc.varianceRM.toFixed(2)}` : `-RM ${Math.abs(dc.varianceRM).toFixed(2)}`}
                  </span>
                </div>

                <div className="text-[11px] text-zinc-500 pt-2 border-t border-black/[0.04]">
                  <span className="font-semibold text-zinc-700">Penyelia:</span> {dc.supervisorName} &bull; {dc.supervisorNotes}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DAY-CLOSE MODAL */}
      {showDayCloseModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-6 max-w-lg w-full border border-black/10 shadow-2xl space-y-4"
          >
            <div className="flex justify-between items-center border-b border-black/[0.06] pb-3">
              <h3 className="font-bold text-zinc-900 text-lg">Rekonsiliasi Tunai Kios (Day-Close)</h3>
              <button onClick={() => setShowDayCloseModal(false)} className="text-zinc-400 hover:text-black">&times;</button>
            </div>

            <form onSubmit={handleSaveDayClose} className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-500 font-semibold mb-1">Nama Kios / Cawangan</label>
                <input 
                  type="text" 
                  value={kioskName} 
                  onChange={e => setKioskName(e.target.value)} 
                  className="w-full px-3 py-2 bg-zinc-50 border border-black/10 rounded-xl"
                  required 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-500 font-semibold mb-1">Wang Apungan Awal (RM)</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    value={openingFloat} 
                    onChange={e => setOpeningFloat(Number(e.target.value))} 
                    className="w-full px-3 py-2 bg-zinc-50 border border-black/10 rounded-xl" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-zinc-500 font-semibold mb-1">Jualan Tunai Sistem (RM)</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    value={cashSales} 
                    onChange={e => setCashSales(Number(e.target.value))} 
                    className="w-full px-3 py-2 bg-zinc-50 border border-black/10 rounded-xl" 
                    required 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-500 font-semibold mb-1">Belanja Runcit / Ais (RM)</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    value={pettyExpenses} 
                    onChange={e => setPettyExpenses(Number(e.target.value))} 
                    className="w-full px-3 py-2 bg-zinc-50 border border-black/10 rounded-xl" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-zinc-500 font-semibold mb-1">Kiraan Tunai Fizikal Laci (RM)</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    value={physicalCash} 
                    onChange={e => setPhysicalCash(Number(e.target.value))} 
                    className="w-full px-3 py-2 bg-zinc-50 border border-black/10 rounded-xl" 
                    required 
                  />
                </div>
              </div>

              {/* Dynamic Calculation preview */}
              <div className="bg-zinc-100 p-3 rounded-2xl space-y-1">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Tunai Dijangka (Apungan + Jualan - Belanja):</span>
                  <span className="font-semibold text-zinc-800">RM {expectedCash.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Varians Bersih:</span>
                  <span className={Math.abs(currentVariance) < 0.05 ? 'text-emerald-600' : 'text-red-600'}>
                    {currentVariance >= 0 ? `+RM ${currentVariance.toFixed(2)}` : `-RM ${Math.abs(currentVariance).toFixed(2)}`}
                    {Math.abs(currentVariance) < 0.05 ? ' (Tepat / Balanced)' : ' (Varians Dikesan)'}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-zinc-500 font-semibold mb-1">Nama Penyelia Bertugas</label>
                <input 
                  type="text" 
                  value={supervisorName} 
                  onChange={e => setSupervisorName(e.target.value)} 
                  className="w-full px-3 py-2 bg-zinc-50 border border-black/10 rounded-xl" 
                  required 
                />
              </div>

              <div>
                <label className="block text-zinc-500 font-semibold mb-1">Catatan Pengesahan</label>
                <textarea 
                  value={supervisorNotes} 
                  onChange={e => setSupervisorNotes(e.target.value)} 
                  className="w-full px-3 py-2 bg-zinc-50 border border-black/10 rounded-xl" 
                  rows={2}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowDayCloseModal(false)}
                  className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-medium rounded-full"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-black hover:bg-zinc-800 text-white font-medium rounded-full shadow-sm"
                >
                  Sahkan & Simpan Rekonsiliasi
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
