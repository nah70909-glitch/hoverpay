"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { 
  LayoutDashboard, WalletCards, History, Shield, Settings, Store, 
  LogOut, QrCode, Plus, ArrowUpRight, ArrowDownRight, RefreshCw, 
  Sliders, Watch, CreditCard, Flame, Calendar, Trash2, ShieldAlert,
  Train, Building, Coffee, ShoppingBag, Leaf, Check, Volume2, User,
  Sparkles
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { useStore } from "@/lib/store";

const chartData = [
  { name: 'Mon', value: 1200, fraud: 0.01 },
  { name: 'Tue', value: 2100, fraud: 0.02 },
  { name: 'Wed', value: 1800, fraud: 0.01 },
  { name: 'Thu', value: 340, fraud: 0.01 },
  { name: 'Fri', value: 2800, fraud: 0.03 },
  { name: 'Sat', value: 4500, fraud: 0.01 },
  { name: 'Sun', value: 1850, fraud: 0.02 },
];

export default function Dashboard() {
  const { 
    balance, transactions, subscriptions, wearables, cards, settings,
    addFunds, updateSettings, toggleSubscriptionAutoPay, toggleWearableConnection,
    isAuthenticated, userName, userPhone, logout
  } = useStore();
  
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "cards" | "recurring" | "transit" | "settings">("overview");
  const [analyticsTab, setAnalyticsTab] = useState<"spending" | "fraud" | "carbon">("spending");
  const [cardTilt, setCardTilt] = useState({ x: 0, y: 0 });
  const [fundsAmount, setFundsAmount] = useState("10000");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      window.location.href = "/pay";
    }
  }, [mounted, isAuthenticated]);

  // Holographic card tilt calculations
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left - box.width / 2;
    const y = e.clientY - box.top - box.height / 2;
    // Normalize values
    const tiltX = (y / (box.height / 2)) * 12;
    const tiltY = -(x / (box.width / 2)) * 12;
    setCardTilt({ x: tiltX, y: tiltY });
  };

  const handleCardMouseLeave = () => {
    setCardTilt({ x: 0, y: 0 });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const spentThisMonth = transactions.reduce((acc, curr) => acc + curr.amount, 0);

  if (!mounted) return null;

  return (
    <div className="flex h-screen bg-[#030303] text-zinc-100 overflow-hidden font-sans selection:bg-brand-500/30">
      
      {/* Sidebar navigation */}
      <aside className="w-64 border-r border-white/5 bg-[#050508]/80 backdrop-blur-xl flex flex-col hidden md:flex z-30">
        <div className="p-8 flex flex-col h-full justify-between">
          <div>
            <Link href="/" className="flex items-center gap-2.5 group mb-10">
              <div className="w-9 h-9 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-500 transition-all group-hover:scale-105">
                <span className="font-display font-black text-lg">H</span>
              </div>
              <span className="font-display font-bold text-lg tracking-tight text-white">
                Hover<span className="text-brand-500">Pay</span>
              </span>
            </Link>

            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">Consumer Portal</p>
            <nav className="space-y-1">
              <SidebarItem 
                icon={<LayoutDashboard size={18} />} 
                label="Overview" 
                active={activeTab === "overview"} 
                onClick={() => setActiveTab("overview")} 
              />
              <SidebarItem 
                icon={<WalletCards size={18} />} 
                label="Linked Cards" 
                active={activeTab === "cards"} 
                onClick={() => setActiveTab("cards")} 
              />
              <SidebarItem 
                icon={<Calendar size={18} />} 
                label="Smart Auto-Pay" 
                active={activeTab === "recurring"} 
                onClick={() => setActiveTab("recurring")} 
              />
              <SidebarItem 
                icon={<Train size={18} />} 
                label="Transit ID Pass" 
                active={activeTab === "transit"} 
                onClick={() => setActiveTab("transit")} 
              />
              <SidebarItem 
                icon={<Settings size={18} />} 
                label="System Settings" 
                active={activeTab === "settings"} 
                onClick={() => setActiveTab("settings")} 
              />
            </nav>

            <div className="border-t border-white/5 my-8 pt-8">
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">Fintech Ecosystem</p>
              <Link href="/merchant" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent transition-all">
                <Store size={16} className="text-brand-500" /> Switch to Merchant
              </Link>
            </div>
          </div>

          {/* User Profile Card */}
          <div className="border-t border-white/5 pt-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-purple/20 border border-brand-purple/30 flex items-center justify-center text-sm font-semibold text-white">
                <User size={18} className="text-brand-purple" />
              </div>
              <div className="text-left">
                <p className="text-xs font-semibold text-white">{userName}</p>
                <p className="text-[10px] text-zinc-500 font-mono">{userName ? userName.toLowerCase() : "user"}@hpay</p>
              </div>
            </div>
            <button 
              onClick={() => {
                logout();
                window.location.href = "/pay";
              }}
              className="text-zinc-550 hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-white/5"
              title="Logout Profile"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Space */}
      <main className="flex-1 overflow-y-auto bg-[#030303] p-6 md:p-10 relative">
        <div className="absolute top-0 right-0 w-[50%] h-[30%] bg-brand-purple/5 blur-[120px] pointer-events-none" />

        {/* Dashboard Header */}
        <header className="flex justify-between items-center mb-10 relative z-10">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white font-display uppercase">
              {activeTab === "overview" && `Welcome back, ${userName || "Prathik"}`}
              {activeTab === "cards" && "Linked Accounts"}
              {activeTab === "recurring" && "Smart Subscriptions"}
              {activeTab === "transit" && "HoverID Transit passes"}
              {activeTab === "settings" && "System Settings"}
            </h1>
            <p className="text-xs text-zinc-500 mt-1">
              {activeTab === "overview" && "Live financial snapshot and predictive analytics."}
              {activeTab === "cards" && "Secure card tokens locked on-device."}
              {activeTab === "recurring" && "Toggle touchless Auto-Hover approval on active contracts."}
              {activeTab === "transit" && "Secure gates with HoverID NFC bypass passes."}
              {activeTab === "settings" && "Configure AI thresholds, offline buffers, and beacons."}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Link href="/pay" className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-black px-4 py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-brand-500/10 transition-all">
              <QrCode size={16} /> Tap to Pay
            </Link>
          </div>
        </header>

        {/* 1. OVERVIEW SCREEN */}
        {activeTab === "overview" && (
          <div className="space-y-8 relative z-10">
            {/* Top row: holographic card + simple stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Holographic interactive 3D card */}
              <div className="lg:col-span-2">
                <div 
                  onMouseMove={handleCardMouseMove}
                  onMouseLeave={handleCardMouseLeave}
                  style={{
                    transform: `perspective(1000px) rotateX(${cardTilt.x}deg) rotateY(${cardTilt.y}deg)`,
                    transition: isNaN(cardTilt.x) ? 'all 0.5s ease' : 'none'
                  }}
                  className="holo-card rounded-3xl p-8 relative overflow-hidden flex flex-col justify-between aspect-[1.8/1] cursor-pointer group"
                >
                  {/* Glowing card overlay */}
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,255,170,0.15)_0%,transparent_60%)] pointer-events-none group-hover:scale-105 transition-transform duration-700" />
                  
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs text-white/50 font-mono tracking-wider">AVAILABLE BALANCE</p>
                      <h2 className="text-4xl font-extrabold text-white mt-1 font-display">
                        {formatCurrency(balance)}
                      </h2>
                    </div>
                    <div className="w-12 h-8 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center font-bold text-xs text-white">
                      HPay
                    </div>
                  </div>

                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] text-white/40 font-mono">LINKED PRIMARY ACCOUNT</p>
                      <p className="text-sm font-semibold text-white mt-0.5">HDFC Bank Platinum Debit</p>
                      <p className="text-[10px] text-zinc-500 font-mono">{userName ? userName.toLowerCase() : "user"}@okicici •••• 4092</p>
                    </div>
                    
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-brand-500 bg-brand-500/10 border border-brand-500/20 px-3 py-1 rounded-full uppercase tracking-wider">
                        Active BLE Node
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick side stats */}
              <div className="flex flex-col gap-6 justify-between">
                <StatCard 
                  title="Monthly Spent Volume" 
                  value={formatCurrency(spentThisMonth)} 
                  sub={<span className="text-brand-500 flex items-center gap-0.5"><ArrowDownRight size={12} /> 12% lower than Apr</span>} 
                />
                
                {/* Active Wearables Sync panel */}
                <div className="bg-[#09090f] border border-white/5 rounded-3xl p-6">
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-1.5">
                    <Watch size={14} className="text-brand-500" /> Synced Wearables
                  </h4>
                  <div className="space-y-3">
                    {wearables.map(w => (
                      <div key={w.id} className="flex justify-between items-center text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{w.type === "ring" ? "💍" : "⌚"}</span>
                          <div>
                            <p className="font-semibold text-white">{w.name}</p>
                            <p className="text-[10px] text-zinc-500">Battery: {w.battery}%</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => toggleWearableConnection(w.id)}
                          className={`text-[9px] font-bold px-2 py-0.5 rounded border transition-colors ${
                            w.connected 
                              ? 'bg-brand-500/10 border-brand-500/20 text-brand-500' 
                              : 'bg-white/5 border-white/5 text-zinc-500'
                          }`}
                        >
                          {w.connected ? "Active" : "Pair"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom analytics: chart + transaction history */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Analytics graph panel */}
              <div className="lg:col-span-2 bg-[#09090f] border border-white/5 rounded-3xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Predictive Analytics</h3>
                  <div className="flex bg-black p-1 rounded-xl border border-white/5">
                    <button 
                      onClick={() => setAnalyticsTab("spending")}
                      className={`text-[10px] font-semibold px-3 py-1.5 rounded-lg transition-colors ${analyticsTab === "spending" ? "bg-brand-500 text-black font-bold" : "text-zinc-500"}`}
                    >
                      Volume
                    </button>
                    <button 
                      onClick={() => setAnalyticsTab("fraud")}
                      className={`text-[10px] font-semibold px-3 py-1.5 rounded-lg transition-colors ${analyticsTab === "fraud" ? "bg-brand-500 text-black font-bold" : "text-zinc-500"}`}
                    >
                      AI Fraud Score
                    </button>
                    <button 
                      onClick={() => setAnalyticsTab("carbon")}
                      className={`text-[10px] font-semibold px-3 py-1.5 rounded-lg transition-colors ${analyticsTab === "carbon" ? "bg-brand-500 text-black font-bold" : "text-zinc-500"}`}
                    >
                      Carbon Offset
                    </button>
                  </div>
                </div>

                {/* Recharts chart area */}
                <div className="h-[260px] w-full">
                  {analyticsTab === "spending" && (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="gradientSpent" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#00ffaa" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#00ffaa" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="name" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                        <YAxis stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}`} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#09090f', borderColor: 'rgba(255,255,255,0.08)', borderRadius: '12px' }}
                          itemStyle={{ color: '#fafafa', fontSize: '12px' }}
                          labelStyle={{ color: '#71717a', fontSize: '10px' }}
                        />
                        <Area type="monotone" dataKey="value" stroke="#00ffaa" strokeWidth={2.5} fillOpacity={1} fill="url(#gradientSpent)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                  {analyticsTab === "fraud" && (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <XAxis dataKey="name" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                        <YAxis stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}%`} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#09090f', borderColor: 'rgba(255,255,255,0.08)', borderRadius: '12px' }}
                          itemStyle={{ color: '#fafafa', fontSize: '12px' }}
                          labelStyle={{ color: '#71717a', fontSize: '10px' }}
                        />
                        <Bar dataKey="fraud" fill="#7000ff" radius={[4, 4, 0, 0]} barSize={24} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                  {analyticsTab === "carbon" && (
                    <div className="flex flex-col items-center justify-center h-full text-center p-6">
                      <Leaf className="text-brand-500 mb-3 animate-bounce" size={40} />
                      <p className="text-sm font-semibold text-white">HoverPay Green Engine</p>
                      <p className="text-xs text-zinc-500 max-w-xs mt-1.5">
                        Touchless transactions eliminate paper receipts and QR plastic degradation, saving an estimated <strong className="text-brand-500">12.4kg of CO₂</strong> this week.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Transactions list */}
              <div className="bg-[#09090f] border border-white/5 rounded-3xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Ledger Records</h3>
                  <button className="text-[10px] text-brand-500 font-bold hover:underline">View All</button>
                </div>

                <div className="space-y-4 max-h-[260px] overflow-y-auto pr-1">
                  {transactions.map(txn => (
                    <div key={txn.id} className="flex justify-between items-center text-xs group cursor-pointer hover:bg-white/5 p-2 rounded-xl transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-lg">
                          {txn.category === "Food & Beverage" && "☕"}
                          {txn.category === "Shopping" && "👗"}
                          {txn.category === "Transit" && "🚇"}
                          {txn.category === "Groceries" && "🛒"}
                          {!["Food & Beverage", "Shopping", "Transit", "Groceries"].includes(txn.category || "") && "💸"}
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-white group-hover:text-brand-500 transition-colors">{txn.name}</p>
                          <p className="text-[9px] text-zinc-500 font-mono mt-0.5">{txn.date} • {txn.method}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-white">-₹{txn.amount}</span>
                        <p className="text-[8px] text-brand-500 font-mono font-bold mt-1 bg-brand-500/5 border border-brand-500/10 px-1 py-0.5 rounded">
                          {txn.fraudScore ? `Risk: ${parseFloat((txn.fraudScore * 100).toFixed(2))}%` : "Risk: 0.01%"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Row 3: Nearby Ambient Beacons & Quick-Pay + AI Recommendations */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Nearby Merchants Quick-Pay */}
              <div className="lg:col-span-2 bg-[#09090f] border border-white/5 rounded-3xl p-6 text-left relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-brand-500/10 text-brand-500 text-[9px] font-bold px-3 py-1 rounded-bl-xl border-l border-b border-brand-500/15 uppercase font-mono animate-pulse">
                  BLE Spectra Node Active
                </div>
                
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-brand-500 animate-ping" />
                  Nearby Ambient Merchants
                </h3>
                <p className="text-xs text-zinc-500 mb-6">Localized beacons detected within your primary 5-meter RSSI ring.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {[
                    { name: "Starbucks Register 3", icon: "☕", upi: "starbucks@okicici", dist: "0.3m", status: "Secure Mesh Locked" },
                    { name: "Zara Fashion Terminal", icon: "👗", upi: "zara@sbi", dist: "1.1m", status: "Dynamic Proximity ready" }
                  ].map((m, idx) => (
                    <div key={idx} className="bg-[#030305] border border-white/5 hover:border-brand-500/25 p-4 rounded-2xl flex flex-col justify-between transition-all group">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{m.icon}</span>
                          <div className="text-left">
                            <p className="font-bold text-white text-xs group-hover:text-brand-500 transition-colors">{m.name}</p>
                            <p className="text-[9px] text-zinc-500 font-mono mt-0.5">{m.upi}</p>
                          </div>
                        </div>
                        <span className="text-[9px] font-bold font-mono text-brand-500 bg-brand-500/5 px-2 py-0.5 rounded-full border border-brand-500/10">
                          {m.dist}
                        </span>
                      </div>
                      
                      <button 
                        onClick={() => window.location.href = "/pay"}
                        className="w-full py-2 bg-white/5 group-hover:bg-brand-500 group-hover:text-black hover:bg-white/10 text-white font-bold text-[10px] uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5"
                      >
                        <Sparkles size={10} /> Smart Quick-Pay
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Ambient recommendations */}
              <div className="bg-[#09090f] border border-white/5 rounded-3xl p-6 text-left flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Sparkles size={14} className="text-brand-purple" />
                    AI Recommendations
                  </h3>
                  <p className="text-xs text-zinc-500 mb-6">Engine insights matching your daily routine.</p>

                  <div className="space-y-4">
                    <div className="p-3 bg-white/5 border border-white/5 rounded-2xl text-left">
                      <p className="text-xs font-bold text-white flex items-center gap-1">☕ Smart Morning routine</p>
                      <p className="text-[10px] text-zinc-400 leading-relaxed mt-1">
                        Based on your 8:30 AM pattern, <strong className="text-brand-500">Starbucks POS 3</strong> is pre-authorized. Face match will instantly settle your ledger.
                      </p>
                    </div>
                    
                    <div className="p-3 bg-white/5 border border-white/5 rounded-2xl text-left">
                      <p className="text-xs font-bold text-white flex items-center gap-1">🛡️ Cryptographic Shield</p>
                      <p className="text-[10px] text-zinc-400 leading-relaxed mt-1">
                        Device secure keypair has been verified. Fraud score: <strong className="text-brand-purple">0.001% (SECURE)</strong>.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-white/5 pt-4 mt-6 flex justify-between items-center text-[10px] font-mono text-zinc-500">
                  <span>SYSTEM OVERLAY v1.8</span>
                  <span className="text-brand-500">SHIELD ON</span>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* 2. CARD ACCOUNTS TAB */}
        {activeTab === "cards" && (
          <div className="space-y-8 relative z-10 max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {cards.map(card => (
                <div key={card.id} className={`bg-gradient-to-br ${card.color} border border-white/10 rounded-2xl p-6 flex flex-col justify-between aspect-[1.6/1] shadow-xl`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] text-zinc-400 font-mono uppercase">{card.bank}</p>
                      <h4 className="font-bold text-lg text-white mt-1 uppercase tracking-tight">{card.brand} {card.type}</h4>
                    </div>
                    <span className="text-xs text-zinc-500 font-bold uppercase">{card.brand}</span>
                  </div>

                  <div className="flex justify-between items-end mt-8">
                    <div>
                      <p className="text-[10px] text-zinc-500 font-mono">SECURE TOKEN HASH</p>
                      <p className="text-sm font-semibold text-white mt-0.5 tracking-widest">•••• •••• •••• {card.last4}</p>
                      <p className="text-[9px] text-zinc-500 mt-1 font-mono">Expires: {card.expiry} • Masked ID Sealed</p>
                    </div>
                    <div className="bg-brand-500/10 text-brand-500 border border-brand-500/20 text-[9px] font-bold px-2 py-1 rounded">
                      Secure Vault Lock
                    </div>
                  </div>
                </div>
              ))}

              {/* Add Card simulator */}
              <div className="border-2 border-dashed border-white/5 hover:border-white/10 rounded-2xl flex flex-col items-center justify-center p-6 aspect-[1.6/1] cursor-pointer transition-colors group">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-zinc-500 group-hover:text-brand-500 transition-colors">
                  <Plus size={24} />
                </div>
                <h4 className="font-bold text-xs text-zinc-400 mt-4 uppercase tracking-wider">Compile New Account Token</h4>
                <p className="text-[10px] text-zinc-600 mt-1">Handshake over secure bank OTP API.</p>
              </div>
            </div>
          </div>
        )}

        {/* 3. RECURRING SUBSCRIPTIONS TAB */}
        {activeTab === "recurring" && (
          <div className="space-y-8 relative z-10 max-w-4xl">
            <div className="bg-brand-purple/5 border border-brand-purple/20 p-4 rounded-2xl flex gap-3 mb-6">
              <ShieldAlert className="text-brand-purple shrink-0 mt-0.5" size={18} />
              <div className="text-left">
                <p className="text-xs font-semibold text-white">How Auto-Hover Approval works</p>
                <p className="text-[11px] text-zinc-400 leading-relaxed mt-1">
                  When enabled, Netflix or Spotify billing servers communicate with HoverPay's background BLE beacon registry, automatically settling payments without prompting gesture confirmations. Bypasses late fees instantly.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {subscriptions.map(sub => (
                <div key={sub.id} className="bg-[#09090f] border border-white/5 rounded-2xl p-5 flex justify-between items-center">
                  <div className="text-left">
                    <span className="text-[9px] font-bold text-brand-purple bg-brand-purple/10 px-2 py-0.5 rounded border border-brand-purple/20">
                      {sub.category}
                    </span>
                    <h4 className="font-bold text-sm text-white mt-2">{sub.name}</h4>
                    <p className="text-[10px] text-zinc-500 mt-1 font-mono">Next Bill: {sub.dueDate}</p>
                    <p className="text-xs font-bold text-brand-500 mt-3">{formatCurrency(sub.amount)} / month</p>
                  </div>

                  <div className="text-right flex flex-col items-end justify-between h-full gap-8">
                    <span className={`text-[9px] font-bold font-mono px-2 py-0.5 border rounded-full capitalize ${
                      sub.status === 'active' ? 'bg-brand-500/10 border-brand-500/20 text-brand-500' : 'bg-white/5 border-white/5 text-zinc-500'
                    }`}>
                      {sub.status}
                    </span>

                    <div className="flex items-center gap-2">
                      <span className="text-[9px] text-zinc-500 font-mono">Auto-Hover</span>
                      <button 
                        onClick={() => toggleSubscriptionAutoPay(sub.id)}
                        className={`w-10 h-5 rounded-full p-0.5 transition-colors relative ${sub.autoPay ? 'bg-brand-500' : 'bg-zinc-800'}`}
                      >
                        <div className={`w-4 h-4 bg-black rounded-full transition-transform ${sub.autoPay ? 'translate-x-5' : 'translate-x-0'}`} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. HOVERID METRO TRANSIT ID TAB */}
        {activeTab === "transit" && (
          <div className="space-y-8 relative z-10 max-w-2xl mx-auto">
            <div className="bg-[#09090f] border border-white/10 rounded-3xl p-6 md:p-8 text-center relative overflow-hidden scanline">
              <div className="absolute top-0 right-0 bg-brand-500/10 text-brand-500 text-[10px] font-bold px-4 py-1.5 rounded-bl-2xl border-l border-b border-brand-500/15 uppercase font-mono">
                Active NFC Transit Pass
              </div>

              <div className="my-8 flex justify-center">
                {/* Boarding gate illustration */}
                <div className="w-24 h-24 bg-brand-500/5 border border-brand-500/20 rounded-full flex items-center justify-center text-brand-500">
                  <Train size={48} className="animate-pulse" />
                </div>
              </div>

              <h3 className="text-xl font-bold text-white font-display">HoverID Boarding Pass</h3>
              <p className="text-xs text-zinc-400 mt-2 max-w-sm mx-auto">
                Valid at all Delhi, Mumbai, and Bengaluru Metro gates. Simply hover your phone or NFC ring over the gate scanner to bypass gates instantly.
              </p>

              {/* Transit Stats */}
              <div className="grid grid-cols-3 gap-4 my-8 border-y border-white/5 py-4 text-xs">
                <div>
                  <p className="text-zinc-500">Card Class</p>
                  <p className="font-bold text-white mt-1">SuperExpress</p>
                </div>
                <div>
                  <p className="text-zinc-500">Transit Balance</p>
                  <p className="font-bold text-brand-500 mt-1">₹1,200</p>
                </div>
                <div>
                  <p className="text-zinc-500">Last Boarding</p>
                  <p className="font-bold text-white mt-1">Gate 4 Terminal</p>
                </div>
              </div>

              {/* QR Barcode mock */}
              <div className="p-4 bg-white rounded-xl max-w-xs mx-auto flex flex-col items-center justify-center gap-1.5 opacity-90 shadow-2xl">
                <div className="h-10 w-full bg-black flex justify-around items-center px-2 py-1">
                  {[...Array(24)].map((_, i) => (
                    <div 
                      key={i} 
                      className="h-full bg-white" 
                      style={{ width: `${Math.floor(Math.random() * 4) + 1}px` }} 
                    />
                  ))}
                </div>
                <span className="text-[8px] font-mono text-black font-semibold uppercase tracking-widest mt-1">HOVERID-T9982-GATEBYPASS</span>
              </div>
            </div>
          </div>
        )}

        {/* 5. SETTINGS PANEL TAB */}
        {activeTab === "settings" && (
          <div className="space-y-8 relative z-10 max-w-3xl text-left">
            <div className="bg-[#09090f] border border-white/5 rounded-3xl p-6 space-y-6">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider border-b border-white/5 pb-4">
                Hardware & AI Configurations
              </h3>

              {/* Settings selectors */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Voice Assist */}
                <div className="flex justify-between items-center">
                  <div className="text-left">
                    <h5 className="text-xs font-semibold text-white">Voice Assistant Integration</h5>
                    <p className="text-[10px] text-zinc-500 mt-0.5">Parse voice instructions for billing.</p>
                  </div>
                  <button 
                    onClick={() => updateSettings({ voiceEnabled: !settings.voiceEnabled })}
                    className={`w-10 h-5 rounded-full p-0.5 transition-colors relative ${settings.voiceEnabled ? 'bg-brand-500' : 'bg-zinc-800'}`}
                  >
                    <div className={`w-4 h-4 bg-black rounded-full transition-transform ${settings.voiceEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>

                {/* BLE Scanning */}
                <div className="flex justify-between items-center">
                  <div className="text-left">
                    <h5 className="text-xs font-semibold text-white">BLE Merchant scanning</h5>
                    <p className="text-[10px] text-zinc-500 mt-0.5">Auto-detect closest beacons ambiently.</p>
                  </div>
                  <button 
                    onClick={() => updateSettings({ bleScanning: !settings.bleScanning })}
                    className={`w-10 h-5 rounded-full p-0.5 transition-colors relative ${settings.bleScanning ? 'bg-brand-500' : 'bg-zinc-800'}`}
                  >
                    <div className={`w-4 h-4 bg-black rounded-full transition-transform ${settings.bleScanning ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>

                {/* Biometric strength */}
                <div className="flex flex-col gap-2">
                  <h5 className="text-xs font-semibold text-white">Biometric Security Level</h5>
                  <div className="grid grid-cols-3 gap-2 bg-black p-1 rounded-xl border border-white/5 text-center text-[10px]">
                    {['none', 'finger', 'face'].map(level => (
                      <button 
                        key={level}
                        onClick={() => updateSettings({ biometricLevel: level as any })}
                        className={`py-1.5 rounded-lg capitalize font-medium ${settings.biometricLevel === level ? 'bg-brand-500 text-black font-bold' : 'text-zinc-500'}`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                {/* BLE Ambient Range */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between text-xs text-white">
                    <span className="font-semibold">BLE Beacon Range</span>
                    <span className="text-brand-500 font-mono">{settings.ambientRange} meters</span>
                  </div>
                  <input 
                    type="range" 
                    min="0.5" 
                    max="5.0" 
                    step="0.5" 
                    value={settings.ambientRange}
                    onChange={(e) => updateSettings({ ambientRange: parseFloat(e.target.value) })}
                    className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-brand-500"
                  />
                </div>

              </div>
            </div>

            {/* Simulated mock banking center */}
            <div className="bg-[#09090f] border border-white/5 rounded-3xl p-6">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider border-b border-white/5 pb-4 mb-4">
                Mock Bank Sandbox
              </h3>
              <p className="text-xs text-zinc-400 mb-6">
                Simulate adding money from your linked HDFC Bank account to test transaction flows and limits.
              </p>

              <div className="flex items-center gap-3 max-w-sm">
                <input 
                  type="number" 
                  value={fundsAmount}
                  onChange={(e) => setFundsAmount(e.target.value)}
                  className="bg-black border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-brand-500 font-mono w-full"
                  placeholder="Amount"
                />
                <button 
                  onClick={() => {
                    addFunds(Number(fundsAmount));
                    alert(`₹${Number(fundsAmount).toLocaleString('en-IN')} deposited successfully!`);
                  }}
                  className="bg-brand-500 hover:bg-brand-600 text-black font-bold text-xs px-4 py-2.5 rounded-xl shrink-0 transition-colors"
                >
                  Deposit Funds
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all border ${
        active 
          ? 'bg-brand-500/5 border-brand-500/10 text-white font-bold' 
          : 'border-transparent text-zinc-400 hover:text-white hover:bg-white/5'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function StatCard({ title, value, sub }: any) {
  return (
    <div className="bg-[#09090f] border border-white/5 rounded-3xl p-6 text-left flex-1">
      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">{title}</p>
      <h3 className="text-2xl font-extrabold text-white font-display">{value}</h3>
      <div className="text-[10px] text-zinc-500 mt-2">{sub}</div>
    </div>
  );
}