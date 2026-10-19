import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Sparkles, TrendingUp, BarChart2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MOCK_DB } from '@/services/gemini';

export const DashboardsView = ({ onAction }: { onAction: (msg?: string) => void }) => {
  const handleGenerateDashboard = () => {
    onAction("Bina dashboard operasi AbangColek: paparkan hasil jualan, sumbangan margin Pantai Timur, status konsainan bas ekspres, dan kerosakan botol");
  };

  return (
    <div className="p-4 md:p-8 h-full overflow-y-auto pr-1">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">
              <span>Analitik & Visualisasi</span>
              <span>•</span>
              <span className="text-emerald-700 font-bold">Live Data Visualizer</span>
            </div>
            <h2 className="text-3xl font-bold text-zinc-900 tracking-tight">Papan Pemuka Operasi (Dashboards)</h2>
            <p className="text-zinc-500 mt-1 text-[14px]">Metrik jualan, pecahan hab cawangan Pantai Timur, dan KPI operasi kuah colek.</p>
          </div>
          <button 
            onClick={handleGenerateDashboard} 
            className="px-5 py-2.5 bg-black text-white rounded-full text-[13px] font-medium hover:bg-zinc-800 transition-colors shadow-sm self-start sm:self-auto flex items-center gap-2"
          >
            <Sparkles size={14} /> + Bina Dashboard Baharu
          </button>
        </div>

        <div className="grid gap-6">
          {MOCK_DB.dashboards.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-black/[0.04] p-8 shadow-sm">
              <div className="w-16 h-16 rounded-full bg-zinc-50 border border-black/5 flex items-center justify-center mx-auto mb-4">
                <BarChart2 size={24} className="text-zinc-400" />
              </div>
              <p className="text-zinc-700 font-bold text-base mb-1">Belum Ada Dashboard Dihasilkan</p>
              <p className="text-zinc-400 text-xs max-w-md mx-auto mb-6">Minta Agent Chat untuk menghasilkan dashboard metrik operasi, cawangan Pantai Timur, atau sumbangan margin.</p>
              <button
                onClick={handleGenerateDashboard}
                className="px-5 py-2 bg-black text-white rounded-full text-xs font-semibold hover:bg-zinc-800 transition-all"
              >
                Jana Dashboard Sekarang
              </button>
            </div>
          ) : (
            [...MOCK_DB.dashboards].reverse().map((dashboard, i) => {
              const mainChartMax = Math.max(...(dashboard.main_chart?.data || []).map((m: any) => m.value || 0));
              const secondaryChartMax = Math.max(...(dashboard.secondary_chart?.data || []).map((m: any) => m.value || 0));

              return (
                <div key={i} className="flex flex-col gap-6 mb-8">
                  <h3 className="font-semibold text-2xl text-zinc-900 tracking-tight">{dashboard.title}</h3>
                  
                  {/* KPIs Row */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {dashboard.kpis?.filter((kpi: any) => kpi.value !== 'N/A' && kpi.value !== 'n/a').map((kpi: any, idx: number) => (
                      <div key={idx} className="bg-white p-5 rounded-3xl border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:border-black/10 transition-all">
                        <span className="text-[11px] text-zinc-400 font-semibold uppercase tracking-wider mb-2">{kpi.label}</span>
                        <div className="flex items-end justify-between">
                          <span className="text-2xl font-bold text-zinc-900 tracking-tight leading-none">{kpi.value}</span>
                          {kpi.trend && kpi.trend !== 'N/A' && kpi.trend !== 'n/a' && (
                            <span className={cn(
                              "text-[12px] font-semibold",
                              kpi.trend.startsWith('+') ? "text-emerald-500" : kpi.trend.startsWith('-') ? "text-red-500" : "text-zinc-400"
                            )}>
                              {kpi.trend}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Chart */}
                    <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-[32px] border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col">
                      <h4 className="font-semibold text-[17px] text-zinc-900 tracking-tight mb-1">{dashboard.main_chart?.title}</h4>
                      <p className="text-[10px] text-zinc-400 font-medium mb-6 uppercase tracking-wider">{dashboard.main_chart?.type} Chart</p>
                      
                      <div className="flex-1 flex flex-col justify-start gap-4">
                        {dashboard.main_chart?.data?.map((metric: any, idx: number) => {
                          const heightPercent = mainChartMax > 0 ? (metric.value / mainChartMax) * 100 : 0;
                          return (
                            <div key={idx} className="flex items-center gap-4">
                              <div className="w-28 text-[12px] font-medium text-zinc-500 truncate text-right">{metric.label}</div>
                              <div className="flex-1 h-9 bg-zinc-50 rounded-full flex items-center border border-black/5 p-1 relative overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${Math.max(heightPercent, 5)}%` }}
                                  className="h-full bg-black rounded-full shadow-sm absolute left-1"
                                />
                                <span className={cn("text-[12px] font-semibold tracking-tight absolute z-10", heightPercent > 15 ? "text-white left-4" : "text-zinc-700 left-8")} style={{ left: heightPercent > 15 ? 16 : `calc(${Math.max(heightPercent, 5)}% + 14px)` }}>
                                  {metric.value.toLocaleString()}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex flex-col gap-6">
                      {/* Secondary Chart */}
                      <div className="bg-white p-6 md:p-8 rounded-[32px] border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex-1">
                        <h4 className="font-semibold text-[15px] text-zinc-900 tracking-tight mb-1">{dashboard.secondary_chart?.title}</h4>
                        <p className="text-[10px] text-zinc-400 font-medium mb-4 uppercase tracking-wider">{dashboard.secondary_chart?.type} Chart</p>
                        
                        <div className="flex flex-col gap-3">
                          {dashboard.secondary_chart?.data?.map((metric: any, idx: number) => {
                            const pct = secondaryChartMax > 0 ? (metric.value / secondaryChartMax) * 100 : 0;
                            return (
                              <div key={idx} className="flex flex-col gap-1.5">
                                <div className="flex justify-between text-[12px] font-medium">
                                  <span className="text-zinc-600 truncate mr-2">{metric.label}</span>
                                  <span className="text-zinc-900 font-semibold">{metric.value.toLocaleString()}</span>
                                </div>
                                <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                                  <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${pct}%` }}
                                    className="h-full bg-black rounded-full"
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Recent Activity */}
                      <div className="bg-white p-6 md:p-8 rounded-[32px] border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex-1">
                        <h4 className="font-semibold text-[15px] text-zinc-900 tracking-tight mb-4">Wawasan Pantas</h4>
                        <div className="flex flex-col gap-3">
                          {dashboard.recent_activity?.map((activity: any, idx: number) => (
                            <div key={idx} className="flex items-start gap-2.5">
                              <div className="w-5 h-5 rounded-full bg-zinc-50 border border-black/5 flex items-center justify-center shrink-0 mt-0.5">
                                <Activity size={10} className="text-zinc-400" />
                              </div>
                              <p className="text-[12px] text-zinc-600 leading-relaxed font-medium">{activity.text}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
