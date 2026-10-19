import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, 
  Wifi, 
  WifiOff, 
  RotateCw, 
  CheckCircle2, 
  Plus, 
  Minus, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Tag
} from 'lucide-react';
import { growthOsStore, QueuedOfflineOrder } from '@/services/growthOsStore';

export const StorefrontView = ({ onAskAgent }: { onAskAgent: (q: string) => void }) => {
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [offlineQueue, setOfflineQueue] = useState<QueuedOfflineOrder[]>(growthOsStore.getOfflineQueue());
  const [cart, setCart] = useState<{ [sku: string]: number }>({
    'SKU-COLEK-ORI-500': 1,
    'SKU-BUAH-MANGA-BOX': 1
  });
  const [customerName, setCustomerName] = useState<string>('Nur Aisyah');
  const [phone, setPhone] = useState<string>('+6012-7890123');
  const [city, setCity] = useState<string>('TBS Kuala Lumpur');
  const [refCode, setRefCode] = useState<string>('cikguwan');
  const [voucher, setVoucher] = useState<string>('PADU15');
  const [orderSuccessMsg, setOrderSuccessMsg] = useState<string>('');

  const products = [
    {
      sku: 'SKU-COLEK-ORI-500',
      name: 'Kuah Colek Warisan Ori (500ml)',
      price: 18.00,
      desc: 'Resipi warisan Pantai Timur pekat likat bergula melaka & udang kering asli.',
      badge: 'Best Seller'
    },
    {
      sku: 'SKU-COLEK-PEDAS-500',
      name: 'Kuah Colek Pedas Berapi Cili Kampung (500ml)',
      price: 20.00,
      desc: 'Tahap kepedasan maksima 35,000 SHU menggunakan cili padi kampung segar.',
      badge: 'Pedas Kaw'
    },
    {
      sku: 'SKU-BUAH-MANGA-BOX',
      name: 'Set Buah Potong Segar Dingin',
      price: 12.00,
      desc: 'Mangga sala rangup, jambu batu rangup & sengkuang manis dipotong harian.',
      badge: 'Segar Hari Ini'
    }
  ];

  useEffect(() => {
    return growthOsStore.subscribe(() => {
      setOfflineQueue(growthOsStore.getOfflineQueue());
    });
  }, []);

  const updateQuantity = (sku: string, delta: number) => {
    setCart(prev => {
      const current = prev[sku] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [sku]: next };
    });
  };

  const calculateSubtotal = () => {
    return products.reduce((sum, p) => sum + (p.price * (cart[p.sku] || 0)), 0);
  };

  const subtotal = calculateSubtotal();
  const discountAmount = voucher === 'PADU15' && subtotal >= 30 ? subtotal * 0.15 : 0;
  const finalTotal = subtotal - discountAmount;

  const handleCheckout = () => {
    if (subtotal === 0) return;

    const items = products
      .filter(p => (cart[p.sku] || 0) > 0)
      .map(p => ({
        sku: p.sku,
        name: p.name,
        unitPrice: p.price,
        quantity: cart[p.sku]
      }));

    if (isOffline) {
      // Offline mode: queue into pending_sync draft queue
      const queued = growthOsStore.queueOfflineOrder({
        customerName,
        phone,
        city,
        items,
        totalAmount: finalTotal,
        referralCode: refCode
      });
      setOrderSuccessMsg(`Luar Talian (Offline): Pesanan anda disimpan dalam draf peranti (${queued.id}) dan akan disegerakkan automatik apabila sambungan kembali.`);
    } else {
      // Online mode: validate stock and create immediately
      const alloc = growthOsStore.allocateStockAtomic(items[0].sku, items[0].quantity);
      if (alloc.success) {
        setOrderSuccessMsg(`Pesanan Berjaya! Jumlah RM ${finalTotal.toFixed(2)} disahkan dan stok telah diperuntukkan.`);
      } else {
        setOrderSuccessMsg(`Maaf, stok lot semasa tidak mencukupi untuk item ${items[0].name}.`);
      }
    }
    setTimeout(() => setOrderSuccessMsg(''), 7000);
  };

  const handleToggleOnline = () => {
    const nextState = !isOffline;
    setIsOffline(nextState);
    if (!nextState) {
      // Reconnected: trigger auto-sync
      const sync = growthOsStore.syncOfflineQueue();
      if (sync.syncedCount > 0) {
        setOrderSuccessMsg(`Talian Dipulihkan: ${sync.syncedCount} pesanan luar talian telah disahkan & disegerakkan ke pelayan!`);
        setTimeout(() => setOrderSuccessMsg(''), 6000);
      }
    }
  };

  return (
    <div className="h-full flex flex-col space-y-6 overflow-y-auto pr-1">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 border border-black/[0.06] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">
            <span className="text-emerald-700 font-bold">No-Download First PWA Storefront</span>
            <span>•</span>
            <span>Blueprint Section 2.3 & Test OFF-01</span>
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Kedai Web Pantas Pelanggan (PWA)</h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            Pelanggan boleh membuat pesanan terus tanpa muat turun app store. Menyokong draf pesanan luar talian (offline queued drafts) dengan pengesahan harga & stok semasa bersambung semula.
          </p>
        </div>

        {/* Offline Toggle Simulator */}
        <div className="flex items-center gap-3 bg-zinc-50 border border-black/10 px-4 py-2.5 rounded-full self-start md:self-auto">
          <div className="flex items-center gap-1.5 text-xs font-bold">
            {isOffline ? (
              <span className="text-amber-600 flex items-center gap-1">
                <WifiOff size={14} /> Mod Luar Talian (Offline)
              </span>
            ) : (
              <span className="text-emerald-600 flex items-center gap-1">
                <Wifi size={14} /> Dalam Talian (Online)
              </span>
            )}
          </div>
          <button
            onClick={handleToggleOnline}
            className={`px-3 py-1 text-[11px] font-bold rounded-full transition-all ${
              isOffline 
                ? 'bg-amber-600 text-white' 
                : 'bg-zinc-200 text-zinc-700 hover:bg-zinc-300'
            }`}
          >
            {isOffline ? 'Sambung Semula' : 'Simulasi Offline'}
          </button>
        </div>
      </div>

      {orderSuccessMsg && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs p-4 rounded-2xl flex items-center gap-2 shadow-xs"
        >
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>{orderSuccessMsg}</span>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Products catalog (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-black/[0.06] shadow-sm space-y-4">
            <h2 className="font-bold text-zinc-900 text-base">Katalog Produk AbangColek</h2>
            
            <div className="space-y-4">
              {products.map((prod) => (
                <div 
                  key={prod.sku}
                  className="p-4 rounded-2xl border border-black/[0.04] bg-zinc-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-zinc-900 text-sm">{prod.name}</span>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-black text-white">
                        {prod.badge}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 leading-relaxed max-w-md">{prod.desc}</p>
                    <span className="text-xs font-mono font-bold text-emerald-700 block pt-1">
                      RM {prod.price.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => updateQuantity(prod.sku, -1)}
                      disabled={!cart[prod.sku]}
                      className="w-8 h-8 rounded-full bg-white border border-black/10 flex items-center justify-center text-zinc-600 disabled:opacity-30 hover:bg-zinc-100"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="w-8 text-center font-mono font-bold text-xs text-zinc-900">
                      {cart[prod.sku] || 0}
                    </span>
                    <button
                      onClick={() => updateQuantity(prod.sku, 1)}
                      className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:bg-zinc-800"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Checkout Card (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-black/[0.06] shadow-sm space-y-4">
            <h3 className="font-bold text-zinc-900 text-base">Ringkasan Pesanan</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-500 font-semibold block mb-1">Nama Pelanggan</label>
                <input 
                  type="text" 
                  value={customerName} 
                  onChange={e => setCustomerName(e.target.value)} 
                  className="w-full px-3 py-2 bg-zinc-50 border border-black/10 rounded-xl" 
                />
              </div>

              <div>
                <label className="text-zinc-500 font-semibold block mb-1">Nombor Telefon (OTP Verified)</label>
                <input 
                  type="text" 
                  value={phone} 
                  onChange={e => setPhone(e.target.value)} 
                  className="w-full px-3 py-2 bg-zinc-50 border border-black/10 rounded-xl font-mono" 
                />
              </div>

              <div>
                <label className="text-zinc-500 font-semibold block mb-1">Cawangan / Hab Destinasi</label>
                <select 
                  value={city} 
                  onChange={e => setCity(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 border border-black/10 rounded-xl font-medium"
                >
                  <option value="TBS Kuala Lumpur">TBS Kuala Lumpur (Hab Utama)</option>
                  <option value="Kuantan Sentral">Kuantan Sentral (Central Depot)</option>
                  <option value="Kemaman Hub">Kemaman Terminal Hub</option>
                  <option value="Dungun Kiosk">Dungun Pantai Teluk Lipat</option>
                  <option value="Kota Bharu">Kota Bharu Terminal</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <label className="text-zinc-500 font-semibold block mb-1">Kod Ejen (?ref=)</label>
                  <input 
                    type="text" 
                    value={refCode} 
                    onChange={e => setRefCode(e.target.value)} 
                    className="w-full px-3 py-2 bg-zinc-50 border border-black/10 rounded-xl font-mono text-xs" 
                  />
                </div>
                <div>
                  <label className="text-zinc-500 font-semibold block mb-1">Baucar Promo</label>
                  <input 
                    type="text" 
                    value={voucher} 
                    onChange={e => setVoucher(e.target.value)} 
                    className="w-full px-3 py-2 bg-zinc-50 border border-black/10 rounded-xl font-mono text-xs uppercase" 
                  />
                </div>
              </div>

              {/* Price Calculation */}
              <div className="pt-3 border-t border-black/[0.04] space-y-1.5 font-medium">
                <div className="flex justify-between text-zinc-500">
                  <span>Jumlah Kasar:</span>
                  <span className="font-mono text-zinc-800">RM {subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Diskaun ({voucher}):</span>
                    <span className="font-mono">-RM {discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold text-zinc-900 pt-2 border-t border-black/[0.04]">
                  <span>Jumlah Bersih:</span>
                  <span className="font-mono text-emerald-700">RM {finalTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={subtotal === 0}
                className="w-full py-3 bg-black hover:bg-zinc-800 disabled:opacity-40 text-white rounded-full font-bold text-xs transition-all shadow-sm flex items-center justify-center gap-2 mt-4"
              >
                <ShoppingBag size={14} />
                {isOffline ? 'Simpan Pesanan Draf Luar Talian' : 'Buat Pesanan & Bayar (FPX)'}
              </button>
            </div>
          </div>

          {/* Offline Queue status */}
          {offlineQueue.length > 0 && (
            <div className="bg-white rounded-3xl p-5 border border-black/[0.06] shadow-sm space-y-2 text-xs">
              <span className="font-bold text-zinc-900 block">Draf Luar Talian Dalam Simpanan ({offlineQueue.length})</span>
              <div className="space-y-1.5">
                {offlineQueue.map((item) => (
                  <div key={item.id} className="p-2.5 rounded-xl bg-zinc-50 border border-black/[0.02] flex items-center justify-between">
                    <div>
                      <span className="font-mono font-bold text-[10px] text-zinc-600 block">{item.id}</span>
                      <span className="text-[11px] text-zinc-700">{item.payload.customerName} • RM {item.payload.totalAmount?.toFixed(2)}</span>
                    </div>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      item.status === 'synced' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {item.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
