"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { 
  ArrowLeft, ArrowUpRight, ArrowDownRight, Store, QrCode, Smartphone, 
  Users, Volume2, VolumeX, ShieldCheck, Activity, Brain, ShoppingBag, 
  Plus, Check, Sparkles
} from "lucide-react";
import Link from "next/link";
import QRCode from "react-qr-code";

interface FeedItem {
  id: number;
  amount: number;
  time: string;
  method: string;
  user: string;
  status: "Success" | "Failed";
  type: string;
}

export default function MerchantDashboard() {
  const [feed, setFeed] = useState<FeedItem[]>([
    { id: 1, amount: 340, time: "Just now", method: "HoverPay Gesture", user: "Alex Sharma", status: "Success", type: "HoverPay" },
    { id: 2, amount: 850, time: "3 mins ago", method: "Standard UPI QR", user: "Priya Malik", status: "Success", type: "Standard" },
    { id: 3, amount: 120, time: "8 mins ago", method: "HoverPay Watch Tap", user: "Rahul K.", status: "Success", type: "HoverPay" },
    { id: 4, amount: 4890, time: "12 mins ago", method: "HoverPay Ring Tap", user: "Karan Johar", status: "Success", type: "HoverPay" },
    { id: 5, amount: 450, time: "18 mins ago", method: "Standard UPI QR", user: "Neha Deshmukh", status: "Success", type: "Standard" }
  ]);

  const [voiceSynthesized, setVoiceSynthesized] = useState(true);
  const [revenue, setRevenue] = useState(14500);
  const [txnCount, setTxnCount] = useState(142);
  const [hoverPayShare, setHoverPayShare] = useState(62);
  
  // QR generator states
  const [qrAmount, setQrAmount] = useState("340");
  const [qrActive, setQrActive] = useState(true);
  const [predictedItem, setPredictedItem] = useState("Grande Pumpkin Spice Latte + Croissant");

  // Web Speech Synthesis Announcer
  const announcePayment = (amount: number, user: string) => {
    if (!voiceSynthesized || typeof window === "undefined" || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel(); // stop current speech
      const utterance = new SpeechSynthesisUtterance(`HoverPay of ${amount} rupees received from ${user}.`);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.log("Speech synthesis failed or blocked by autoplay constraints");
    }
  };

  // Simulating real-time incoming transactions
  useEffect(() => {
    const names = ["Aarav S.", "Rohan M.", "Sneha P.", "Vikram G.", "Tanvi K.", "Divya B.", "Kabir T."];
    const methods = [
      { name: "HoverPay Gesture", type: "HoverPay" },
      { name: "HoverPay Ring Tap", type: "HoverPay" },
      { name: "HoverPay Watch Tap", type: "HoverPay" },
      { name: "Standard UPI QR", type: "Standard" }
    ];
    const itemPredictions = [
      { item: "Iced Caramel Macchiato + Espresso Shot", amt: "420" },
      { item: "Cappuccino Single + Blueberry Muffin", amt: "310" },
      { item: "Filter Coffee + Paneer Tikka Wrap", amt: "280" },
      { item: "Cold Brew Double + Chocolate Cookie", amt: "350" }
    ];

    const interval = setInterval(() => {
      const isSuccess = Math.random() > 0.08;
      const amt = Math.floor(Math.random() * 800) + 120;
      const randomName = names[Math.floor(Math.random() * names.length)];
      const randomMethod = methods[Math.floor(Math.random() * methods.length)];

      if (isSuccess) {
        setRevenue(prev => prev + amt);
        setTxnCount(prev => prev + 1);
        if (randomMethod.type === "HoverPay") {
          setHoverPayShare(prev => Math.min(95, parseFloat((prev + 0.3).toFixed(1))));
        } else {
          setHoverPayShare(prev => Math.max(40, parseFloat((prev - 0.2).toFixed(1))));
        }

        // Add to activity feed
        const newTxn: FeedItem = {
          id: Date.now(),
          amount: amt,
          time: "Just now",
          method: randomMethod.name,
          user: randomName,
          status: "Success",
          type: randomMethod.type
        };

        setFeed(prev => [newTxn, ...prev.slice(0, 5)]);

        // Announce voice synthesis
        announcePayment(amt, randomName);

        // Periodically update AI terminal predicted register checkout QR amount
        if (Math.random() > 0.6) {
          const predict = itemPredictions[Math.floor(Math.random() * itemPredictions.length)];
          setPredictedItem(predict.item);
          setQrAmount(predict.amt);
        }
      }
    }, 9000); // Trigger transaction flow every 9 seconds

    return () => clearInterval(interval);
  }, [voiceSynthesized]);

  return (
    <div className="min-h-screen bg-[#030303] text-zinc-100 flex flex-col font-sans selection:bg-brand-500/30">
      
      {/* Navigation header */}
      <nav className="border-b border-white/5 bg-[#050508]/80 backdrop-blur-xl px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-zinc-500 hover:text-zinc-300 w-9 h-9 border border-white/5 rounded-xl bg-white/5 flex items-center justify-center transition-colors">
            <ArrowLeft size={16} />
          </Link>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-brand-purple/20 border border-brand-purple/30 rounded-xl flex items-center justify-center text-brand-purple font-bold">
              <Store size={18} />
            </div>
            <div className="text-left">
              <span className="font-semibold text-white text-sm">Starbucks Terminal #4</span>
              <p className="text-[10px] text-zinc-500 font-mono">Status: Connected to UPI Network</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setVoiceSynthesized(!voiceSynthesized)}
            className={`flex items-center gap-2 border px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
              voiceSynthesized 
                ? 'bg-brand-500/10 border-brand-500/20 text-brand-500 font-bold' 
                : 'bg-white/5 border-white/5 text-zinc-500'
            }`}
          >
            {voiceSynthesized ? <Volume2 size={14} /> : <VolumeX size={14} />}
            <span>Voice Audio Alerts</span>
          </button>

          <button className="flex items-center gap-2 bg-brand-500 text-black px-4 py-2 rounded-xl text-xs font-bold hover:bg-brand-600 transition-colors">
            <QrCode size={14} /> POS Handshake
          </button>
        </div>
      </nav>

      {/* Main Terminal Area */}
      <main className="container mx-auto px-6 py-10 flex-1 flex flex-col lg:flex-row gap-8 relative z-10">
        
        {/* Decorative ambient blur */}
        <div className="absolute bottom-0 left-0 w-[40%] h-[30%] bg-brand-500/3 blur-[120px] pointer-events-none" />

        {/* Left Side: Stats and Activity Ledger */}
        <div className="flex-1 space-y-8 text-left">
          
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white font-display">Sales Terminal Metrics</h1>
            <p className="text-xs text-zinc-500 mt-1">Real-time point of sale transaction details.</p>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <StatBox title="Today's Sales" value={`₹${revenue.toLocaleString('en-IN')}`} trend="+14.2%" up />
            <StatBox title="Clearance count" value={txnCount.toString()} trend="+8.4%" up />
            <StatBox title="Dispute Rate" value="0.00%" label="Guaranteed secure" />
            <StatBox title="Average speed" value="0.8s" label="UPI Lite route active" />
          </div>

          {/* Incoming activity ledger feed */}
          <div className="bg-[#09090f] border border-white/5 rounded-3xl p-6 relative overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="text-brand-500 animate-pulse" size={16} /> Live Transaction Feed
              </h3>
              <span className="text-[10px] text-zinc-500 font-mono">Listening for BLE gesture triggers...</span>
            </div>

            <div className="space-y-3">
              <AnimatePresence>
                {feed.map((item) => (
                  <motion.div 
                    key={item.id}
                    layoutId={`merchant-feed-${item.id}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-3.5 bg-black border border-white/5 rounded-2xl flex justify-between items-center hover:border-brand-500/20 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#0a0a0f] flex items-center justify-center border border-white/5 text-lg">
                        {item.type === "HoverPay" ? "⚡" : "📱"}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white group-hover:text-brand-500 transition-colors">{item.user}</p>
                        <p className="text-[9px] text-zinc-500 font-mono mt-0.5">{item.method} • {item.time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-white">₹{item.amount}</p>
                      <span className="text-[8px] font-bold text-brand-500 font-mono bg-brand-500/5 px-2 py-0.5 rounded border border-brand-500/10 mt-1 inline-block uppercase">
                        Settle Complete
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

        </div>

        {/* Right Side: Live QR Code & AI Prediction Board */}
        <div className="w-full lg:w-96 space-y-6 text-left">
          
          {/* AI predicted purchase QR generator */}
          <div className="bg-[#09090f] border border-white/5 rounded-3xl p-6 flex flex-col justify-between items-center text-center relative scanline">
            <div className="w-full flex justify-between items-center text-[9px] font-mono text-zinc-500 mb-6">
              <span className="flex items-center gap-1 text-brand-purple">
                <Brain size={12} /> AI Register Prediction
              </span>
              <span>Pos terminal v4.1</span>
            </div>

            {/* AI suggestion panel */}
            <div className="w-full bg-brand-purple/5 border border-brand-purple/20 rounded-2xl p-3 mb-6 flex items-start gap-3 text-left">
              <ShoppingBag size={18} className="text-brand-purple shrink-0 mt-0.5" />
              <div>
                <p className="text-[9px] font-bold font-mono text-brand-purple uppercase">Predicted Register Queue Item</p>
                <p className="text-xs text-white mt-0.5 leading-snug font-semibold">{predictedItem}</p>
              </div>
            </div>

            {/* Dynamic QR Output */}
            {qrActive && (
              <div className="p-4 bg-white rounded-2xl inline-block mb-6 shadow-2xl relative border border-brand-500/20">
                <QRCode 
                  value={`upi://pay?pa=starbucks@okicici&pn=Starbucks&am=${qrAmount}&cu=INR`} 
                  size={160} 
                  fgColor="#030303"
                />
              </div>
            )}

            <div className="w-full mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-zinc-400 font-medium">Terminal Bill Amount</span>
                <span className="text-xs text-brand-500 font-mono">UPI Intent Prefilled</span>
              </div>
              <div className="flex items-center gap-2 justify-center bg-black border border-white/5 rounded-xl px-4 py-2.5">
                <span className="text-sm font-semibold text-zinc-500">₹</span>
                <input 
                  type="number" 
                  value={qrAmount}
                  onChange={(e) => setQrAmount(e.target.value)}
                  className="bg-transparent text-xl font-extrabold text-white w-full outline-none font-mono text-center focus:border-transparent" 
                />
              </div>
            </div>

            <p className="text-[10px] text-zinc-500 font-mono max-w-[220px]">
              BLE Beacons emit this checkout configuration ambiently to devices inside 1.5 meters.
            </p>
                 {/* AI Customer Recognition & Loyalty Engine */}
          <div className="bg-[#09090f] border border-white/5 rounded-3xl p-6 text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-brand-purple/10 text-brand-purple text-[8px] font-bold px-2.5 py-1 rounded-bl-xl border-l border-b border-brand-purple/15 uppercase font-mono animate-pulse">
              Loyalty Engine Sync
            </div>

            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-1.5">
              <Brain size={12} className="text-brand-purple" />
              Proximity Customer AI
            </h3>

            <div className="space-y-4">
              {/* Active Proximity Lock */}
              <div className="bg-black/60 border border-white/5 rounded-2xl p-3.5 flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-bold font-mono text-zinc-500 uppercase">ACTIVE RADAR MATCH</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-500 animate-ping" />
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-sm font-bold text-brand-500">
                    👤
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Prathik (HoverID verified)</p>
                    <p className="text-[9px] text-brand-500 font-mono mt-0.5">Customer Proximity Lock: 99.82% Confidence</p>
                  </div>
                </div>
              </div>

              {/* Loyalty Insights */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-zinc-400">
                  <span>Customer Tier</span>
                  <span className="text-brand-500 font-bold uppercase tracking-wider font-mono">Elite Platinum</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Visit History</span>
                  <span className="text-white font-mono">14 checkouts this month</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Loyalty Discount AI</span>
                  <span className="text-brand-purple font-bold font-mono">15% Coupon auto-applied</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Queue Bypass status</span>
                  <span className="text-white font-bold bg-white/5 px-2 py-0.5 rounded text-[9px] uppercase font-mono">Bypass Active</span>
                </div>
              </div>

              <div className="h-px bg-white/5 my-2" />

              {/* Queue reduction stats */}
              <div className="flex justify-between items-center text-[10px] text-zinc-500 font-mono">
                <span>Queue reduction: -4.2 mins</span>
                <span className="text-brand-purple font-bold">1-Wave Checkout ready</span>
              </div>
            </div>
          </div>       </div>

        </div>

      </main>
    </div>
  );
}

function StatBox({ title, value, trend, label, up }: any) {
  return (
    <div className="bg-[#09090f] border border-white/5 rounded-3xl p-5 flex flex-col justify-between text-left">
      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">{title}</p>
      <div>
        <h3 className="text-xl font-extrabold text-white font-display">{value}</h3>
        {trend && (
          <div className={`inline-flex items-center gap-0.5 text-[9px] font-bold mt-1.5 ${up ? 'text-brand-500' : 'text-zinc-500'}`}>
            {up ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
            {trend} from yesterday
          </div>
        )}
        {label && <p className="text-[9px] text-zinc-500 mt-1.5 font-mono">{label}</p>}
      </div>
    </div>
  );
}