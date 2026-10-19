import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Database, 
  Search, 
  ExternalLink, 
  ShieldCheck, 
  Key, 
  Truck, 
  CreditCard, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { growthOsStore } from '@/services/growthOsStore';
import { AbangColekOrder, OrderState, PaymentAttemptState, RefundLifecycleState, FulfilmentConsignmentState } from '@/types/growthOs';

export const OrdersView = ({ onAskAgent }: { onAskAgent: (q: string) => void }) => {
  const [orders, setOrders] = useState<AbangColekOrder[]>(growthOsStore.getOrders());
  const [selectedOrder, setSelectedOrder] = useState<AbangColekOrder | null>(null);
  const [showTrackingModal, setShowTrackingModal] = useState<boolean>(false);
  const [activeTrackingToken, setActiveTrackingToken] = useState<string>('');

  useEffect(() => {
    return growthOsStore.subscribe(() => {
      setOrders(growthOsStore.getOrders());
    });
  }, []);

  const handleOpenTracking = (order: AbangColekOrder) => {
    setActiveTrackingToken(order.trackingToken);
    setShowTrackingModal(true);
  };

  const handleUpdateState = (orderId: string, updates: any) => {
    growthOsStore.updateOrderStates(orderId, updates);
  };

  const redactedTrackingData = activeTrackingToken 
    ? growthOsStore.getRedactedTrackingInfo(activeTrackingToken)
    : null;

  return (
    <div className="h-full flex flex-col space-y-6 overflow-y-auto pr-1">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 border border-black/[0.06] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">
            <span className="text-emerald-700 font-bold">5 State Machines & Anti-IDOR Token Tracking</span>
            <span>•</span>
            <span>Blueprint Section 3.2 & 5.1</span>
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Lejar Pesanan & Mesin Keadaan</h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            Pemisahan 5 state machine bebas (Order, Payment, Refund, Fulfilment, Commission). Penjejakan awam menggunakan token kriptografik rawak dengan PII disunting.
          </p>
        </div>

        <button 
          onClick={() => onAskAgent("Periksa status 5-state machine untuk pesanan ORD-AC-9102 dan ORD-AC-9145.")}
          className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold rounded-full transition-all flex items-center gap-1.5 self-start md:self-auto"
        >
          <Sparkles size={14} /> Audit Status AI
        </button>
      </div>

      {/* 5 State Machines Guide */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 text-xs">
        <div className="bg-white p-3 rounded-2xl border border-black/[0.04]">
          <span className="text-[10px] font-bold uppercase text-zinc-400 block">1. Order State</span>
          <span className="text-zinc-800 font-medium text-[11px] mt-0.5 block">placed &rarr; delivered</span>
        </div>
        <div className="bg-white p-3 rounded-2xl border border-black/[0.04]">
          <span className="text-[10px] font-bold uppercase text-zinc-400 block">2. Payment State</span>
          <span className="text-zinc-800 font-medium text-[11px] mt-0.5 block">created &rarr; paid</span>
        </div>
        <div className="bg-white p-3 rounded-2xl border border-black/[0.04]">
          <span className="text-[10px] font-bold uppercase text-zinc-400 block">3. Refund State</span>
          <span className="text-zinc-800 font-medium text-[11px] mt-0.5 block">not_requested &rarr; refunded</span>
        </div>
        <div className="bg-white p-3 rounded-2xl border border-black/[0.04]">
          <span className="text-[10px] font-bold uppercase text-zinc-400 block">4. Fulfilment State</span>
          <span className="text-zinc-800 font-medium text-[11px] mt-0.5 block">not_packed &rarr; delivered</span>
        </div>
        <div className="bg-white p-3 rounded-2xl border border-black/[0.04]">
          <span className="text-[10px] font-bold uppercase text-zinc-400 block">5. Commission State</span>
          <span className="text-zinc-800 font-medium text-[11px] mt-0.5 block">pending &rarr; approved/paid</span>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl p-6 border border-black/[0.06] shadow-sm space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="text-[10px] uppercase tracking-wider text-zinc-400 border-b border-black/[0.04]">
              <tr>
                <th className="py-3 px-2">ID & Tarikh</th>
                <th className="py-3 px-2">Pelanggan & Lokasi</th>
                <th className="py-3 px-2">Item Pesanan</th>
                <th className="py-3 px-2">Jumlah (RM)</th>
                <th className="py-3 px-2">5 Status Berasingan</th>
                <th className="py-3 px-2 text-right">Penjejakan Awam</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.03]">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-zinc-50/50 transition-colors">
                  <td className="py-3 px-2 font-mono">
                    <span className="font-bold text-zinc-900 block">{o.id}</span>
                    <span className="text-[10px] text-zinc-400">{o.createdAt.slice(0, 10)}</span>
                  </td>
                  <td className="py-3 px-2">
                    <span className="font-medium text-zinc-800 block">{o.customerName}</span>
                    <span className="text-[10px] text-zinc-400">{o.city}</span>
                  </td>
                  <td className="py-3 px-2">
                    {o.items.map((it, idx) => (
                      <div key={idx} className="text-zinc-700">
                        {it.quantity}x {it.name}
                      </div>
                    ))}
                  </td>
                  <td className="py-3 px-2 font-mono font-bold text-zinc-900">
                    RM {o.totalAmount.toFixed(2)}
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex flex-wrap gap-1">
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                        Order: {o.orderState}
                      </span>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                        o.paymentState === 'paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        Pay: {o.paymentState}
                      </span>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                        o.refundState === 'refunded' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-zinc-50 text-zinc-600 border-zinc-200'
                      }`}>
                        Refund: {o.refundState}
                      </span>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                        Fulfil: {o.fulfilmentState}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <button
                      onClick={() => handleOpenTracking(o)}
                      className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-semibold text-[11px] rounded-full inline-flex items-center gap-1.5 transition-all"
                    >
                      <Key size={12} className="text-zinc-500" /> Token Track
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Public Tracking Token Modal (Anti-IDOR) */}
      {showTrackingModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-6 max-w-lg w-full border border-black/10 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-black/[0.06] pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck size={20} className="text-emerald-600" />
                <h3 className="font-bold text-zinc-900 text-base">Halaman Penjejakan Awam Bertoken (Anti-IDOR)</h3>
              </div>
              <button onClick={() => setShowTrackingModal(false)} className="text-zinc-400 hover:text-black">&times;</button>
            </div>

            <div className="bg-zinc-50 p-3 rounded-2xl border border-black/[0.03] text-xs font-mono break-all">
              <span className="text-[10px] uppercase text-zinc-400 block font-sans font-bold">Public URL:</span>
              <span className="text-zinc-800">/orders/track?token={activeTrackingToken}</span>
            </div>

            <div className="bg-amber-50 text-amber-900 border border-amber-200/80 p-3 rounded-2xl text-xs">
              <b>Polisi Privasi PII:</b> Nama penuh, nombor telefon, dan alamat terperinci <u>disunting (redacted)</u> bagi mengelakkan kebocoran maklumat peribadi. Hanya status logistik dan bandar penghantaran dipaparkan.
            </div>

            {redactedTrackingData && (
              <div className="space-y-3 pt-1 text-xs">
                <div className="grid grid-cols-2 gap-3 bg-zinc-100/60 p-4 rounded-2xl">
                  <div>
                    <span className="text-zinc-400 text-[10px] uppercase block">Bandar Destinasi</span>
                    <span className="font-bold text-zinc-900">{redactedTrackingData.city} (Disunting)</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 text-[10px] uppercase block">Bilangan Bungkusan</span>
                    <span className="font-bold text-zinc-900">{redactedTrackingData.itemCount} unit item</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 text-[10px] uppercase block">Status Logistik</span>
                    <span className="font-bold text-emerald-700 uppercase">{redactedTrackingData.fulfilmentState.replace(/_/g, ' ')}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 text-[10px] uppercase block">Konsainan Bas</span>
                    <span className="font-bold text-zinc-700">{redactedTrackingData.consignmentId || 'Kurier Terus'}</span>
                  </div>
                </div>

                <div className="text-[11px] text-zinc-500 text-center">
                  Kemaskini Terakhir: {redactedTrackingData.lastUpdated?.replace('T', ' ').slice(0, 16)}
                </div>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button 
                onClick={() => setShowTrackingModal(false)}
                className="px-5 py-2 bg-black text-white text-xs font-semibold rounded-full"
              >
                Tutup
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
