"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { 
  Hand, Smartphone, ShieldCheck, ArrowRight, Zap, Cpu, Sparkles, 
  Layers, Lock, Eye, Wifi, RefreshCw, BarChart3, Radio, ArrowUpRight, 
  Users, CheckCircle2, ChevronRight, Activity, Terminal, Check, Watch
} from "lucide-react";

export default function Home() {
  const [activeStep, setActiveStep] = useState(0);
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [simState, setSimState] = useState<"idle" | "nearby" | "verify" | "processing" | "success" | "receipt">("idle");
  const [simProgress, setSimProgress] = useState(0);
  const [simLogs, setSimLogs] = useState<string[]>([]);
  const [activeVertical, setActiveVertical] = useState<"metro" | "society" | "campus" | "retail">("metro");
  const [activePipeStep, setActivePipeStep] = useState<number | null>(null);
  
  const triggerSimulation = () => {
    if (simState !== "idle") return;
    setSimState("nearby");
    setSimLogs(["Scanning BLE spectra...", "Detected 2.4GHz beacon from Starbucks ID: STB-8890", "Distance calculated: 0.35m"]);
    
    setTimeout(() => {
      setSimState("verify");
      setSimLogs(prev => [...prev, "Proximity threshold cleared. Starting Enclave Session...", "Awaiting touchless gesture confirmation...", "Processing hand landmarks..."]);
      
      let p = 0;
      const interval = setInterval(() => {
        p += 10;
        setSimProgress(p);
        if (p >= 100) {
          clearInterval(interval);
          setSimState("processing");
          setSimLogs(prev => [...prev, "Gesture confirmed (100% match)", "Compiling cryptographic token hash...", "Routing to UPI Lite network gateway..."]);
          
          setTimeout(() => {
            setSimState("success");
            setSimLogs(prev => [...prev, "Gateway response: CODE-200 (Success)", "UPI Ref: 438912889120", "Ledger settled in 0.72s"]);
            
            // play double high-fidelity chime
            try {
              const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
              const playChime = (freq: number, delay: number, dur: number) => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.type = "sine";
                osc.frequency.setValueAtTime(freq, audioCtx.currentTime + delay);
                gain.gain.setValueAtTime(0.08, audioCtx.currentTime + delay);
                gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + delay + dur);
                osc.start(audioCtx.currentTime + delay);
                osc.stop(audioCtx.currentTime + delay + dur);
              };
              playChime(660, 0, 0.15); // E5
              playChime(880, 0.08, 0.25); // A5
            } catch (e) {
              console.log("Audio contexts blocked or unsupported");
            }
            
            setTimeout(() => {
              setSimState("receipt");
            }, 2000);
          }, 1500);
        }
      }, 100);
    }, 2000);
  };

  const resetSimulation = () => {
    setSimState("idle");
    setSimProgress(0);
    setSimLogs([]);
  };

  const [liveTxns, setLiveTxns] = useState([
    { id: 1, name: "Starbucks Register 3", amount: 340, time: "Just now", city: "Mumbai", verified: "On-Device Handpose" },
    { id: 2, name: "Metro Gate 4 Transit", amount: 45, time: "1 min ago", city: "Delhi", verified: "NFC Ring Bypass" },
    { id: 3, name: "Croma Electronics", amount: 24500, time: "3 min ago", city: "Bengaluru", verified: "Face Unlock + BLE" },
    { id: 4, name: "HDFC Payment Gateway", amount: 1200, time: "5 min ago", city: "Pune", verified: "Offline Secure Token" }
  ]);

  // Periodic simulated live transaction ledger
  useEffect(() => {
    const merchants = [
      { name: "Blue Tokai Coffee", amount: 280, city: "Delhi", verified: "On-Device Handpose" },
      { name: "Zara Fashion Terminal", amount: 3890, city: "Mumbai", verified: "NFC Ring Bypass" },
      { name: "Airtel Auto-Subscription", amount: 799, city: "Kolkata", verified: "AI Auto-Hover" },
      { name: "Society Grocery Store", amount: 420, city: "Chennai", verified: "BLE Background Auth" },
      { name: "Metro Gate 2 Transit", amount: 60, city: "Hyderabad", verified: "Express Gate Bypass" }
    ];

    const interval = setInterval(() => {
      const randomMerch = merchants[Math.floor(Math.random() * merchants.length)];
      setLiveTxns(prev => [
        {
          id: Date.now(),
          name: randomMerch.name,
          amount: randomMerch.amount,
          time: "Just now",
          city: randomMerch.city,
          verified: randomMerch.verified
        },
        ...prev.slice(0, 3)
      ]);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen selection:bg-brand-500/30 flex flex-col relative bg-[#030303]">
      {/* Background Decorative Blobs */}
      <div className="absolute top-[20%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-purple/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-brand-500/3 blur-[120px] pointer-events-none" />

      {/* Navigation */}
      <nav className="border-b border-white/5 bg-[#030303]/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-500 transition-all duration-300 group-hover:scale-105 group-hover:bg-brand-500/20">
              <Hand className="transform group-hover:rotate-12 transition-transform duration-300" size={20} />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-white group-hover:text-brand-500 transition-colors">
              Hover<span className="text-brand-500">Pay</span>
            </span>
          </Link>
          <div className="hidden md:flex gap-8 text-sm font-medium text-zinc-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">Mechanism</a>
            <a href="#architecture" className="hover:text-white transition-colors">Architecture</a>
            <Link href="/dashboard" className="hover:text-white transition-colors flex items-center gap-1">
              Consumer Portal <ArrowUpRight size={14} />
            </Link>
            <Link href="/merchant" className="hover:text-white transition-colors flex items-center gap-1">
              Merchant Terminal <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/pay" className="relative group overflow-hidden bg-brand-500 text-black px-5 py-2.5 rounded-xl font-semibold text-sm hover:shadow-[0_0_20px_rgba(0,255,170,0.4)] transition-all duration-300">
              <span className="relative z-10 flex items-center gap-1.5">
                Launch Live Demo <Sparkles size={16} />
              </span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        <div className="container mx-auto max-w-6xl flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 text-left">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-500/20 bg-brand-500/5 text-xs font-semibold text-brand-500 mb-6"
            >
              <Zap size={12} className="animate-pulse" />
              <span>INDIA'S FIRST AMBIENT TOUCHLESS PROTOCOL</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.1] mb-6"
            >
              Complete UPI payments in <span className="text-gradient-purple font-extrabold">under 1 second.</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-zinc-400 text-lg md:text-xl max-w-xl mb-8 leading-relaxed"
            >
              Wave. Pay. Go. Connect to localized merchant beacons and verify intent ambiently without ever opening your wallet, tapping screens, or scanning a QR code.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link href="/pay" className="px-6 py-4 bg-brand-500 text-black font-bold rounded-xl hover:bg-brand-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-500/10">
                Launch Live App <ArrowRight size={18} />
              </Link>
              <button 
                onClick={triggerSimulation}
                disabled={simState !== "idle"}
                className="px-6 py-4 bg-white/5 border border-white/10 hover:border-white/20 text-white font-semibold rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {simState === "idle" ? "Simulate Ambient Pay" : "Simulation In Progress..."}
              </button>
            </motion.div>

            {/* Micro Stats */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-3 gap-6 border-t border-white/5 pt-10 mt-12"
            >
              <div>
                <p className="text-2xl font-bold text-white font-display">0.72s</p>
                <p className="text-xs text-zinc-500 mt-1">Average Latency</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white font-display">0.002%</p>
                <p className="text-xs text-zinc-500 mt-1">Fraud Risk Score</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white font-display">Zero</p>
                <p className="text-xs text-zinc-500 mt-1">Accidental Scans</p>
              </div>
            </motion.div>
          </div>

          {/* Interactive Hero Device Widget */}
          <div className="flex-1 w-full max-w-md lg:max-w-none flex justify-center z-10">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative w-full max-w-sm"
            >
              {/* Glow effects */}
              <div className="absolute -inset-1 rounded-[40px] bg-gradient-to-r from-brand-500 to-brand-purple opacity-20 blur-2xl group-hover:opacity-30 transition duration-1000" />
              
              <div className="relative bg-[#09090f] border border-white/10 rounded-[36px] p-6 shadow-2xl">
                {/* Phone Notch */}
                <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-full flex items-center justify-center gap-1.5 px-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                  <div className="flex-1 h-1.5 bg-zinc-900 rounded-full" />
                </div>

                {/* Simulated Screen */}
                <div className="mt-6 rounded-2xl bg-black border border-white/5 p-4 flex flex-col items-center min-h-[360px] justify-between relative overflow-hidden">
                  
                  {/* IDLE STATE */}
                  {simState === "idle" && (
                    <div className="w-full flex-1 flex flex-col justify-between items-center py-2">
                      <div className="w-full flex justify-between items-center text-[10px] text-zinc-400 font-mono">
                        <span>Active BLE Radar</span>
                        <span className="flex items-center gap-1 text-zinc-500">
                          <span className="h-1.5 w-1.5 rounded-full bg-zinc-500 animate-ping" />
                          Idle
                        </span>
                      </div>
                      
                      <div className="my-6 text-center">
                        <div className="w-32 h-32 rounded-full border border-dashed border-white/10 flex items-center justify-center relative mx-auto mb-4">
                          <div className="absolute inset-4 rounded-full border border-brand-500/10 animate-ping" />
                          <Smartphone size={32} className="text-zinc-500" />
                        </div>
                        <p className="text-sm font-semibold text-white font-display">Awaiting Merchant Beacon</p>
                        <p className="text-xs text-zinc-500 mt-1 max-w-[200px] mx-auto">Walk within 1 meter of a HoverPay register to activate.</p>
                      </div>

                      <button 
                        onClick={triggerSimulation}
                        className="w-full py-3 rounded-xl bg-brand-500/10 hover:bg-brand-500/20 text-brand-500 border border-brand-500/20 font-bold text-xs transition-colors"
                      >
                        Simulate Ambient Pay
                      </button>
                    </div>
                  )}

                  {/* NEARBY DETECTED STATE */}
                  {simState === "nearby" && (
                    <div className="w-full flex-1 flex flex-col justify-between py-2">
                      <div className="w-full flex justify-between items-center text-[10px] text-brand-500 font-mono">
                        <span>Active BLE Radar</span>
                        <span className="flex items-center gap-1 text-brand-500">
                          <span className="h-1.5 w-1.5 rounded-full bg-brand-500 animate-ping" />
                          Resolving...
                        </span>
                      </div>

                      <div className="my-6 bg-[#0a0a0f] border border-brand-500/20 rounded-2xl p-4 flex items-center gap-4 relative animate-pulse">
                        <div className="absolute -top-2.5 left-4 bg-brand-500/20 text-brand-500 border border-brand-500/30 px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider font-mono">
                          AI Distance Lock
                        </div>
                        <div className="w-10 h-10 rounded-full bg-brand-500/10 flex items-center justify-center text-xl">☕</div>
                        <div className="text-left flex-1">
                          <p className="font-semibold text-white text-xs">Starbucks Register 3</p>
                          <p className="text-[9px] text-zinc-500">Predicted • Cafe Coffee</p>
                        </div>
                        <div className="text-right text-[10px] text-brand-500 font-bold font-mono">
                          0.35m
                        </div>
                      </div>

                      <div className="text-center text-xs text-zinc-400 font-mono">
                        Calculating risk index score...
                      </div>
                    </div>
                  )}

                  {/* VERIFY STATE */}
                  {simState === "verify" && (
                    <div className="w-full flex-1 flex flex-col justify-between py-2">
                      <div className="w-full flex justify-between items-center text-[10px] text-brand-purple font-mono">
                        <span>Touchless Gesture Scan</span>
                        <span>{simProgress}% matched</span>
                      </div>

                      <div className="w-32 h-32 rounded-full border-2 border-dashed border-brand-purple/20 flex items-center justify-center relative mx-auto my-4">
                        <div className="absolute inset-2 rounded-full border border-brand-500/20 radar-ring" />
                        <div className="absolute inset-4 rounded-full bg-brand-purple/5 flex flex-col items-center justify-center">
                          <motion.div
                            animate={{ scale: [1, 1.15, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="text-brand-purple"
                          >
                            <Hand size={28} />
                          </motion.div>
                        </div>
                      </div>

                      <div className="w-full bg-[#0a0a0f] border border-white/5 rounded-xl p-3 flex justify-between items-center text-[10px]">
                        <span className="text-zinc-500">Securing:</span>
                        <span className="font-medium text-white font-mono">Enclave Session Active</span>
                      </div>
                    </div>
                  )}

                  {/* PROCESSING STATE */}
                  {simState === "processing" && (
                    <div className="w-full flex-1 flex flex-col justify-between items-center py-2">
                      <div className="w-full flex justify-between items-center text-[10px] text-zinc-500 font-mono">
                        <span>Enclave Session Vault</span>
                        <span>Sealing...</span>
                      </div>

                      <div className="my-6 text-center">
                        <div className="w-16 h-16 rounded-full bg-brand-purple/10 border border-brand-purple/30 flex items-center justify-center mx-auto mb-4 animate-spin text-brand-purple">
                          <Cpu size={24} />
                        </div>
                        <p className="text-xs font-semibold text-white font-mono">Zero-Knowledge Key exchange</p>
                        <p className="text-[10px] text-zinc-500 mt-1">Generating ephemeral token hash...</p>
                      </div>

                      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-brand-purple to-brand-500 w-2/3 rounded-full animate-pulse" />
                      </div>
                    </div>
                  )}

                  {/* SUCCESS STATE */}
                  {simState === "success" && (
                    <div className="w-full flex-1 flex flex-col justify-center items-center py-6 text-center animate-bounce">
                      <div className="w-16 h-16 bg-brand-500/10 border border-brand-500/30 rounded-full flex items-center justify-center mb-4 text-brand-500 shadow-[0_0_30px_rgba(0,255,170,0.2)]">
                        <Check size={28} className="animate-pulse" />
                      </div>
                      <h3 className="text-lg font-bold text-white font-display">Payment Resolved</h3>
                      <p className="text-brand-500 text-sm font-mono font-bold mt-1">₹340 Settled</p>
                    </div>
                  )}

                  {/* DIGITAL RECEIPT STATE */}
                  {simState === "receipt" && (
                    <div className="w-full flex-1 flex flex-col justify-between py-2 text-left">
                      <div className="w-full flex justify-between items-center text-[9px] text-brand-500 font-mono font-bold">
                        <span>UPI LITE INVOICE RECEIPT</span>
                        <span>HPX8892019</span>
                      </div>

                      <div className="w-full bg-[#030305] border border-white/5 rounded-2xl p-4 my-4 space-y-2 text-[10px] font-mono text-zinc-400">
                        <div className="flex justify-between">
                          <span>Merchant:</span>
                          <span className="text-white font-bold">Starbucks Register 3</span>
                        </div>
                        <div className="flex justify-between">
                          <span>UPI Ref:</span>
                          <span className="text-white">438912889120</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Verification:</span>
                          <span className="text-brand-500 font-bold">Handpose (MediaPipe)</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Latency:</span>
                          <span className="text-white font-bold">0.72 seconds</span>
                        </div>
                        <div className="flex justify-between border-t border-white/5 pt-2">
                          <span>Account:</span>
                          <span className="text-white font-bold">ZKS Token Wallet</span>
                        </div>
                        <div className="flex justify-between text-brand-500 font-bold">
                          <span>Final Amount:</span>
                          <span>₹340.00</span>
                        </div>
                      </div>

                      <button 
                        onClick={resetSimulation}
                        className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-[10px] font-mono transition-colors text-center"
                      >
                        Reset Walkthrough Simulator
                      </button>
                    </div>
                  )}

                </div>

                {/* Simulated Telemetry Log Panel */}
                <div className="mt-4 p-3 bg-black rounded-xl border border-white/5 font-mono text-[9px] text-zinc-500 text-left h-24 overflow-y-auto space-y-0.5">
                  <p className="text-brand-500 font-bold uppercase tracking-wider text-[8px] mb-1">Telemetry Enclave Logs</p>
                  {simLogs.length === 0 ? (
                    <p className="text-zinc-600 italic">No telemetry data. Click 'Simulate Ambient Pay' to run walkthrough...</p>
                  ) : (
                    simLogs.map((log, idx) => (
                      <p key={idx}>&gt; {log}</p>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trusted By / Marquee */}
      <section className="py-12 border-y border-white/5 bg-[#050508]/50">
        <div className="container mx-auto px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-6">Redefining Payment Architecture with Leaders</p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-40">
            <span className="text-white font-bold font-display tracking-widest text-lg md:text-xl">HDFC BANK</span>
            <span className="text-white font-bold font-display tracking-widest text-lg md:text-xl">ICICI BANK</span>
            <span className="text-white font-bold font-display tracking-widest text-lg md:text-xl">SBI</span>
            <span className="text-white font-bold font-display tracking-widest text-lg md:text-xl">STARBUCKS</span>
            <span className="text-white font-bold font-display tracking-widest text-lg md:text-xl">CROMA</span>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6 relative" id="features">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-white mb-4">Designed for absolute speed.</h2>
            <p className="text-zinc-400 text-lg">Every feature optimized to strip away latency, interaction friction, and cognitive load.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Cpu className="text-brand-500" size={24} />}
              title="Edge AI Merchant Prediction"
              desc="Pre-resolves merchant endpoints by cross-referencing your device's BLE signal history, time of day, and location nodes."
            />
            <FeatureCard 
              icon={<Radio className="text-brand-500" size={24} />}
              title="Ambient Auth Layer"
              desc="Scans BLE beacons and matches local hand gestures on-device. The user never needs to manually unlock, open an app, or target a camera."
            />
            <FeatureCard 
              icon={<Layers className="text-brand-500" size={24} />}
              title="Zero-Knowledge Secure Tokens"
              desc="No credit card details or UPI PIN is transmitted. High-entropy single-use cryptographic tokens authorize transactions at the network level."
            />
            <FeatureCard 
              icon={<Activity className="text-brand-500" size={24} />}
              title="Express Metro Mode"
              desc="Enables instant transit gate entry. Pass through metro terminals by waving your Hover Ring or Wearable near the gate sensors."
            />
            <FeatureCard 
              icon={<Wifi className="text-brand-500" size={24} />}
              title="Dual Offline Voucher Routing"
              desc="No cellular connection? HoverPay uses encrypted offline voucher pools verified by secure enclaves to resolve payments offline."
            />
            <FeatureCard 
              icon={<Lock className="text-brand-500" size={24} />}
              title="Local Gesture Classifier"
              desc="Processes hand coordinates directly in the browser using dynamic TensorFlow models. Zero image data is ever uploaded."
            />
          </div>
        </div>
      </section>

      {/* Ambient Infrastructure Verticals Section */}
      <section className="py-24 px-6 relative bg-gradient-to-b from-[#030303] to-[#050508]" id="ambient-verticals">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-500/20 bg-brand-500/5 text-xs font-semibold text-brand-500 mb-4"
            >
              <Sparkles size={12} />
              <span>AMBIENT INFRASTRUCTURE LAYER</span>
            </motion.div>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-white mb-4">Zero queuing. Zero scanning.</h2>
            <p className="text-zinc-400 text-lg">HoverPay transitions UPI from active user interactions to invisible ambient clearing.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            {/* Verticals Stepper Selector */}
            <div className="space-y-3 lg:col-span-1">
              {[
                { id: "metro", title: "HoverPay Metro", desc: "Express gate transit clearing via wearable RSSI locks." },
                { id: "society", title: "HoverPay Society", desc: "Walk-out clearing at local gated community stores." },
                { id: "campus", title: "HoverPay Campus", desc: "Zero-friction cafeteria and student retail routing." },
                { id: "retail", title: "HoverPay Retail", desc: "Seamless grab-and-go experience at corporate hubs." }
              ].map((v) => (
                <button
                  key={v.id}
                  onClick={() => setActiveVertical(v.id as any)}
                  className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 flex items-start gap-4 ${
                    activeVertical === v.id 
                      ? 'bg-brand-500/5 border-brand-500/30 text-white shadow-[0_0_20px_rgba(0,255,170,0.02)]' 
                      : 'bg-[#09090f]/50 border-white/5 text-zinc-400 hover:bg-white/5 hover:border-white/10'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-sm ${activeVertical === v.id ? 'bg-brand-500/10 text-brand-500 border border-brand-500/20' : 'bg-white/5 text-zinc-500 border border-transparent'}`}>
                    {v.id === "metro" && "🚇"}
                    {v.id === "society" && "🏡"}
                    {v.id === "campus" && "🎓"}
                    {v.id === "retail" && "🛍️"}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm font-display">{v.title}</h4>
                    <p className="text-xs text-zinc-500 mt-1 leading-relaxed">{v.desc}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Vertical Real-Time Visual Telemetry Panel */}
            <div className="lg:col-span-2 bg-[#09090f] border border-white/10 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-2xl min-h-[380px] flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />
              
              {/* Header HUD */}
              <div className="flex justify-between items-center pb-4 border-b border-white/5 text-xs font-mono text-zinc-500">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-brand-500 animate-pulse" />
                  AMBIENT NODE IN-RANGE
                </span>
                <span>TELEMETRY FEED v1.9</span>
              </div>

              {/* Dynamic Visual Mock per Vertical */}
              <div className="my-6 flex-1 flex flex-col justify-center">
                {activeVertical === "metro" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div className="text-left space-y-4">
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-brand-500/10 border border-brand-500/20 text-brand-500 font-mono text-[9px] font-bold uppercase">
                        Active Proximity Lock
                      </div>
                      <h3 className="text-xl font-bold text-white font-display">Bypass Metro Turnstiles</h3>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        Pass through Delhi or Mumbai metro gates by waving your hand or ring. Telemetry maps your path, connects to the transit beacon, and clears the gate in 0.12s.
                      </p>
                    </div>
                    <div className="bg-[#030305] border border-white/5 rounded-2xl p-4 font-mono text-[10px] space-y-2 text-zinc-500 text-left">
                      <p className="text-brand-500 font-bold">&gt; RSSI Signal Lock: -56dBm (Strong)</p>
                      <p>&gt; Merchant: DMRC Gate 4 Entry</p>
                      <p>&gt; Wearable payload verified via Enclave</p>
                      <p>&gt; UPI Ref: HPX77810294</p>
                      <p className="text-white font-bold">&gt; Gate clearance: GRANTED (₹45.00 settled)</p>
                    </div>
                  </div>
                )}

                {activeVertical === "society" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div className="text-left space-y-4">
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-brand-purple/10 border border-brand-purple/20 text-brand-purple font-mono text-[9px] font-bold uppercase">
                        AI Autopilot Checkout
                      </div>
                      <h3 className="text-xl font-bold text-white font-display">Apartment Supermarket Walks</h3>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        Pick up daily items at your housing society store. Ambient sensors match your HoverID key as you walk past the checkout threshold, resolving the ledger securely.
                      </p>
                    </div>
                    <div className="bg-[#030305] border border-white/5 rounded-2xl p-4 font-mono text-[10px] space-y-2 text-zinc-500 text-left">
                      <p className="text-brand-purple font-bold">&gt; Proximity anchor connected: SOC-STORE-1</p>
                      <p>&gt; Cart identified: 3 items (Milk, Bread, Butter)</p>
                      <p>&gt; Identity check: Enclave Hash matched</p>
                      <p>&gt; Network: cleared via primary UPI Lite</p>
                      <p className="text-white font-bold">&gt; Settlement: ₹210.00 (Success)</p>
                    </div>
                  </div>
                )}

                {activeVertical === "campus" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div className="text-left space-y-4">
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-brand-500/10 border border-brand-500/20 text-brand-500 font-mono text-[9px] font-bold uppercase">
                        Smart Hub Integration
                      </div>
                      <h3 className="text-xl font-bold text-white font-display">Campus & Corporate Canteens</h3>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        Skip cafeteria queues entirely. Ambient registers calculate your food tray invoice and settle the balance through local sub-second handshakes.
                      </p>
                    </div>
                    <div className="bg-[#030305] border border-white/5 rounded-2xl p-4 font-mono text-[10px] space-y-2 text-zinc-500 text-left">
                      <p className="text-brand-500 font-bold">&gt; Beacon matched: IIT Cafeteria POS 3</p>
                      <p>&gt; Tray image scan matched: Tray ID #4819</p>
                      <p>&gt; Authentication: On-Device Handpose verified</p>
                      <p>&gt; Voucher Code: Campus-Lite active</p>
                      <p className="text-white font-bold">&gt; Settle Code: CODE-200 (₹180.00)</p>
                    </div>
                  </div>
                )}

                {activeVertical === "retail" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div className="text-left space-y-4">
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-brand-purple/10 border border-brand-purple/20 text-brand-purple font-mono text-[9px] font-bold uppercase">
                        Enterprise API clearing
                      </div>
                      <h3 className="text-xl font-bold text-white font-display">Walk-Out Retail</h3>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        Seamless grab-and-go experience. Ambient secure tunnels process checkouts as you exit multi-lane retail thresholds, with instant phone chimes confirming clearance.
                      </p>
                    </div>
                    <div className="bg-[#030305] border border-white/5 rounded-2xl p-4 font-mono text-[10px] space-y-2 text-zinc-500 text-left">
                      <p className="text-brand-purple font-bold">&gt; Connected to Gateway: RETAIL-HUB-MUM</p>
                      <p>&gt; Threshold crossed: exit gate 2</p>
                      <p>&gt; Token cleared: HPX-ZKS-88910</p>
                      <p>&gt; Latency benchmark: 0.68s</p>
                      <p className="text-white font-bold">&gt; Cleared: ₹1250.00 settled successfully</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Explainer footer */}
              <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[10px] text-zinc-500">
                <span>Security Vault: RBI compliance cleared</span>
                <span>NPCI token pipeline active</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Wearable Ecosystem Studio Section */}
      <section className="py-24 px-6 border-t border-white/5 bg-[#030303]" id="wearables">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-500/20 bg-brand-500/5 text-xs font-semibold text-brand-500 mb-4"
            >
              <Watch size={12} />
              <span>HARDWARE SYNC V2</span>
            </motion.div>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-white mb-4">Go completely phone-free.</h2>
            <p className="text-zinc-400 text-lg">Provision secure cryptographic key pairs directly onto smart wearables for tap-free ambient clearances.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Ring Card */}
            <div className="glass-card p-6 flex flex-col justify-between text-left relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-500/5 rounded-full blur-xl group-hover:bg-brand-500/10 transition-colors" />
              <div>
                <div className="w-12 h-12 rounded-xl bg-brand-500/5 border border-brand-500/10 flex items-center justify-center mb-6 text-2xl group-hover:scale-110 transition-transform">
                  💍
                </div>
                <h3 className="text-lg font-bold text-white mb-2">HoverRing</h3>
                <p className="text-xs text-zinc-400 leading-relaxed mb-6">
                  Liquid-metal cyber-ring embedded with active BLE antennas and passive high-coercivity NFC microchips. Clears metro gates with a simple hand wave.
                </p>
              </div>
              <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[10px] font-mono">
                <span className="text-zinc-500">PROVISION</span>
                <span className="text-brand-500 font-bold uppercase">Keys Synced (Active)</span>
              </div>
            </div>

            {/* Watch Card */}
            <div className="glass-card p-6 flex flex-col justify-between text-left relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-purple/5 rounded-full blur-xl group-hover:bg-brand-purple/10 transition-colors" />
              <div>
                <div className="w-12 h-12 rounded-xl bg-brand-purple/5 border border-brand-purple/10 flex items-center justify-center mb-6 text-2xl group-hover:scale-110 transition-transform">
                  ⌚
                </div>
                <h3 className="text-lg font-bold text-white mb-2">HoverWatch App</h3>
                <p className="text-xs text-zinc-400 leading-relaxed mb-6">
                  Dynamic watchOS / WearOS extension compiling secure single-use token hashes in under 0.2s. Emits encrypted RSSI pulses to trigger merchant detection.
                </p>
              </div>
              <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[10px] font-mono">
                <span className="text-zinc-500">PROVISION</span>
                <span className="text-brand-500 font-bold uppercase">Secured by WatchID</span>
              </div>
            </div>

            {/* Active NFC Band Card */}
            <div className="glass-card p-6 flex flex-col justify-between text-left relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-500/5 rounded-full blur-xl group-hover:bg-brand-500/10 transition-colors" />
              <div>
                <div className="w-12 h-12 rounded-xl bg-brand-500/5 border border-brand-500/10 flex items-center justify-center mb-6 text-2xl group-hover:scale-110 transition-transform">
                  ⚡
                </div>
                <h3 className="text-lg font-bold text-white mb-2">HoverBand (Silicon)</h3>
                <p className="text-xs text-zinc-400 leading-relaxed mb-6">
                  High-durability hypoallergenic bands designed for university campuses and gated communities. Syncs with local registers for phone-free checkouts.
                </p>
              </div>
              <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[10px] font-mono">
                <span className="text-zinc-500">PROVISION</span>
                <span className="text-zinc-500 uppercase">Ready to Pair</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works / Interactive Mechanism */}
      <section className="py-24 px-6 bg-[#050508]/50 border-y border-white/5" id="how-it-works">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 text-left">
              <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-white mb-6">How Touchless UPI Works</h2>
              <p className="text-zinc-400 text-lg mb-8">HoverPay integrates seamlessly into standard UPI networks while modifying the client verification protocol.</p>
              
              <div className="space-y-4">
                {[
                  { title: "1. BLE Beacon Handshake", desc: "The platform listens for localized merchant beacons emitting via secure Bluetooth Low Energy (BLE) or NFC." },
                  { title: "2. Edge AI Risk Analysis", desc: "On-device AI checks merchant reputation, transaction frequency, and local coordinates to compute a safety score." },
                  { title: "3. Ambient Gesture Verification", desc: "A brief touchless hover gesture confirms physical intent. MediaPipe evaluates user hand landmarks instantly." },
                  { title: "4. Token Settlement", desc: "HoverPay launches the secure payment engine, settling via standardized UPI intent wrappers in under 1 second." }
                ].map((step, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveStep(idx)}
                    className={`w-full text-left p-4 rounded-xl transition-all border ${activeStep === idx ? 'bg-brand-500/5 border-brand-500/20 text-white' : 'border-transparent text-zinc-400 hover:bg-white/5'}`}
                  >
                    <h4 className="font-semibold text-sm mb-1">{step.title}</h4>
                    {activeStep === idx && <p className="text-xs text-zinc-400 mt-2 leading-relaxed">{step.desc}</p>}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 flex justify-center">
              <div className="w-full max-w-sm aspect-square bg-gradient-to-br from-brand-500/10 to-brand-purple/10 border border-white/10 rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden scanline">
                <div className="flex justify-between items-center text-xs font-mono text-zinc-500">
                  <span>ACTIVE MECHANISM STEP</span>
                  <span>0{activeStep + 1} / 04</span>
                </div>

                <div className="flex-1 flex items-center justify-center my-6">
                  {activeStep === 0 && (
                    <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-center">
                      <Radio className="text-brand-500 mx-auto animate-pulse" size={60} />
                      <p className="text-sm font-semibold text-white mt-4">BLE Beacon Scanning</p>
                      <p className="text-xs text-zinc-500 mt-1">Locating nearby registry endpoints</p>
                    </motion.div>
                  )}
                  {activeStep === 1 && (
                    <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-center">
                      <ShieldCheck className="text-brand-500 mx-auto" size={60} />
                      <p className="text-sm font-semibold text-white mt-4">Fraud Engine Score: 0.002%</p>
                      <p className="text-xs text-zinc-500 mt-1">AI transaction verification clean</p>
                    </motion.div>
                  )}
                  {activeStep === 2 && (
                    <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-center">
                      <Hand className="text-brand-500 mx-auto animate-bounce" size={60} />
                      <p className="text-sm font-semibold text-white mt-4">Physical Intent Detected</p>
                      <p className="text-xs text-zinc-500 mt-1">Landmark detection complete</p>
                    </motion.div>
                  )}
                  {activeStep === 3 && (
                    <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-center">
                      <CheckCircle2 className="text-brand-500 mx-auto" size={60} />
                      <p className="text-sm font-semibold text-white mt-4">Token Transmitted</p>
                      <p className="text-xs text-zinc-500 mt-1">UPI Ledger Settled Successfully</p>
                    </motion.div>
                  )}
                </div>

                <div className="flex gap-2">
                  <div className={`h-1 flex-1 rounded-full ${activeStep >= 0 ? 'bg-brand-500' : 'bg-white/10'}`} />
                  <div className={`h-1 flex-1 rounded-full ${activeStep >= 1 ? 'bg-brand-500' : 'bg-white/10'}`} />
                  <div className={`h-1 flex-1 rounded-full ${activeStep >= 2 ? 'bg-brand-500' : 'bg-white/10'}`} />
                  <div className={`h-1 flex-1 rounded-full ${activeStep >= 3 ? 'bg-brand-500' : 'bg-white/10'}`} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Security Enclave Pipeline Diagram */}
      <section className="py-24 px-6 relative" id="architecture">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-purple/20 bg-brand-purple/5 text-xs font-semibold text-brand-purple mb-4"
            >
              <ShieldCheck size={12} />
              <span>MILITARY-GRADE ENCLAVE ARCHITECTURE</span>
            </motion.div>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-white mb-4">Trust Engineering</h2>
            <p className="text-zinc-400 text-lg">Every transaction is fully isolated, encrypted, and processed directly over standard NPCI/UPI networks.</p>
          </div>

          <div className="bg-[#09090f] border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
            {/* Horizontal flow line with moving dot on desktop */}
            <div className="hidden lg:block absolute top-[44%] left-12 right-12 h-[2px] bg-gradient-to-r from-brand-purple via-brand-500 to-emerald-500 opacity-20 pointer-events-none" />

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative z-10">
              {[
                { 
                  step: 1, 
                  title: "Gesture Layer", 
                  sub: "Local Classifier",
                  badge: "100% On-Device", 
                  desc: "Analyzes hand landmark points in the browser using light TensorFlow JS models. Zero imagery leaves RAM.",
                  icon: "👋",
                  color: "border-brand-purple/30 text-brand-purple"
                },
                { 
                  step: 2, 
                  title: "Biometric Verification", 
                  sub: "Secure Enclave Match",
                  badge: "Hardware Sealed", 
                  desc: "Validates gesture landmarks against secure enclave vaults using hardware-backed cryptographic checks.",
                  icon: "👁️",
                  color: "border-brand-purple/30 text-brand-purple"
                },
                { 
                  step: 3, 
                  title: "Encrypted Token", 
                  sub: "Zero-Knowledge Hash",
                  badge: "AES-GCM-256", 
                  desc: "Compiles single-use, high-entropy token envelopes. Masks actual UPI IDs and PINs at the client layer.",
                  icon: "🔒",
                  color: "border-brand-500/30 text-brand-500"
                },
                { 
                  step: 4, 
                  title: "UPI Lite Infrastructure", 
                  sub: "Sub-Second Router",
                  badge: "Pre-loaded Enclave", 
                  desc: "Bypasses slow gateway roundtrips by routing tokens through localized secure cache vouchers.",
                  icon: "⚡",
                  color: "border-emerald-500/30 text-emerald-500"
                },
                { 
                  step: 5, 
                  title: "NPCI Settlement", 
                  sub: "Standardized Cleared",
                  badge: "RBI Compliant", 
                  desc: "Final clearance occurs directly on standard IMPS/UPI books, ensuring immediate money settlement.",
                  icon: "🏦",
                  color: "border-emerald-500/30 text-emerald-500"
                }
              ].map((node, idx) => (
                <div 
                  key={node.step}
                  onClick={() => setActivePipeStep(idx)}
                  className={`p-5 rounded-2xl border text-left cursor-pointer transition-all duration-300 relative flex flex-col justify-between min-h-[220px] ${
                    activePipeStep === idx 
                      ? 'bg-gradient-to-b from-[#0a0a14] to-black border-brand-500 shadow-[0_0_20px_rgba(0,255,170,0.06)]' 
                      : 'bg-[#030305]/60 border-white/5 hover:border-white/10 hover:bg-[#06060c]'
                  }`}
                >
                  <div className="absolute top-3 right-3 text-xs font-mono text-zinc-600 font-bold">0{node.step}</div>
                  
                  <div>
                    <div className="text-xl mb-4">{node.icon}</div>
                    <h4 className="font-bold text-white text-sm font-display tracking-tight leading-tight">{node.title}</h4>
                    <p className="text-[10px] text-zinc-500 font-mono mt-0.5">{node.sub}</p>
                  </div>

                  <div className="mt-6 space-y-2">
                    <span className="inline-block text-[8px] font-bold font-mono px-2 py-0.5 rounded bg-white/5 text-zinc-400 border border-white/5 uppercase">
                      {node.badge}
                    </span>
                    <p className="text-[10px] text-zinc-400 leading-relaxed line-clamp-3 md:line-clamp-none">
                      {node.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Interactive Terminal explainer board */}
            <div className="mt-8 pt-6 border-t border-white/5 flex items-start gap-4 bg-[#030305] p-5 rounded-2xl border border-white/5 text-left">
              <Terminal className="text-brand-500 shrink-0 mt-1" size={18} />
              <div className="space-y-1">
                <p className="text-xs font-mono text-brand-500 font-bold uppercase tracking-wider">SECURE PIPELINE CLEARANCE LOGS</p>
                <p className="text-xs text-zinc-300 font-mono leading-relaxed mt-1">
                  {activePipeStep === 0 && "LOG: [Gesture Layer] Hand pose points read locally inside canvas context. Coords normalized against standard hand shapes in 0.04s. Zero imagery stored or transmitted."}
                  {activePipeStep === 1 && "LOG: [Biometric verification] Checking device key integrity with Enclave secure key store. Signature verification complete. Session ID validated."}
                  {activePipeStep === 2 && "LOG: [Encrypted Token] ZKS key generation initialized. Ephemeral hash envelop generated: AES-GCM-256 encrypted. Original account identifiers completely isolated."}
                  {activePipeStep === 3 && "LOG: [UPI Lite Gateway] Routing payload through local secure cache ledger. Preloaded token pools bypass third-party server bottlenecks, reducing API latency to <0.3s."}
                  {activePipeStep === 4 && "LOG: [NPCI Bank Settlement] Payload authorized. Cleared directly over national banking gateways. Transaction successfully settled in real-time."}
                  {activePipeStep === null && "Hover or click on any node of the 5-stage secure architecture pipeline above to stream live cryptographic diagnostic logs."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Transaction Simulator Ledgers */}
      <section className="py-24 px-6 bg-[#050508]/50 border-t border-white/5">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="text-left">
              <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-white mb-6">Real-Time Transaction Ledger</h2>
              <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
                HoverPay handles hundreds of transactions globally. Here is a live stream of simulated touchless transactions resolving on the blockchain-backed ledger.
              </p>
              
              <div className="flex gap-4">
                <div className="bg-[#09090f] border border-white/5 p-4 rounded-2xl flex-1">
                  <span className="text-2xl font-bold text-white font-display">₹1,42,850</span>
                  <p className="text-xs text-zinc-500 mt-1">Volume Verified Today</p>
                </div>
                <div className="bg-[#09090f] border border-white/5 p-4 rounded-2xl flex-1">
                  <span className="text-2xl font-bold text-brand-500 font-display">99.99%</span>
                  <p className="text-xs text-zinc-500 mt-1">Verification Success</p>
                </div>
              </div>
            </div>

            {/* Live Ledger Ticker */}
            <div className="space-y-4">
              <div className="flex justify-between items-center px-4 text-xs font-mono text-zinc-500">
                <span>MERCHANT REGISTER</span>
                <span>STATUS / METHOD</span>
              </div>
              <div className="space-y-3">
                {liveTxns.map((txn) => (
                  <motion.div 
                    key={txn.id}
                    layoutId={`txn-${txn.id}`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-[#09090f] border border-white/5 rounded-2xl flex justify-between items-center hover:border-brand-500/20 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-500/10 flex items-center justify-center font-bold text-brand-500 text-sm">
                        ₹
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-semibold text-white">{txn.name}</p>
                        <p className="text-[10px] text-zinc-500 font-mono">{txn.city} • {txn.time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-white">₹{txn.amount}</span>
                      <p className="text-[9px] text-brand-500 font-mono font-bold mt-1 bg-brand-500/5 px-2 py-0.5 rounded border border-brand-500/10 inline-block">
                        {txn.verified}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Series A Roadmap */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-white mb-4">Future Ecosystem Roadmap</h2>
            <p className="text-zinc-400 text-lg">Our timeline from private beta to Series A and campus ecosystems.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <RoadmapCard 
              phase="PHASE 01"
              title="Core Touchless MVP"
              time="Q1 - Q2 2026"
              desc="Deploy local handpose classifier, dynamic QR simulation, and checkout terminals. Launch Closed Beta in 5 premium coffee networks."
              active
            />
            <RoadmapCard 
              phase="PHASE 02"
              title="Campus Ecosystems"
              time="Q3 - Q4 2026"
              desc="Integrate HoverID with gate transits, college cafeterias, gated residential communities, and university book stores."
            />
            <RoadmapCard 
              phase="PHASE 03"
              title="Hardware Sync"
              time="Q1 2027"
              desc="Release the HoverRing and HoverWatch wearable firmware integrations. Enable ultra-fast ambient metro gates."
            />
            <RoadmapCard 
              phase="PHASE 04"
              title="Series A Scale"
              time="Q2 2027"
              desc="Expand nationwide across 15+ metropolitan metro networks, corporate smart hubs, and multi-lane toll expressways."
            />
          </div>
        </div>
      </section>

      {/* Developer Call to Action & SDK Sandbox */}
      <section className="py-24 px-6 relative bg-gradient-to-b from-[#030303] to-brand-purple/10 border-t border-white/5" id="developers">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-500/20 bg-brand-500/5 text-xs font-semibold text-brand-500 mb-4"
            >
              <Terminal size={12} />
              <span>DEVELOPER PROTOCOL CORE</span>
            </motion.div>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-white mb-4">Build on the ambient layer.</h2>
            <p className="text-zinc-400 text-lg">Integrate our secure handpose classifier libraries and localized BLE handshake SDK in under 5 lines of code.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch mb-12">
            {/* Tabbed Code Snippet Column */}
            <div className="bg-[#09090f] border border-white/10 rounded-3xl p-6 text-left flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center pb-4 border-b border-white/5 mb-6 text-xs text-zinc-500 font-mono">
                  <span>SDK INITIALIZATION SNIPPETS</span>
                  <span>v2.1.0-beta</span>
                </div>
                
                <div className="bg-[#030305] border border-white/5 rounded-2xl p-5 font-mono text-xs text-zinc-400 overflow-x-auto min-h-[180px]">
                  <p className="text-zinc-600 font-semibold mb-2">// 1. Import secure ambient payment client</p>
                  <p className="text-brand-purple font-semibold">import <span className="text-white">HoverPayEnclave</span> from <span className="text-brand-500">'@hoverpay/sdk'</span>;</p>
                  <br />
                  <p className="text-zinc-600 font-semibold mb-2">// 2. Initiate sub-second ZKS session</p>
                  <p className="text-brand-purple font-semibold">const <span className="text-white">session</span> = <span className="text-brand-500">await</span> HoverPayEnclave.<span className="text-white">initiate</span>({'{'}</p>
                  <p className="pl-4">merchantId: <span className="text-brand-500">"STB-8890"</span>,</p>
                  <p className="pl-4">amount: <span className="text-white">340.00</span>,</p>
                  <p className="pl-4">currency: <span className="text-brand-500">"INR"</span></p>
                  <p className="text-brand-purple font-semibold">{'}'});</p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between text-[11px] font-mono text-zinc-500">
                <span>Supports: Node, iOS, Android, WearOS</span>
                <span className="text-brand-500">Get API Keys ➔</span>
              </div>
            </div>

            {/* Simulated Live Sandbox REST client */}
            <div className="bg-[#09090f] border border-white/10 rounded-3xl p-6 text-left flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center pb-4 border-b border-white/5 mb-6 text-xs text-zinc-500 font-mono">
                  <span>LIVE CRYPTO SANDBOX RUNNER</span>
                  <span className="text-brand-500 font-bold">API STATUS: ONLINE</span>
                </div>

                <div className="bg-[#030305] border border-white/5 rounded-2xl p-5 font-mono text-[10px] text-zinc-400 space-y-4">
                  <div>
                    <span className="text-brand-500 font-bold">POST</span> <span className="text-white">https://api.hoverpay.io/v1/settlements</span>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-zinc-600 font-bold">// Headers</p>
                    <p>Authorization: Bearer hpx_live_88920a</p>
                    <p>Content-Type: application/json</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-zinc-600 font-bold">// Response Body (CODE 200)</p>
                    <p className="text-emerald-400 font-bold">{'{'}</p>
                    <p className="pl-4">"status": <span className="text-white">"settled"</span>,</p>
                    <p className="pl-4">"txnRef": <span className="text-white">"438912889120"</span>,</p>
                    <p className="pl-4">"latencyMs": <span className="text-white">72</span>,</p>
                    <p className="pl-4">"enclaveVerify": <span className="text-brand-500 font-bold">true</span></p>
                    <p className="text-emerald-400 font-bold">{'}'}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between text-[11px] font-mono text-zinc-500">
                <span>Clears over standard UPI Lite intent wrappers</span>
                <span className="text-brand-purple">View Docs ➔</span>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <Link href="/pay" className="px-8 py-4 bg-brand-500 text-black font-bold rounded-xl hover:bg-brand-600 transition-all flex items-center gap-2">
              Launch Live App <Sparkles size={16} />
            </Link>
            <a href="#architecture" className="px-8 py-4 bg-white/5 border border-white/10 text-white font-semibold rounded-xl hover:bg-white/10 transition-all text-center">
              Explore Enclave Specs
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#030303] py-12 px-6">
        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-500">
              <Hand size={16} />
            </div>
            <span className="font-display font-semibold text-white">HoverPay</span>
          </div>
          <p className="text-zinc-500 text-xs">© 2026 HoverPay Technologies, Inc. All rights reserved. Registered UPI Merchant Network.</p>
          <div className="flex gap-6 text-xs text-zinc-500">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Security Audit</a>
          </div>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({ icon, title, desc }: any) {
  return (
    <div className="glass-card p-6 flex flex-col items-start text-left relative overflow-hidden group">
      <div className="w-12 h-12 rounded-xl bg-brand-500/5 border border-brand-500/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-xs text-zinc-400 leading-relaxed">{desc}</p>
    </div>
  );
}

function ArchColumn({ title, subtitle, children }: any) {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-semibold text-white">{title}</h4>
        <p className="text-[10px] text-zinc-500 mt-0.5">{subtitle}</p>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

interface ArchNodeProps {
  id: string;
  title: string;
  desc: string;
  activeNode: string | null;
  setActiveNode: (id: string | null) => void;
}

function ArchNode({ id, title, desc, activeNode, setActiveNode }: ArchNodeProps) {
  const isActive = activeNode === id;
  return (
    <div 
      onMouseEnter={() => setActiveNode(id)}
      onMouseLeave={() => setActiveNode(null)}
      className={`p-4 rounded-xl border text-left cursor-pointer transition-all duration-300 ${
        isActive 
          ? 'bg-brand-500/5 border-brand-500/30 shadow-[0_0_15px_rgba(0,255,170,0.05)]' 
          : 'bg-[#050508]/50 border-white/5 hover:border-white/20'
      }`}
    >
      <div className="flex justify-between items-center">
        <span className="text-xs font-semibold text-white">{title}</span>
        <ChevronRight size={12} className={`text-zinc-500 transition-transform ${isActive ? 'rotate-90 text-brand-500' : ''}`} />
      </div>
      <p className="text-[10px] text-zinc-500 mt-1.5 leading-relaxed">{desc}</p>
    </div>
  );
}

function RoadmapCard({ phase, title, time, desc, active }: any) {
  return (
    <div className={`p-6 rounded-2xl border text-left flex flex-col justify-between ${
      active 
        ? 'bg-brand-500/5 border-brand-500/20 shadow-[0_0_20px_rgba(0,255,170,0.05)]' 
        : 'bg-[#09090f] border-white/5'
    }`}>
      <div>
        <div className="flex justify-between items-center mb-4">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${active ? 'bg-brand-500/20 text-brand-500 border border-brand-500/20' : 'bg-white/5 text-zinc-500'}`}>
            {phase}
          </span>
          <span className="text-[10px] text-zinc-500 font-mono font-bold">{time}</span>
        </div>
        <h4 className="font-semibold text-white text-sm mb-2">{title}</h4>
        <p className="text-xs text-zinc-400 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}