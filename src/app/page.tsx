"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Hand, Smartphone, ShieldCheck, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen selection:bg-brand-500/30 flex flex-col">
      <nav className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <Hand size={18} />
            </div>
            <span className="font-semibold text-zinc-100">HoverPay</span>
          </Link>
          <div className="hidden md:flex gap-6 text-sm font-medium text-zinc-400">
            <Link href="#features" className="hover:text-zinc-100 transition-colors">Features</Link>
            <Link href="/dashboard" className="hover:text-zinc-100 transition-colors">Consumer</Link>
            <Link href="/merchant" className="hover:text-zinc-100 transition-colors">Merchant Portal</Link>
          </div>
          <Link href="/pay" className="text-sm font-medium bg-zinc-100 text-zinc-900 px-4 py-2 rounded-lg hover:bg-zinc-200 transition-colors">
            Try Demo
          </Link>
        </div>
      </nav>

      <section className="flex-1 container mx-auto px-6 pt-24 pb-16 flex flex-col items-center text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/50 text-xs font-medium text-emerald-400 mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Live on UPI Network
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl font-bold tracking-tight text-zinc-100 max-w-3xl mb-6"
        >
          The smart confirmation layer for your <span className="text-emerald-500">UPI payments.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-zinc-400 text-lg md:text-xl max-w-2xl mb-10"
        >
          HoverPay uses on-device gesture verification to authorize transactions before seamlessly handing off to your favorite UPI app like Google Pay or PhonePe.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link href="/pay" className="px-6 py-3 bg-emerald-500 text-zinc-950 font-semibold rounded-xl hover:bg-emerald-400 transition-colors flex items-center justify-center gap-2">
            Scan & Pay Demo <ArrowRight size={18} />
          </Link>
          <Link href="/dashboard" className="px-6 py-3 bg-zinc-900 border border-zinc-800 text-zinc-100 font-semibold rounded-xl hover:bg-zinc-800 transition-colors flex items-center justify-center">
            Open Dashboard
          </Link>
        </motion.div>
      </section>

      <section className="bg-zinc-900/30 border-t border-zinc-800 py-20" id="features">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Smartphone className="text-emerald-500" size={24} />}
            title="Real UPI Intents"
            desc="No closed ecosystems. Once verified, we securely launch your installed UPI app with exact merchant details pre-filled."
          />
          <FeatureCard 
            icon={<Hand className="text-emerald-500" size={24} />}
            title="On-Device Gestures"
            desc="Using MediaPipe, your hand geometry is processed locally on your phone in milliseconds. No video leaves your device."
          />
          <FeatureCard 
            icon={<ShieldCheck className="text-emerald-500" size={24} />}
            title="Frictionless Security"
            desc="Add a physical confirmation step to prevent accidental scans and verify intent, especially in crowded merchant environments."
          />
        </div>
      </section>
    </main>
  );
}

function FeatureCard({ icon, title, desc }: any) {
  return (
    <div className="glass-panel p-6 hover:bg-zinc-800/50 transition-colors">
      <div className="w-12 h-12 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-zinc-100 mb-2">{title}</h3>
      <p className="text-sm text-zinc-400 leading-relaxed">{desc}</p>
    </div>
  )
}