"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { 
  Hand, Smartphone, ShieldCheck, ArrowRight, Zap, Cpu, Sparkles, 
  Layers, Lock, Eye, Wifi, RefreshCw, BarChart3, Radio, ArrowUpRight, 
  Users, CheckCircle2, ChevronRight, Activity, Terminal
} from "lucide-react";

export default function Home() {
  const [activeStep, setActiveStep] = useState(0);
  const [activeNode, setActiveNode] = useState<string | null>(null);
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
              <span>THE NEXT-GEN UPI STANDARDS</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.1] mb-6"
            >
              Payments at the speed of a <span className="text-gradient-purple font-extrabold">gesture.</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-zinc-400 text-lg md:text-xl max-w-xl mb-8 leading-relaxed"
            >
              HoverPay utilizes background BLE ambient scans and touchless gesture models to bypass standard QR codes, confirming payments instantly in under 1 second.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link href="/pay" className="px-6 py-4 bg-brand-500 text-black font-bold rounded-xl hover:bg-brand-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-500/10">
                Try Touchless Demo <ArrowRight size={18} />
              </Link>
              <Link href="/dashboard" className="px-6 py-4 bg-white/5 border border-white/10 hover:border-white/20 text-white font-semibold rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                Open Smart Wallet
              </Link>
            </motion.div>

            {/* Micro Stats */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-3 gap-6 border-t border-white/5 pt-10 mt-12"
            >
              <div>
                <p className="text-2xl font-bold text-white font-display">0.8s</p>
                <p className="text-xs text-zinc-500 mt-1">Average Latency</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white font-display">0.01%</p>
                <p className="text-xs text-zinc-500 mt-1">Fraud Risk Score</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white font-display">Zero</p>
                <p className="text-xs text-zinc-500 mt-1">Tap Interaction</p>
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
              <div className="absolute -inset-1 rounded-[40px] bg-gradient-to-r from-brand-500 to-brand-purple opacity-30 blur-2xl group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
              
              <div className="relative bg-[#09090f] border border-white/10 rounded-[36px] p-6 shadow-2xl">
                {/* Phone Notch */}
                <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-full flex items-center justify-center gap-1.5 px-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                  <div className="flex-1 h-1.5 bg-zinc-900 rounded-full" />
                </div>

                {/* Simulated Screen */}
                <div className="mt-6 rounded-2xl bg-black border border-white/5 p-4 flex flex-col items-center">
                  <div className="w-full flex justify-between items-center mb-6 text-xs text-zinc-400 font-mono">
                    <span>Active BLE Beacon</span>
                    <span className="flex items-center gap-1 text-brand-500">
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-500 animate-ping" />
                      Searching...
                    </span>
                  </div>

                  {/* Merchant card prediction */}
                  <div className="w-full bg-[#0a0a0f] border border-brand-500/10 rounded-2xl p-4 flex items-center gap-4 mb-6 relative">
                    <div className="absolute -top-2.5 left-4 bg-brand-500/10 text-brand-500 border border-brand-500/20 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">
                      AI Ambient Prediction
                    </div>
                    <div className="w-10 h-10 rounded-full bg-brand-500/10 flex items-center justify-center text-xl">☕</div>
                    <div className="text-left flex-1">
                      <p className="font-semibold text-white text-sm">Starbucks Register 3</p>
                      <p className="text-[10px] text-zinc-500">Predicted location • Cafe Coffee</p>
                    </div>
                    <div className="text-right text-[10px] text-brand-500 bg-brand-500/5 border border-brand-500/10 px-2 py-1 rounded-md">
                      0.3m
                    </div>
                  </div>

                  {/* Gesture Detection Circle */}
                  <div className="w-48 h-48 rounded-full border-2 border-dashed border-white/10 flex items-center justify-center relative mb-6">
                    <div className="absolute inset-2 rounded-full border border-brand-500/20 radar-ring" />
                    <div className="absolute inset-6 rounded-full bg-brand-500/5 flex flex-col items-center justify-center">
                      <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="text-brand-500"
                      >
                        <Hand size={36} />
                      </motion.div>
                      <p className="text-[10px] text-zinc-400 font-mono mt-3 uppercase tracking-wider">Hover Hand</p>
                    </div>
                  </div>

                  {/* Quick Card Pay */}
                  <div className="w-full bg-zinc-900/50 border border-white/5 rounded-xl p-3 flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-4 bg-brand-purple rounded" />
                      <span className="font-medium text-white">ICICI Emerald Credit</span>
                    </div>
                    <span className="text-zinc-400">Total: ₹340</span>
                  </div>
                </div>

                <div className="mt-4 text-center">
                  <p className="text-xs text-zinc-500 font-mono">Ambient Secure Token Auth V2.1</p>
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

      {/* Developer Architecture Diagram */}
      <section className="py-24 px-6" id="architecture">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-white mb-4">Technical Architecture</h2>
            <p className="text-zinc-400 text-lg">High-security tokenization integrated with local device hardware.</p>
          </div>

          <div className="bg-[#09090f] border border-white/10 rounded-3xl p-6 md:p-10 relative">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Architecture Columns */}
              <ArchColumn title="1. Edge Environment" subtitle="Device hardware layer">
                <ArchNode 
                  id="handpose"
                  title="Local Handpose Classifier" 
                  desc="MediaPipe landmarks analyzed locally via WebGL." 
                  activeNode={activeNode}
                  setActiveNode={setActiveNode}
                />
                <ArchNode 
                  id="ble"
                  title="BLE Beacon Sensor" 
                  desc="RSSI scanning triggers merchant prediction." 
                  activeNode={activeNode}
                  setActiveNode={setActiveNode}
                />
              </ArchColumn>

              <ArchColumn title="2. Token Isolation Vault" subtitle="Secure transaction compiler">
                <ArchNode 
                  id="vault"
                  title="Decentralized Identity (HoverID)" 
                  desc="Masks standard UPI details, generating single-use hash envelopes." 
                  activeNode={activeNode}
                  setActiveNode={setActiveNode}
                />
                <ArchNode 
                  id="fraud"
                  title="On-Device Risk Classifier" 
                  desc="Local isolation forest evaluating transaction anomalies." 
                  activeNode={activeNode}
                  setActiveNode={setActiveNode}
                />
              </ArchColumn>

              <ArchColumn title="3. UPI / Ledger settlement" subtitle="Standardized banking backend">
                <ArchNode 
                  id="gateway"
                  title="HoverPay Router Gateway" 
                  desc="Maps secure tokens into valid UPI Intent protocols." 
                  activeNode={activeNode}
                  setActiveNode={setActiveNode}
                />
                <ArchNode 
                  id="ledger"
                  title="NPCI / Bank Settlement" 
                  desc="Final clearance over traditional banking systems." 
                  activeNode={activeNode}
                  setActiveNode={setActiveNode}
                />
              </ArchColumn>
            </div>

            {/* Interactive Info Board */}
            <div className="mt-8 pt-6 border-t border-white/5 flex items-start gap-3 bg-[#030305] p-4 rounded-2xl border border-white/5">
              <Terminal className="text-brand-500 shrink-0 mt-1" size={18} />
              <div className="text-left">
                <p className="text-xs font-mono text-brand-500 font-bold uppercase tracking-wider">SYSTEM DIAGRAM EXPLAINER</p>
                <p className="text-sm text-zinc-300 mt-1">
                  {activeNode === "handpose" && "Handpose coordinates are evaluated directly on the device using Tensorflow JS. Images are read as local tensor objects and dropped immediately from RAM."}
                  {activeNode === "ble" && "Bluetooth signals estimate distance from active terminal nodes using RSSI data. When distance drops below the set threshold, transaction flow initializes."}
                  {activeNode === "vault" && "HoverID is a secure key-vault that generates cryptographic transaction envelopes. It guarantees zero leakage of banking tokens."}
                  {activeNode === "fraud" && "AI Fraud check runs in 0.05s, comparing history to detect anomalies before launching network calls."}
                  {activeNode === "gateway" && "The secure gateway handshakes directly with banking nodes, routing transactions into standard UPI Intents."}
                  {activeNode === "ledger" && "NPCI handles the underlying money movement via IMPS/UPI Lite protocols, registering settlement on standard bank books."}
                  {!activeNode && "Hover over any node of the architecture flow above to explore technical specifics, security credentials, and processing details."}
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

      {/* Developer Call to Action */}
      <section className="py-24 px-6 relative bg-gradient-to-b from-transparent to-brand-purple/10 border-t border-white/5">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="font-display text-4xl sm:text-6xl font-extrabold text-white mb-6">Redesigning payments. Join the protocol.</h2>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            HoverPay is fully open for developers. Get access to our secure gesture SDK and local classifier libraries to integrate touchless payments today.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/pay" className="px-8 py-4 bg-brand-500 text-black font-bold rounded-xl hover:bg-brand-600 transition-all flex items-center gap-2">
              Launch Live App <Sparkles size={16} />
            </Link>
            <Link href="/dashboard" className="px-8 py-4 bg-white/5 border border-white/10 text-white font-semibold rounded-xl hover:bg-white/10 transition-all">
              Developer Docs
            </Link>
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